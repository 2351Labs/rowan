import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { createSvgElement } from "../chart/dom.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const VIEWBOX_WIDTH = 200;
const VIEWBOX_HEIGHT = 136;
const CX = 100;
const CY = 100;
const OUTER = 88;
const INNER = 64;
const MID = (OUTER + INNER) / 2;
const BAND = OUTER - INNER;
const NEEDLE = 76;
const TICKS = [0, 0.25, 0.5, 0.75, 1];

/**
 * @typedef {object} RowanGaugeChartRange
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

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

/**
 * @param {unknown} value
 * @returns {RowanGaugeChartRange[]}
 */
function normalizeGaugeRanges(value) {
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

function point(radius, t) {
  const theta = Math.PI * (1 - t);
  return [CX + radius * Math.cos(theta), CY - radius * Math.sin(theta)];
}

function bandPath(t0, t1) {
  const start = clamp01(t0);
  const end = clamp01(t1);
  if (end <= start) return "";
  const steps = Math.max(4, Math.round((end - start) * 32));
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const [x, y] = point(MID, start + ((end - start) * i) / steps);
    d += `${i === 0 ? "M" : " L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return d;
}

/**
 * Compact speedometer gauge: ranges, min/max, actual, and optional target.
 * Experimental. Separate host from bullet and donut charts.
 * @tag rowan-gauge-chart
 * @attr {string} label
 * @attr {number} min
 * @attr {number} max
 * @property {number | null} value - Actual measure. Property-only. Null is no-data.
 * @property {number | null} target - Target tick. Property-only. Null hides the tick.
 * @property {RowanGaugeChartRange[]} ranges - Qualitative bands. Arrays are property-only.
 * @csspart chart
 * @csspart plot
 * @csspart track
 * @csspart range
 * @csspart needle
 * @csspart hub
 * @csspart target
 * @csspart readout
 * @csspart tick-label
 * @csspart table
 * @cssprop --rowan-gauge-chart-needle
 * @cssprop --rowan-gauge-chart-track
 * @cssprop --rowan-gauge-chart-range
 * @cssprop --rowan-gauge-chart-target
 */
export class RowanGaugeChart extends BaseElement {
  static styleUrl = new URL("./gauge-chart.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "min", "max"];
  static upgradeProperties = ["label", "min", "max", "value", "target", "ranges"];
  static componentTokenPrefixes = ["--rowan-gauge-chart-"];

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

  get min() {
    return this.readNumber("min", 0);
  }

  set min(value) {
    const next = normalizeNumber(value);
    this.reflectNumber("min", next === null ? 0 : next);
  }

  get max() {
    return this.readNumber("max", 100);
  }

  set max(value) {
    const next = normalizeNumber(value);
    this.reflectNumber("max", next === null ? 100 : next);
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

  /** @returns {RowanGaugeChartRange[]} */
  get ranges() {
    return cloneRanges(this.#ranges);
  }

  /** @param {RowanGaugeChartRange[]} value */
  set ranges(value) {
    this.#ranges = normalizeGaugeRanges(value);
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

  #scale() {
    let min = this.min;
    let max = this.max;
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
      min = 0;
      max = 100;
    }
    return { min, max, span: max - min };
  }

  #t(value, scale) {
    return clamp01((value - scale.min) / scale.span);
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const scale = this.#scale();

    const track = createSvgElement("path");
    track.setAttribute("class", "track");
    track.setAttribute("part", "track");
    track.setAttribute("stroke-width", String(BAND));
    track.setAttribute("d", bandPath(0, 1));
    fragment.append(track);

    for (const range of this.#ranges) {
      const d = bandPath(this.#t(range.from, scale), this.#t(range.to, scale));
      if (!d) continue;
      const band = createSvgElement("path");
      band.setAttribute("class", "range");
      band.setAttribute("part", "range");
      band.setAttribute("data-tone", range.tone);
      band.setAttribute("stroke-width", String(BAND));
      band.setAttribute("d", d);
      fragment.append(band);
    }

    for (const t of TICKS) {
      const [x1, y1] = point(OUTER - 1, t);
      const [x2, y2] = point(OUTER + 5, t);
      const tick = createSvgElement("line");
      tick.setAttribute("class", "tick");
      tick.setAttribute("x1", x1.toFixed(2));
      tick.setAttribute("y1", y1.toFixed(2));
      tick.setAttribute("x2", x2.toFixed(2));
      tick.setAttribute("y2", y2.toFixed(2));
      fragment.append(tick);
    }

    const minLabel = createSvgElement("text");
    minLabel.setAttribute("class", "tick-label");
    minLabel.setAttribute("part", "tick-label");
    minLabel.setAttribute("x", String(CX - OUTER));
    minLabel.setAttribute("y", String(CY + 16));
    minLabel.setAttribute("text-anchor", "start");
    minLabel.textContent = String(scale.min);
    fragment.append(minLabel);

    const maxLabel = createSvgElement("text");
    maxLabel.setAttribute("class", "tick-label");
    maxLabel.setAttribute("part", "tick-label");
    maxLabel.setAttribute("x", String(CX + OUTER));
    maxLabel.setAttribute("y", String(CY + 16));
    maxLabel.setAttribute("text-anchor", "end");
    maxLabel.textContent = String(scale.max);
    fragment.append(maxLabel);

    if (this.#target !== null) {
      const t = this.#t(this.#target, scale);
      const [x1, y1] = point(OUTER + 2, t);
      const [x2, y2] = point(INNER - 2, t);
      const mark = createSvgElement("line");
      mark.setAttribute("class", "target");
      mark.setAttribute("part", "target");
      mark.setAttribute("x1", x1.toFixed(2));
      mark.setAttribute("x2", x2.toFixed(2));
      mark.setAttribute("y1", y1.toFixed(2));
      mark.setAttribute("y2", y2.toFixed(2));
      fragment.append(mark);
    }

    if (this.#value !== null) {
      const [nx, ny] = point(NEEDLE, this.#t(this.#value, scale));
      const needle = createSvgElement("line");
      needle.setAttribute("class", "needle");
      needle.setAttribute("part", "needle");
      needle.setAttribute("x1", String(CX));
      needle.setAttribute("y1", String(CY));
      needle.setAttribute("x2", nx.toFixed(2));
      needle.setAttribute("y2", ny.toFixed(2));
      fragment.append(needle);
    }

    const hub = createSvgElement("circle");
    hub.setAttribute("class", "hub");
    hub.setAttribute("part", "hub");
    hub.setAttribute("cx", String(CX));
    hub.setAttribute("cy", String(CY));
    hub.setAttribute("r", "5");
    fragment.append(hub);

    const readout = createSvgElement("text");
    readout.setAttribute("class", "readout");
    readout.setAttribute("part", "readout");
    readout.setAttribute("x", String(CX));
    readout.setAttribute("y", String(CY + 30));
    readout.setAttribute("text-anchor", "middle");
    readout.textContent = this.#value === null ? "—" : String(this.#value);
    fragment.append(readout);

    this.#plot.replaceChildren(fragment);
  }

  #renderTable() {
    const caption = document.createElement("caption");
    caption.textContent = this.label || "Gauge chart";
    const body = document.createElement("tbody");
    const scale = this.#scale();

    for (const [name, value] of [
      ["Minimum", scale.min],
      ["Maximum", scale.max],
    ]) {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = name;
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.append(heading, cell);
      body.append(row);
    }

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
      this.internals.role = "meter";
    }

    const scale = this.#scale();
    if (
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      "ariaLabel" in this.internals
    ) {
      this.internals.ariaLabel = this.label || "Gauge chart";
    }
    if ("ariaValueMin" in this.internals) this.internals.ariaValueMin = String(scale.min);
    if ("ariaValueMax" in this.internals) this.internals.ariaValueMax = String(scale.max);
    if ("ariaValueNow" in this.internals) {
      this.internals.ariaValueNow = this.#value === null ? null : String(this.#value);
    }
  }
}

define("rowan-gauge-chart", RowanGaugeChart);
