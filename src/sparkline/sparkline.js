import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 24;
const PLOT_PAD = 1.5;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeValues(value) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (item === null || item === undefined || item === "") return null;
    const numeric = typeof item === "number" ? item : Number(item);
    return Number.isFinite(numeric) ? numeric : null;
  });
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

/**
 * Frozen compact one-series line for KPI tiles. Not a density of
 * `rowan-trend-chart`.
 * @tag rowan-sparkline
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @property {Array<number | null>} values - One series. Arrays are property-only. Null is a gap.
 * @property {string[]} labels - Optional point labels for the accessible table. Arrays are property-only.
 * @csspart chart
 * @csspart plot
 * @csspart line
 * @csspart table
 * @cssprop --rowan-sparkline-stroke
 * @cssprop --rowan-sparkline-success
 * @cssprop --rowan-sparkline-danger
 */
export class RowanSparkline extends BaseElement {
  static styleUrl = new URL("./sparkline.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "tone"];
  static upgradeProperties = ["label", "tone", "values", "labels"];
  static componentTokenPrefixes = ["--rowan-sparkline-"];

  #chart = null;
  #plot = null;
  #table = null;
  #values = [];
  #labels = [];
  #toneExplicit = false;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
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

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "tone") {
      this.#toneExplicit = true;
      if (rewriteEnumAttribute(this, name, newValue, TONES, "neutral")) return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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

    const points = this.#plotPoints();
    this.#plot.dataset.tone = this.tone;
    this.#renderPlot(points);
    this.#renderTable();
    this.#applyDefaultA11y();
  }

  #plotPoints() {
    const values = this.#values;
    const finite = values.filter((item) => item !== null);
    const min = finite.length ? Math.min(...finite) : 0;
    const max = finite.length ? Math.max(...finite) : 1;
    const span = max === min ? 1 : max - min;
    const lastIndex = Math.max(values.length - 1, 1);

    return values.flatMap((value, index) => {
      if (value === null) return [];
      return [
        {
          index,
          value,
          x: PLOT_PAD + (index / lastIndex) * (VIEWBOX_WIDTH - PLOT_PAD * 2),
          y: PLOT_PAD + (1 - (value - min) / span) * (VIEWBOX_HEIGHT - PLOT_PAD * 2),
        },
      ];
    });
  }

  #renderPlot(points) {
    const fragment = document.createDocumentFragment();
    if (points.length === 0) {
      this.#plot.replaceChildren(fragment);
      return;
    }

    const path = createSvgElement("path");
    path.setAttribute("class", "line");
    path.setAttribute("part", "line");
    path.setAttribute("fill", "none");
    path.setAttribute("d", pathData(points));
    fragment.append(path);
    this.#plot.replaceChildren(fragment);
  }

  #renderTable() {
    const caption = document.createElement("caption");
    caption.textContent = this.label || "Sparkline";
    const body = document.createElement("tbody");

    this.#values.forEach((value, index) => {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = this.#labels[index] || `Point ${index + 1}`;
      const cell = document.createElement("td");
      cell.textContent = value === null ? "No data" : String(value);
      row.append(heading, cell);
      body.append(row);
    });

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
      this.internals.ariaLabel = this.label || "Sparkline";
    }
  }
}

define("rowan-sparkline", RowanSparkline);
