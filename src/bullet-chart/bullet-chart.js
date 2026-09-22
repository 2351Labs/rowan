import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { createSvgElement } from "../chart/dom.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 24;
const PLOT_PAD = 1.5;

/**
 * @typedef {object} RowanBulletChartRange
 * @property {number} from
 * @property {number} to
 * @property {string} [label]
 * @property {"neutral"|"info"|"success"|"warning"|"danger"} [tone]
 */

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

/**
 * @param {unknown} value
 * @returns {RowanBulletChartRange[]}
 */
function normalizeBulletRanges(value) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    let from = normalizeNumber(item.from);
    let to = normalizeNumber(item.to);
    if (from === null || to === null || from === to) return [];
    if (from > to) [from, to] = [to, from];
    const tone = TONES.has(item.tone) ? item.tone : "neutral";
    return [{ from, to, label: normalizeText(item.label) || `Range ${index + 1}`, tone }];
  });
}

function cloneRanges(ranges) {
  return ranges.map((item) => ({ ...item }));
}

/**
 * Compact qualitative comparison: ranges, actual, and target. Experimental.
 * Separate host from sparkline and bar chart.
 * @tag rowan-bullet-chart
 * @attr {string} label
 * @property {number | null} value - Actual measure. Property-only. Null is no-data.
 * @property {number | null} target - Target marker. Property-only. Null hides the marker.
 * @property {RowanBulletChartRange[]} ranges - Qualitative bands. Arrays are property-only.
 * @csspart chart
 * @csspart plot
 * @csspart range
 * @csspart actual
 * @csspart target
 * @csspart table
 * @cssprop --rowan-bullet-chart-actual
 * @cssprop --rowan-bullet-chart-target
 * @cssprop --rowan-bullet-chart-range
 */
export class RowanBulletChart extends BaseElement {
  static styleUrl = new URL("./bullet-chart.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label"];
  static upgradeProperties = ["label", "value", "target", "ranges"];
  static componentTokenPrefixes = ["--rowan-bullet-chart-"];

  #chart = null;
  #plot = null;
  #table = null;
  #value = null;
  #target = null;
  #ranges = [];

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  /** @returns {number | null} */
  get value() {
    return this.#value;
  }

  /** @param {number | null} value */
  set value(value) {
    this.#value = normalizeNumber(value);
    this.requestRender();
  }

  /** @returns {number | null} */
  get target() {
    return this.#target;
  }

  /** @param {number | null} value */
  set target(value) {
    this.#target = normalizeNumber(value);
    this.requestRender();
  }

  /** @returns {RowanBulletChartRange[]} */
  get ranges() {
    return cloneRanges(this.#ranges);
  }

  /** @param {RowanBulletChartRange[]} value */
  set ranges(value) {
    this.#ranges = normalizeBulletRanges(value);
    this.requestRender();
  }

  render() {
    if (!this.#chart) {
      this.renderRoot.innerHTML = `
        <div class="chart" part="chart">
          <svg class="plot" part="plot" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" role="presentation"></svg>
          <table class="table" part="table"></table>
        </div>
      `;
      this.#chart = this.renderRoot.querySelector(".chart");
      this.#plot = this.renderRoot.querySelector(".plot");
      this.#table = this.renderRoot.querySelector(".table");
    }

    this.#renderPlot();
    this.#renderTable();
    this.#applyDefaultA11y();
  }

  #domain() {
    const numbers = [
      ...this.#ranges.flatMap((item) => [item.from, item.to]),
      this.#value,
      this.#target,
    ].filter((item) => item !== null);
    if (numbers.length === 0) return null;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    return { min, max, span: max === min ? 1 : max - min };
  }

  #x(value, domain) {
    return PLOT_PAD + ((value - domain.min) / domain.span) * (VIEWBOX_WIDTH - PLOT_PAD * 2);
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const domain = this.#domain();
    if (!domain) {
      this.#plot.replaceChildren(fragment);
      return;
    }

    for (const range of this.#ranges) {
      const x = this.#x(range.from, domain);
      const width = this.#x(range.to, domain) - x;
      if (width <= 0) continue;
      const band = createSvgElement("rect");
      band.setAttribute("class", "range");
      band.setAttribute("part", "range");
      band.setAttribute("data-tone", range.tone);
      band.setAttribute("x", x.toFixed(2));
      band.setAttribute("y", "2");
      band.setAttribute("width", width.toFixed(2));
      band.setAttribute("height", "20");
      fragment.append(band);
    }

    if (this.#value !== null) {
      const start = this.#x(Math.min(this.#value, domain.min), domain);
      const end = this.#x(Math.max(this.#value, domain.min), domain);
      const width = Math.max(end - start, 0.5);
      const bar = createSvgElement("rect");
      bar.setAttribute("class", "actual");
      bar.setAttribute("part", "actual");
      bar.setAttribute("x", start.toFixed(2));
      bar.setAttribute("y", "8");
      bar.setAttribute("width", width.toFixed(2));
      bar.setAttribute("height", "8");
      fragment.append(bar);
    }

    if (this.#target !== null) {
      const x = this.#x(this.#target, domain).toFixed(2);
      const mark = createSvgElement("line");
      mark.setAttribute("class", "target");
      mark.setAttribute("part", "target");
      mark.setAttribute("x1", x);
      mark.setAttribute("x2", x);
      mark.setAttribute("y1", "3");
      mark.setAttribute("y2", "21");
      fragment.append(mark);
    }

    this.#plot.replaceChildren(fragment);
  }

  #renderTable() {
    const caption = document.createElement("caption");
    caption.textContent = this.label || "Bullet chart";
    const body = document.createElement("tbody");

    for (const range of this.#ranges) {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = range.label;
      const cell = document.createElement("td");
      cell.textContent = `${range.from}–${range.to}`;
      row.append(heading, cell);
      body.append(row);
    }

    for (const [name, value] of [
      ["Actual", this.#value],
      ["Target", this.#target],
    ]) {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = name;
      const cell = document.createElement("td");
      cell.textContent = value === null ? "No data" : String(value);
      row.append(heading, cell);
      body.append(row);
    }

    this.#table.replaceChildren(caption, body);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      "ariaLabel" in this.internals
    ) {
      this.internals.ariaLabel = this.label || "Bullet chart";
    }
  }
}

define("rowan-bullet-chart", RowanBulletChart);
