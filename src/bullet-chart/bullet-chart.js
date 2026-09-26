import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { createSvgElement } from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, formatHoverLines } from "../chart/hover.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const ENCODINGS = new Set(["ink", "accent", "status", "tone"]);
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 28;
const PLOT_PAD_X = 1.25;
const PLOT_Y = 1.5;
const PLOT_H = 16;
const SCALE_Y = PLOT_Y + PLOT_H;
const TICK_LEN = 1.6;
const LABEL_Y = SCALE_Y + 4.6;
const ACTUAL_H = PLOT_H / 3;
const ACTUAL_Y = PLOT_Y + (PLOT_H - ACTUAL_H) / 2;
const TARGET_H = PLOT_H * 0.72;
const TARGET_Y1 = PLOT_Y + (PLOT_H - TARGET_H) / 2;
const TARGET_Y2 = TARGET_Y1 + TARGET_H;

const RANGE_INTENSITY = {
  2: [40, 10],
  3: [40, 25, 10],
  4: [50, 35, 20, 10],
  5: [50, 35, 20, 10, 3],
};

const STATUS_STOPS = {
  2: ["poor", "good"],
  3: ["poor", "mid", "good"],
  4: ["poor", "poor", "mid", "good"],
  5: ["poor", "poor", "mid", "good", "good"],
};

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

function normalizeBooleanAttribute(value) {
  if (value === false || value === null || value === undefined) return false;
  if (value === true) return true;
  const text = String(value).trim().toLowerCase();
  return text !== "false" && text !== "0";
}

/**
 * @param {unknown} value
 * @returns {RowanBulletChartRange[]}
 */
function normalizeBulletRanges(value) {
  if (!Array.isArray(value)) return [];

  const ranges = value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    let from = normalizeNumber(item.from);
    let to = normalizeNumber(item.to);
    if (from === null || to === null || from === to) return [];
    if (from > to) [from, to] = [to, from];
    const tone = TONES.has(item.tone) ? item.tone : "neutral";
    return [{ from, to, label: normalizeText(item.label) || `Range ${index + 1}`, tone }];
  });

  ranges.sort((a, b) => a.from - b.from || a.to - b.to);
  return ranges;
}

function cloneRanges(ranges) {
  return ranges.map((item) => ({ ...item }));
}

function niceStep(span) {
  if (!(span > 0)) return 1;
  const rough = span / 4;
  const mag = 10 ** Math.floor(Math.log10(rough));
  return [1, 2, 2.5, 5, 10].map((n) => n * mag).find((n) => span / n <= 6) ?? mag;
}

function formatTick(value) {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(value);
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

/**
 * Compact qualitative comparison after Stephen Few's bullet graph spec.
 * @tag rowan-bullet-chart
 * @attr {string} label
 * @attr {boolean} scale - Show quantitative ticks. Default true.
 * @attr {"higher"|"lower"} intent - Dark bands encode poor performance.
 * @attr {"ink"|"accent"|"status"|"tone"} encoding - Range fill. `ink` grayscale (default). `accent` one theme hue. `status` poor→good mix. `tone` per-range hues.
 * @property {number | null} value
 * @property {number | null} target
 * @property {RowanBulletChartRange[]} ranges
 * @csspart chart
 * @csspart plot
 * @csspart range
 * @csspart actual
 * @csspart target
 * @csspart tick
 * @csspart hover
 * @csspart table
 */
export class RowanBulletChart extends BaseElement {
  static styleUrl = new URL("./bullet-chart.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "scale", "intent", "encoding"];
  static upgradeProperties = ["label", "value", "target", "ranges", "scale", "intent", "encoding"];
  static componentTokenPrefixes = ["--rowan-bullet-chart-"];

  #chart = null;
  #plot = null;
  #table = null;
  #hover = null;
  #value = null;
  #target = null;
  #ranges = [];

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get scale() {
    return this.hasAttribute("scale")
      ? normalizeBooleanAttribute(this.getAttribute("scale"))
      : true;
  }

  set scale(value) {
    if (value) this.removeAttribute("scale");
    else this.setAttribute("scale", "false");
    this.requestRender();
  }

  /** @returns {"higher" | "lower"} */
  get intent() {
    return this.getAttribute("intent") === "lower" ? "lower" : "higher";
  }

  set intent(value) {
    this.reflectString("intent", value === "lower" ? "lower" : null);
    this.requestRender();
  }

  /** @returns {"ink" | "accent" | "status" | "tone"} */
  get encoding() {
    return normalizeEnum(this.getAttribute("encoding"), ENCODINGS, "ink");
  }

  /** @param {"ink" | "accent" | "status" | "tone"} value */
  set encoding(value) {
    reflectEnum(this, "encoding", value, ENCODINGS, "ink");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "encoding" && rewriteEnumAttribute(this, name, newValue, ENCODINGS, "ink")) {
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
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
      this.#hover = createChartHoverBubble();
      this.#chart.append(this.#hover);
      bindChartHover(this, {
        target: this.#plot,
        bubble: this.#hover,
        textForEvent: () => this.#hoverText(),
      });
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
      0,
    ].filter((item) => item !== null);

    if (numbers.length === 0) return null;

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    return { min, max, span: max === min ? 1 : max - min };
  }

  #x(value, domain) {
    return PLOT_PAD_X + ((value - domain.min) / domain.span) * (VIEWBOX_WIDTH - PLOT_PAD_X * 2);
  }

  #ticks(domain) {
    const step = niceStep(domain.span);
    const start = Math.ceil(domain.min / step) * step;
    const ticks = [];
    for (let value = start; value <= domain.max + step / 1e6; value += step) {
      ticks.push(Number(value.toPrecision(12)));
    }
    if (ticks.length === 0 || Math.abs(ticks[0] - domain.min) > step / 100) {
      ticks.unshift(domain.min);
    }
    const last = ticks.at(-1);
    if (Math.abs(last - domain.max) > step / 100) ticks.push(domain.max);
    return ticks;
  }

  #rangeLevels() {
    const count = Math.min(Math.max(this.#ranges.length, 2), 5);
    const intensities = RANGE_INTENSITY[count] ?? RANGE_INTENSITY[3];
    const stops = STATUS_STOPS[count] ?? STATUS_STOPS[3];
    const levels = this.intent === "lower" ? [...intensities].reverse() : intensities;
    const status = this.intent === "lower" ? [...stops].reverse() : stops;
    return this.#ranges.map((range, index) => ({
      ...range,
      level: index,
      intensity: levels[Math.min(index, levels.length - 1)],
      status: status[Math.min(index, status.length - 1)],
    }));
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const domain = this.#domain();
    if (!domain) {
      this.#plot.replaceChildren(fragment);
      return;
    }

    for (const range of this.#rangeLevels()) {
      const x = this.#x(range.from, domain);
      const width = this.#x(range.to, domain) - x;
      if (width <= 0) continue;
      const band = createSvgElement("rect");
      band.setAttribute("class", "range");
      band.setAttribute("part", "range");
      band.setAttribute("data-tone", range.tone);
      band.setAttribute("data-level", String(range.level));
      band.setAttribute("data-intensity", String(range.intensity));
      band.setAttribute("data-status", range.status);
      band.style.setProperty("--range-ink", `${range.intensity}%`);
      band.setAttribute("x", x.toFixed(2));
      band.setAttribute("y", String(PLOT_Y));
      band.setAttribute("width", width.toFixed(2));
      band.setAttribute("height", String(PLOT_H));
      fragment.append(band);
    }

    if (this.scale) {
      for (const tickValue of this.#ticks(domain)) {
        const x = this.#x(tickValue, domain).toFixed(2);
        const tick = createSvgElement("line");
        tick.setAttribute("class", "tick");
        tick.setAttribute("part", "tick");
        tick.setAttribute("x1", x);
        tick.setAttribute("x2", x);
        tick.setAttribute("y1", String(SCALE_Y));
        tick.setAttribute("y2", (SCALE_Y + TICK_LEN).toFixed(2));
        fragment.append(tick);

        const label = createSvgElement("text");
        label.setAttribute("class", "tick-label");
        label.setAttribute("part", "tick-label");
        label.setAttribute("x", x);
        label.setAttribute("y", LABEL_Y.toFixed(2));
        label.textContent = formatTick(tickValue);
        fragment.append(label);
      }
    }

    if (this.#target !== null) {
      const x = this.#x(this.#target, domain).toFixed(2);
      const mark = createSvgElement("line");
      mark.setAttribute("class", "target");
      mark.setAttribute("part", "target");
      mark.setAttribute("x1", x);
      mark.setAttribute("x2", x);
      mark.setAttribute("y1", TARGET_Y1.toFixed(2));
      mark.setAttribute("y2", TARGET_Y2.toFixed(2));
      fragment.append(mark);
    }

    if (this.#value !== null) {
      const start = this.#x(Math.min(this.#value, domain.min), domain);
      const end = this.#x(this.#value, domain);
      const bar = createSvgElement("rect");
      bar.setAttribute("class", "actual");
      bar.setAttribute("part", "actual");
      bar.setAttribute("x", Math.min(start, end).toFixed(2));
      bar.setAttribute("y", ACTUAL_Y.toFixed(2));
      bar.setAttribute("width", Math.max(Math.abs(end - start), 0.8).toFixed(2));
      bar.setAttribute("height", ACTUAL_H.toFixed(2));
      fragment.append(bar);
    }

    this.#plot.replaceChildren(fragment);
  }

  #hoverText() {
    const range =
      this.#value === null
        ? null
        : this.#ranges.find((item) => this.#value >= item.from && this.#value <= item.to);
    return formatHoverLines([
      this.#value === null ? "" : `Actual ${this.#value}`,
      this.#target === null ? "" : `Target ${this.#target}`,
      range ? `${range.label} ${range.from}–${range.to}` : "",
    ]);
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
