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
  nearestPointByClientX,
} from "../chart/hover.js";
import { finiteOrNull } from "../chart/model.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 24;
const PLOT_PAD = 1.5;
const DEFAULT_ABOVE_TONE = "warning";
const DEFAULT_BELOW_TONE = "success";
const DEFAULT_MESSAGES = Object.freeze({
  chart: "Sparkline",
  noData: "No data",
  point: "Point {index}",
  target: "Target",
});

let clipSeq = 0;

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

function createSvgElement(name) {
  return document.createElementNS(SVG_NAMESPACE, name);
}

function pathData(points) {
  let hasPrevious = false;
  let previousIndex = -1;

  return points
    .map((point) => {
      const command = hasPrevious && point.index === previousIndex + 1 ? "L" : "M";
      hasPrevious = true;
      previousIndex = point.index;
      return `${command}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function createClipRect(x, y, width, height) {
  const rect = createSvgElement("rect");
  rect.setAttribute("x", x.toFixed(2));
  rect.setAttribute("y", y.toFixed(2));
  rect.setAttribute("width", width.toFixed(2));
  rect.setAttribute("height", Math.max(height, 0).toFixed(2));
  return rect;
}

/**
 * @typedef {object} RowanSparklineMessages
 * @property {string} [chart]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [target]
 */

/**
 * Frozen compact one-series line for KPI tiles. Not a density of
 * `rowan-trend-chart`.
 * @tag rowan-sparkline
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [above-tone=warning] - Stroke above target. Used when `target` is set.
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [below-tone=success] - Stroke at or below target. Used when `target` is set.
 * @attr {string} locale
 * @property {Array<number | null>} values - One series. Arrays are property-only. Null is a gap.
 * @property {string[]} labels - Optional point labels for the accessible table. Arrays are property-only.
 * @property {number | null} target - Target value. Property-only. Null hides the split and the dashed line.
 * @property {RowanSparklineMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart line
 * @csspart target
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-sparkline-height
 * @cssprop --rowan-sparkline-stroke
 * @cssprop --rowan-sparkline-stroke-width
 * @cssprop --rowan-sparkline-info
 * @cssprop --rowan-sparkline-success
 * @cssprop --rowan-sparkline-warning
 * @cssprop --rowan-sparkline-danger
 * @cssprop --rowan-sparkline-target
 * @cssprop --rowan-sparkline-target-width
 */
export class RowanSparkline extends BaseElement {
  static styleUrl = new URL("./sparkline.css", import.meta.url).href;
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
  static componentTokenPrefixes = ["--rowan-sparkline-"];

  #chart = null;
  #plot = null;
  #table = null;
  #hover = null;
  #hoverPoint = null;
  #values = [];
  #labels = [];
  #target = null;
  #toneExplicit = false;
  #messages = {};
  #clipId = `rowan-sparkline-${++clipSeq}`;

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

  /** @returns {RowanSparklineMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanSparklineMessages | null | undefined} value */
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
      this.listen(this.#plot, "pointerleave", () => this.#syncHoverPoint(null));
      this.listen(this.#plot, "pointercancel", () => this.#syncHoverPoint(null));
    }

    const points = this.#plotPoints();
    if (this.#target !== null) {
      this.#plot.dataset.split = "";
      delete this.#plot.dataset.tone;
    } else {
      delete this.#plot.dataset.split;
      this.#plot.dataset.tone = this.tone;
    }
    this.#renderPlot(points);
    this.#renderTable();
    this.#applyDefaultA11y();
  }

  #domain() {
    const finite = this.#values.filter((item) => item !== null);
    if (this.#target !== null) finite.push(this.#target);
    const min = finite.length ? Math.min(...finite) : 0;
    const max = finite.length ? Math.max(...finite) : 1;
    return { min, max, span: max === min ? 1 : max - min };
  }

  #yFor(value, domain) {
    return PLOT_PAD + (1 - (value - domain.min) / domain.span) * (VIEWBOX_HEIGHT - PLOT_PAD * 2);
  }

  #plotPoints() {
    const values = this.#values;
    const domain = this.#domain();
    const lastIndex = Math.max(values.length - 1, 1);

    return values.flatMap((value, index) => {
      if (value === null) return [];
      return [
        {
          index,
          value,
          x: PLOT_PAD + (index / lastIndex) * (VIEWBOX_WIDTH - PLOT_PAD * 2),
          y: this.#yFor(value, domain),
        },
      ];
    });
  }

  #renderPlot(points) {
    const fragment = document.createDocumentFragment();
    if (points.length === 0) {
      this.#plot.replaceChildren(fragment);
      this.#hoverPoint = null;
      return;
    }

    const d = pathData(points);
    if (this.#target !== null) {
      const targetY = this.#yFor(this.#target, this.#domain());
      const aboveId = `${this.#clipId}-above`;
      const belowId = `${this.#clipId}-below`;

      const defs = createSvgElement("defs");
      const aboveClip = createSvgElement("clipPath");
      aboveClip.id = aboveId;
      aboveClip.append(createClipRect(0, 0, VIEWBOX_WIDTH, targetY));
      const belowClip = createSvgElement("clipPath");
      belowClip.id = belowId;
      belowClip.append(createClipRect(0, targetY, VIEWBOX_WIDTH, VIEWBOX_HEIGHT - targetY));
      defs.append(aboveClip, belowClip);
      fragment.append(defs);

      const mark = createSvgElement("line");
      mark.setAttribute("class", "target");
      mark.setAttribute("part", "target");
      mark.setAttribute("x1", "0");
      mark.setAttribute("x2", String(VIEWBOX_WIDTH));
      mark.setAttribute("y1", targetY.toFixed(2));
      mark.setAttribute("y2", targetY.toFixed(2));
      fragment.append(mark);

      const above = createSvgElement("path");
      above.setAttribute("class", "line");
      above.setAttribute("part", "line");
      above.setAttribute("fill", "none");
      above.dataset.tone = this.aboveTone;
      above.dataset.band = "above";
      above.setAttribute("clip-path", `url(#${aboveId})`);
      above.setAttribute("d", d);

      const below = createSvgElement("path");
      below.setAttribute("class", "line");
      below.setAttribute("part", "line");
      below.setAttribute("fill", "none");
      below.dataset.tone = this.belowTone;
      below.dataset.band = "below";
      below.setAttribute("clip-path", `url(#${belowId})`);
      below.setAttribute("d", d);
      fragment.append(above, below);
    } else {
      const path = createSvgElement("path");
      path.setAttribute("class", "line");
      path.setAttribute("part", "line");
      path.setAttribute("fill", "none");
      path.setAttribute("d", d);
      fragment.append(path);
    }

    this.#plot.replaceChildren(fragment);
    this.#hoverPoint = null;
  }

  #hoverText(event) {
    const point = nearestPointByClientX(this.#plot, this.#plotPoints(), event.clientX);
    this.#syncHoverPoint(point);
    if (!point) return "";
    return formatHoverLines([
      this.#pointLabel(point.index),
      this.#formatValue(point.value),
      this.#target === null
        ? ""
        : `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "target")} ${this.#formatValue(this.#target)}`,
    ]);
  }

  #bandTone(value) {
    if (this.#target === null) return "";
    return value > this.#target ? this.aboveTone : this.belowTone;
  }

  #syncHoverPoint(point) {
    if (!point) {
      this.#hoverPoint?.remove();
      this.#hoverPoint = null;
      return;
    }

    if (!this.#hoverPoint) {
      this.#hoverPoint = createSvgElement("circle");
      this.#hoverPoint.setAttribute("class", "hover-point");
      this.#hoverPoint.setAttribute("r", "2.25");
    }

    this.#hoverPoint.setAttribute("cx", point.x.toFixed(2));
    this.#hoverPoint.setAttribute("cy", point.y.toFixed(2));
    const bandTone = this.#bandTone(point.value);
    if (bandTone) this.#hoverPoint.dataset.tone = bandTone;
    else delete this.#hoverPoint.dataset.tone;
    this.#plot.append(this.#hoverPoint);
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

define("rowan-sparkline", RowanSparkline);
