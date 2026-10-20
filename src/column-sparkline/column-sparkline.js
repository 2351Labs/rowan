import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  bindChartHover,
  createChartHoverBubble,
  formatHoverLines,
  hideChartHover,
} from "../chart/hover.js";
import { createSvgElement } from "../chart/dom.js";
import { finiteOrNull } from "../chart/model.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 24;
const PLOT_PAD = 1.5;
const COLUMN_RATIO = 0.62;
const TARGET_DASH_PX = 4;
const TARGET_GAP_PX = 3;
const DEFAULT_ABOVE_TONE = "warning";
const DEFAULT_BELOW_TONE = "success";
const DEFAULT_MESSAGES = Object.freeze({
  chart: "Column sparkline",
  noData: "No data",
  point: "Point {index}",
  target: "Target",
});

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeValues(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => finiteOrNull(item));
}

function cloneValues(value) {
  return value.map((item) => item);
}

function derivedTone(values) {
  const finite = values.filter((item) => item !== null);
  if (finite.length < 2) return "neutral";
  const first = finite[0];
  const last = finite.at(-1);
  if (last > first) return "success";
  if (last < first) return "danger";
  return "neutral";
}

/** User-space dashes sized to CSS pixels. stroke-dasharray still scales with the viewBox. */
function dashedTargetPath(y, plotWidthPx) {
  const yValue = y.toFixed(2);
  if (!(plotWidthPx > 0)) return `M0,${yValue}H${VIEWBOX_WIDTH}`;

  const dash = (TARGET_DASH_PX * VIEWBOX_WIDTH) / plotWidthPx;
  const gap = (TARGET_GAP_PX * VIEWBOX_WIDTH) / plotWidthPx;
  const step = dash + gap;
  if (!(step > 0)) return `M0,${yValue}H${VIEWBOX_WIDTH}`;

  const parts = [];
  for (let x = 0; x < VIEWBOX_WIDTH; x += step) {
    const end = Math.min(x + dash, VIEWBOX_WIDTH);
    if (end <= x) break;
    parts.push(`M${x.toFixed(3)},${yValue}H${end.toFixed(3)}`);
  }
  return parts.join(" ");
}

/**
 * @typedef {object} RowanColumnSparklineMessages
 * @property {string} [chart]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [target]
 */

/**
 * Frozen compact one-series columns for KPI tiles. Not a density of
 * `rowan-bar-chart`. Not a `variant` of `rowan-sparkline`.
 * @tag rowan-column-sparkline
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [above-tone=warning] - Fill above target. Used when `target` is set.
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [below-tone=success] - Fill at or below target. Used when `target` is set.
 * @attr {string} locale
 * @property {Array<number | null>} values - One series. Arrays are property-only. Null is a gap.
 * @property {string[]} labels - Optional point labels for the accessible table. Arrays are property-only.
 * @property {number | null} target - Target value. Property-only. Null hides the split and the dashed line.
 * @property {RowanColumnSparklineMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart column
 * @csspart target
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-column-sparkline-height
 * @cssprop --rowan-column-sparkline-fill
 * @cssprop --rowan-column-sparkline-info
 * @cssprop --rowan-column-sparkline-success
 * @cssprop --rowan-column-sparkline-warning
 * @cssprop --rowan-column-sparkline-danger
 * @cssprop --rowan-column-sparkline-target
 * @cssprop --rowan-column-sparkline-target-width
 */
export class RowanColumnSparkline extends BaseElement {
  static styleUrl = new URL("./column-sparkline.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "tone", "above-tone", "below-tone", "locale"];
  static upgradeProperties = [
    "label",
    "tone",
    "aboveTone",
    "belowTone",
    "locale",
    "values",
    "labels",
    "target",
    "messages",
  ];
  static componentTokenPrefixes = ["--rowan-column-sparkline-"];

  #chart = null;
  #plot = null;
  #table = null;
  #hover = null;
  #values = [];
  #labels = [];
  #target = null;
  #targetY = null;
  #toneExplicit = false;
  #messages = {};
  #resizeObserver = null;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanColumnSparklineMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanColumnSparklineMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone() {
    if (this.#toneExplicit || this.hasAttribute("tone")) {
      return normalizeEnum(this.readString("tone", "neutral"), TONES, "neutral");
    }

    return derivedTone(this.#values);
  }

  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    this.#toneExplicit = true;
    reflectEnum(this, "tone", value, TONES, "neutral");
    this.requestRender();
  }

  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get aboveTone() {
    return normalizeEnum(
      this.readString("above-tone", DEFAULT_ABOVE_TONE),
      TONES,
      DEFAULT_ABOVE_TONE,
    );
  }

  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set aboveTone(value) {
    reflectEnum(this, "above-tone", value, TONES, DEFAULT_ABOVE_TONE);
  }

  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get belowTone() {
    return normalizeEnum(
      this.readString("below-tone", DEFAULT_BELOW_TONE),
      TONES,
      DEFAULT_BELOW_TONE,
    );
  }

  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set belowTone(value) {
    reflectEnum(this, "below-tone", value, TONES, DEFAULT_BELOW_TONE);
  }

  /** @returns {Array<number | null>} */
  get values() {
    return cloneValues(this.#values);
  }

  /** @param {Array<number | null>} value */
  set values(value) {
    this.#values = normalizeValues(value);
    this.requestRender();
  }

  /** @returns {string[]} */
  get labels() {
    return [...this.#labels];
  }

  /** @param {string[]} value */
  set labels(value) {
    this.#labels = Array.isArray(value) ? value.map((label) => normalizeText(label)) : [];
    this.requestRender();
  }

  /** @returns {number | null} */
  get target() {
    return this.#target;
  }

  /** @param {number | null} value */
  set target(value) {
    this.#target = finiteOrNull(value);
    this.requestRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "tone") {
      this.#toneExplicit = true;
      if (rewriteEnumAttribute(this, name, newValue, TONES, "neutral")) return;
    }

    if (name === "above-tone") {
      if (rewriteEnumAttribute(this, name, newValue, TONES, DEFAULT_ABOVE_TONE)) return;
    }

    if (name === "below-tone") {
      if (rewriteEnumAttribute(this, name, newValue, TONES, DEFAULT_BELOW_TONE)) return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#chart) {
      this.renderRoot.innerHTML = `
        <div class="chart" part="chart">
          <svg class="plot" part="plot" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" preserveAspectRatio="none" role="presentation"></svg>
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
        textForEvent: (event) => this.#hoverText(event),
      });
      this.listen(this.#plot, "pointerleave", () => this.#syncActiveColumn(null));
      this.listen(this.#plot, "pointercancel", () => this.#syncActiveColumn(null));
      this.#observePlotSize();
    }

    if (this.#target !== null) {
      this.#plot.dataset.split = "";
      delete this.#plot.dataset.tone;
    } else {
      delete this.#plot.dataset.split;
      this.#plot.dataset.tone = this.tone;
    }
    hideChartHover(this.#hover);
    this.#renderPlot();
    this.#renderTable();
    this.#applyDefaultA11y();
  }

  #domain() {
    const finite = this.#values.filter((item) => item !== null);
    if (this.#target !== null) finite.push(this.#target);
    if (!finite.length) return { min: 0, max: 1, span: 1 };
    let min = Math.min(...finite);
    let max = Math.max(...finite);
    if (min > 0) min = 0;
    if (max < 0) max = 0;
    return { min, max, span: max === min ? 1 : max - min };
  }

  #yFor(value, domain) {
    return PLOT_PAD + (1 - (value - domain.min) / domain.span) * (VIEWBOX_HEIGHT - PLOT_PAD * 2);
  }

  #plotColumns() {
    const values = this.#values;
    const count = Math.max(values.length, 1);
    const inner = VIEWBOX_WIDTH - PLOT_PAD * 2;
    const slot = inner / count;
    const width = slot * COLUMN_RATIO;
    const domain = this.#domain();
    const baselineY = this.#yFor(0, domain);

    return values.map((value, index) => {
      const x = PLOT_PAD + index * slot + (slot - width) / 2;
      if (value === null) {
        return { index, value: null, x, width, y: baselineY, height: 0 };
      }
      const yValue = this.#yFor(value, domain);
      return {
        index,
        value,
        x,
        width,
        y: Math.min(yValue, baselineY),
        height: Math.abs(yValue - baselineY),
      };
    });
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const columns = this.#plotColumns();
    this.#targetY = null;

    if (!columns.length) {
      this.#plot.replaceChildren(fragment);
      return;
    }

    for (const column of columns) {
      if (column.value === null || !(column.height > 0)) continue;
      const mark = createSvgElement("rect");
      mark.setAttribute("class", "column");
      mark.setAttribute("part", "column");
      mark.dataset.index = String(column.index);
      mark.setAttribute("x", column.x.toFixed(2));
      mark.setAttribute("y", column.y.toFixed(2));
      mark.setAttribute("width", column.width.toFixed(2));
      mark.setAttribute("height", column.height.toFixed(2));
      const bandTone = this.#bandTone(column.value);
      if (bandTone) mark.dataset.tone = bandTone;
      fragment.append(mark);
    }

    if (this.#target !== null) {
      const targetY = this.#yFor(this.#target, this.#domain());
      this.#targetY = targetY;
      const mark = createSvgElement("path");
      mark.setAttribute("class", "target");
      mark.setAttribute("part", "target");
      mark.dataset.y = targetY.toFixed(2);
      mark.setAttribute("d", dashedTargetPath(targetY, this.#plot.getBoundingClientRect().width));
      fragment.append(mark);
    }

    this.#plot.replaceChildren(fragment);
  }

  #observePlotSize() {
    if (typeof ResizeObserver === "undefined") return;

    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => this.#syncTargetDash());
      this.observe(this.#resizeObserver, () => {
        if (this.#plot) this.#resizeObserver.observe(this.#plot);
      });
    }

    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.#plot);
  }

  #syncTargetDash() {
    const mark = this.#plot?.querySelector(".target");
    if (!mark || this.#targetY === null) return;
    mark.setAttribute(
      "d",
      dashedTargetPath(this.#targetY, this.#plot.getBoundingClientRect().width),
    );
  }

  #hoverText(event) {
    const column = this.#columnFromEvent(event);
    this.#syncActiveColumn(column);
    if (!column) return "";
    return formatHoverLines([
      this.#pointLabel(column.index),
      column.value === null
        ? resolveMessage(this.#messages, DEFAULT_MESSAGES, "noData")
        : this.#formatValue(column.value),
      this.#target === null
        ? ""
        : `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "target")} ${this.#formatValue(this.#target)}`,
    ]);
  }

  #columnFromEvent(event) {
    const columns = this.#plotColumns();
    if (!columns.length) return null;

    const rect = this.#plot.getBoundingClientRect();
    const x =
      rect.width > 0
        ? ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH
        : columns.at(-1).x;

    let best = columns[0];
    let bestDist = Math.abs(best.x + best.width / 2 - x);
    for (const column of columns) {
      const dist = Math.abs(column.x + column.width / 2 - x);
      if (dist < bestDist) {
        best = column;
        bestDist = dist;
      }
    }
    return best;
  }

  #syncActiveColumn(column) {
    const index = column ? String(column.index) : "";
    for (const mark of this.#plot.querySelectorAll("rect.column")) {
      mark.classList.toggle("is-active", mark.dataset.index === index);
    }
  }

  #bandTone(value) {
    if (this.#target === null) return "";
    return value > this.#target ? this.aboveTone : this.belowTone;
  }

  #renderTable() {
    const caption = document.createElement("caption");
    caption.textContent = this.label || resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
    const body = document.createElement("tbody");

    this.#values.forEach((value, index) => {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = this.#pointLabel(index);
      const cell = document.createElement("td");
      cell.textContent =
        value === null
          ? resolveMessage(this.#messages, DEFAULT_MESSAGES, "noData")
          : this.#formatValue(value);
      row.append(heading, cell);
      body.append(row);
    });

    if (this.#target !== null) {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "target");
      const cell = document.createElement("td");
      cell.textContent = this.#formatValue(this.#target);
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
      this.internals.ariaLabel =
        this.label || resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
    }
  }

  #formatValue(value) {
    return formatNumber(value, { fallback: String(value), locale: this.locale });
  }

  #pointLabel(index) {
    return (
      this.#labels[index] ||
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "point", { index: String(index + 1) })
    );
  }
}

define("rowan-column-sparkline", RowanColumnSparkline);
