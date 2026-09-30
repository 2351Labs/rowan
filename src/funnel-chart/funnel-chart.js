import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  renderChartTable,
} from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, seriesHoverText } from "../chart/hover.js";
import {
  chartSeriesColor,
  cloneChartSeries,
  cloneChartSeriesInput,
  formatChartValue,
  normalizeChartLabels,
  normalizeChartSeries,
  resolveChartLabels,
} from "../chart/model.js";
import { funnelPath, funnelStages, funnelTrapezoids } from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 48;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 18;
const VARIANTS = new Set(["funnel", "cone", "pyramid"]);

let funnelChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   variant?: "funnel" | "cone" | "pyramid",
 * }} RowanFunnelChartConfig
 */

/**
 * Experimental one-series stage chart. Does not auto-sort. Negatives and
 * null are no-data. `pyramid` puts stage 0 at the bottom; `cone` tapers
 * the last stage to a point.
 * @tag rowan-funnel-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"funnel"|"cone"|"pyramid"} variant - Default `funnel`.
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Stage labels. Arrays are property-only.
 * @property {RowanFunnelChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to funnel.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart stage
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-funnel-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive stage.
 */
export class RowanFunnelChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./funnel-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-funnel-chart-"];
  static observedAttributes = ["label", "description", "interactive", "variant"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "variant",
    "series",
    "labels",
    "config",
    "valueFormatter",
  ];

  #control = null;
  #heading = null;
  #labelFallback = null;
  #labelSlot = null;
  #descriptionFallback = null;
  #descriptionSlot = null;
  #plot = null;
  #yAxis = null;
  #legend = null;
  #pointControls = null;
  #detail = null;
  #hover = null;
  #summaryTable = null;
  #seriesInput = [];
  #series = [];
  #labels = [];
  #valueFormatter = null;
  #entries = [];
  #activePointKey = "";
  #labelId = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      funnelChartId += 1;
      this.id = `rowan-funnel-chart-${funnelChartId}`;
    }
    this.#labelId = `${this.id}__label`;
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", normalizeText(value) || null);
  }

  get interactive() {
    return this.readBoolean("interactive");
  }

  set interactive(value) {
    this.reflectBoolean("interactive", Boolean(value));
  }

  /** @returns {"funnel" | "cone" | "pyramid"} */
  get variant() {
    return normalizeEnum(this.readString("variant", "funnel"), VARIANTS, "funnel");
  }

  /** @param {"funnel" | "cone" | "pyramid"} value */
  set variant(value) {
    reflectEnum(this, "variant", value, VARIANTS, "funnel");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "variant" && rewriteEnumAttribute(this, name, newValue, VARIANTS, "funnel")) {
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series() {
    return cloneChartSeries(this.#series);
  }

  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value) {
    this.#seriesInput = cloneChartSeriesInput(value);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {string[]} */
  get labels() {
    return [...this.#labels];
  }

  /** @param {string[]} value */
  set labels(value) {
    this.#labels = normalizeChartLabels(value);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {RowanFunnelChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      variant: this.variant,
    };
  }

  /** @param {RowanFunnelChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneChartSeriesInput(source.series);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    reflectEnum(this, "variant", source.variant, VARIANTS, "funnel");
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter() {
    return this.#valueFormatter;
  }

  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value) {
    this.#valueFormatter = typeof value === "function" ? value : null;
    this.requestRender();
  }

  render() {
    if (!this.#control) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <div class="heading">
            <div class="chart-label" part="label"><slot name="label"><span class="label-fallback"></span></slot></div>
            <div class="description" part="description"><slot name="description"><span class="description-fallback"></span></slot></div>
          </div>
          <figure class="chart" part="chart">
            <div class="plot-layout">
              <div class="y-axis" aria-hidden="true"></div>
              <div class="plot-wrap">
                <svg class="plot" part="plot" viewBox="0 0 ${SVG_NAMESPACE_WIDTH} ${SVG_NAMESPACE_HEIGHT}"></svg>
                <div class="point-controls"></div>
              </div>
            </div>
            <ul class="legend" part="legend" aria-label="Stages"></ul>
            <output class="detail" part="detail" aria-live="polite" hidden></output>
          </figure>
          <details class="summary" part="summary" open>
            <summary>Data table</summary>
            <div class="table-scroll"><table part="table"></table></div>
          </details>
        </div>
      `;
      this.#control = this.renderRoot.querySelector(".control");
      this.#heading = this.renderRoot.querySelector(".heading");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#labelSlot = this.renderRoot.querySelector('slot[name="label"]');
      this.#descriptionFallback = this.renderRoot.querySelector(".description-fallback");
      this.#descriptionSlot = this.renderRoot.querySelector('slot[name="description"]');
      this.#plot = this.renderRoot.querySelector(".plot");
      this.#yAxis = this.renderRoot.querySelector(".y-axis");
      this.#legend = this.renderRoot.querySelector(".legend");
      this.#pointControls = this.renderRoot.querySelector(".point-controls");
      this.#detail = this.renderRoot.querySelector(".detail");
      this.#summaryTable = this.renderRoot.querySelector("table");
      this.#hover = createChartHoverBubble();
      this.renderRoot.querySelector(".chart").append(this.#hover);
      bindChartHover(this, {
        target: this.renderRoot.querySelector(".chart"),
        bubble: this.#hover,
        textForEvent: (event) => seriesHoverText(this.#entries, event),
      });
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#descriptionSlot, "slotchange", () => this.requestRender());
      this.listen(this.#pointControls, "click", (event) => this.#handlePointClick(event));
      this.listen(this.#pointControls, "focusin", (event) => this.#handlePointFocus(event));
      this.listen(this.#pointControls, "keydown", (event) => this.#handlePointKeydown(event));
    }

    this.#syncLabels();
    this.#renderChart();
    this.#applyDefaultA11y();
  }

  #displayLabel() {
    return (
      this.#labelSlot
        .assignedNodes()
        .map((node) => node.textContent)
        .join("")
        .trim() || this.label
    );
  }

  #primarySeries() {
    return this.#series[0] ?? null;
  }

  #syncLabels() {
    const label = this.#displayLabel();
    const hasLabelSlot = this.#labelSlot.assignedNodes().length > 0;
    const hasDescriptionSlot = this.#descriptionSlot.assignedNodes().length > 0;
    this.#heading.hidden = !label && !this.description && !hasDescriptionSlot;
    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasLabelSlot || !this.label;
    this.#descriptionFallback.textContent = this.description;
    this.#descriptionFallback.hidden = hasDescriptionSlot || !this.description;
    this.renderRoot.querySelector(".chart-label").id = this.#labelId;
    this.#plot.setAttribute("role", "img");
    this.#plot.setAttribute("aria-label", label || this.#chartName());
  }

  #chartName() {
    if (this.variant === "cone") return "Cone chart";
    if (this.variant === "pyramid") return "Pyramid chart";
    return "Funnel chart";
  }

  #plotBox() {
    return {
      left: PLOT_LEFT,
      top: PLOT_TOP,
      width: SVG_NAMESPACE_WIDTH - PLOT_LEFT - PLOT_RIGHT,
      height: SVG_NAMESPACE_HEIGHT - PLOT_TOP - PLOT_BOTTOM,
    };
  }

  #renderChart() {
    const series = this.#primarySeries();
    const labels = resolveChartLabels(this.#series.slice(0, 1), this.#labels);
    const stages = funnelStages(series);
    const shapes = funnelTrapezoids(stages, this.variant, this.#plotBox());
    this.#entries = [];

    shapes.forEach((shape, colorIndex) => {
      const formattedValue = formatChartValue(this.#valueFormatter, shape.value, {
        series,
        index: shape.index,
        label: labels[shape.index],
      });
      const left = Math.min(shape.topX, shape.bottomX);
      const right = Math.max(shape.topX + shape.topWidth, shape.bottomX + shape.bottomWidth);
      this.#entries.push({
        key: `${series.id}::${shape.index}`,
        series,
        seriesIndex: colorIndex,
        index: shape.index,
        label: labels[shape.index] || shape.label,
        value: shape.value,
        formattedValue,
        plotX: left,
        plotY: shape.y,
        width: Math.max(right - left, 1),
        height: shape.height,
        path: funnelPath(shape),
      });
    });

    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }

    this.#renderPlot();
    this.#renderAxis();
    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || this.#chartName()} data table`,
      labels,
      series: series
        ? [
            {
              label: series.label,
              values: stages.map((stage) => ({ value: stage.value })),
            },
          ]
        : [],
      formatValue: (value, item, index, label) =>
        formatChartValue(this.#valueFormatter, value, { series, index, label }),
    });
    this.#syncActivePoint();
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || this.#chartName();
    fragment.append(title);

    for (const entry of this.#entries) {
      const path = createSvgElement("path");
      path.setAttribute("class", "stage");
      path.setAttribute("part", "stage");
      path.dataset.pointKey = entry.key;
      path.setAttribute("d", entry.path);
      path.style.fill = chartSeriesColor({ ...entry.series, color: "" }, entry.seriesIndex);
      fragment.append(path);
    }
    this.#plot.replaceChildren(fragment);
  }

  #renderAxis() {
    const ordered = [...this.#entries].sort((left, right) => left.plotY - right.plotY);
    this.#yAxis.replaceChildren();
    this.#yAxis.style.setProperty("--stage-count", String(Math.max(ordered.length, 1)));
    for (const entry of ordered) {
      const item = document.createElement("span");
      item.textContent = entry.label;
      item.title = entry.label;
      this.#yAxis.append(item);
    }
  }

  #renderLegend() {
    this.#legend.replaceChildren();
    const fragment = document.createDocumentFragment();
    this.#entries.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.setProperty(
        "--series-color",
        chartSeriesColor({ ...entry.series, color: "" }, index),
      );
      item.append(swatch, document.createTextNode(`${entry.label} ${entry.formattedValue}`));
      fragment.append(item);
    });
    this.#legend.append(fragment);
  }

  #renderPointControls() {
    this.#pointControls.textContent = "";
    this.#pointControls.hidden = !this.interactive;
    if (!this.interactive) return;
    const fragment = document.createDocumentFragment();
    for (const entry of this.#entries) {
      const button = document.createElement("button");
      button.className = "point-button";
      button.type = "button";
      button.dataset.pointKey = entry.key;
      button.style.setProperty("--point-x", `${(entry.plotX / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty("--point-y", `${(entry.plotY / SVG_NAMESPACE_HEIGHT) * 100}%`);
      button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty("--point-height", `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`);
      button.setAttribute("aria-label", `${entry.label}, ${entry.formattedValue}`);
      fragment.append(button);
    }
    this.#pointControls.append(fragment);
  }

  #syncActivePoint() {
    const entry = this.#entries.find((item) => item.key === this.#activePointKey) ?? null;
    this.#detail.hidden = !entry;
    this.#detail.textContent = entry ? `${entry.label}: ${entry.formattedValue}` : "";
  }

  #handlePointClick(event) {
    const entry = this.#entryFromEvent(event);
    if (entry) this.#activatePoint(entry);
  }

  #handlePointFocus(event) {
    const entry = this.#entryFromEvent(event);
    if (entry) {
      this.#activePointKey = entry.key;
      this.#syncActivePoint();
    }
  }

  #handlePointKeydown(event) {
    const entry = this.#entryFromEvent(event);
    if (!entry) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.#activatePoint(entry);
      return;
    }
    const index = this.#entries.findIndex((item) => item.key === entry.key);
    let target = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = this.#entries[index + 1] ?? this.#entries.at(0);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = this.#entries[index - 1] ?? this.#entries.at(-1);
    }
    if (!target) return;
    event.preventDefault();
    this.#activePointKey = target.key;
    this.#syncActivePoint();
    pointControlFor(this.#pointControls, target.key)?.focus({ preventScroll: true });
  }

  #activatePoint(entry) {
    this.#activePointKey = entry.key;
    this.#syncActivePoint();
    emitPointActivate(this, emit, entry);
  }

  #entryFromEvent(event) {
    const button = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.pointKey);
    if (!button) return null;
    return this.#entries.find((entry) => entry.key === button.dataset.pointKey) ?? null;
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
      this.internals.ariaLabel = this.#displayLabel() || this.#chartName();
    }
  }
}

define("rowan-funnel-chart", RowanFunnelChart);
