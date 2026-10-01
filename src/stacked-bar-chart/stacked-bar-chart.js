import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  createReferenceLine,
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  withRestoredPointFocus,
  renderChartTable,
} from "../chart/dom.js";
import {
  bindChartHover,
  createChartHoverBubble,
  referenceLineHoverText,
  seriesHoverText,
} from "../chart/hover.js";
import {
  categoricalBarRect,
  categoricalBaseline,
  chartSeriesColor,
  cloneChartSeries,
  cloneChartSeriesInput,
  expandDomainWithReferenceLines,
  formatChartValue,
  normalizeChartLabels,
  normalizeChartSeries,
  normalizeReferenceLines,
  resolveChartLabels,
  stackedBarCategoryTotal,
  stackedBarPlotDomain,
} from "../chart/model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const ORIENTATIONS = new Set(["vertical", "horizontal"]);
const STACK_MODES = new Set(["absolute", "normalized"]);
const DEFAULT_MESSAGES = Object.freeze({
  chart: "Stacked bar chart",
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  metric: "Metric",
  noData: "No data",
  point: "Point {index}",
  reference: "Reference",
  series: "Series",
});

let stackedBarChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {object} RowanStackedBarChartMessages
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [reference]
 * @property {string} [series]
 */

/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   orientation?: "vertical" | "horizontal",
 *   stackMode?: "absolute" | "normalized",
 *   referenceLines?: import("../chart/model.js").RowanChartReferenceLine[],
 * }} RowanStackedBarChartConfig
 */

/**
 * Stacked categorical bar chart. Positive values stack from zero.
 * Null and negatives are no-data.
 * @tag rowan-stacked-bar-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"vertical"|"horizontal"} orientation - Category axis. Default `vertical`.
 * @attr {"absolute"|"normalized"} stack-mode - `normalized` scales each category to 100. Default `absolute`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanStackedBarChartConfig} config - Replaces the complete chart configuration. Omitted `orientation` / `stackMode` reset to vertical / absolute.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Overlays on the value axis. Arrays are property-only. Normalized mode uses a 0–100 scale.
 * @property {RowanStackedBarChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart chart
 * @csspart plot
 * @csspart bar
 * @csspart legend
 * @csspart detail
 * @csspart hover
 * @csspart reference-line
 * @csspart summary
 * @csspart table
 * @cssprop --rowan-stacked-bar-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive bar.
 */
export class RowanStackedBarChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./stacked-bar-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-stacked-bar-chart-"];
  static observedAttributes = [
    "label",
    "description",
    "interactive",
    "orientation",
    "stack-mode",
    "locale",
  ];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "orientation",
    "stackMode",
    "series",
    "labels",
    "config",
    "valueFormatter",
    "referenceLines",
    "locale",
    "messages",
  ];

  #control = null;
  #heading = null;
  #labelFallback = null;
  #labelSlot = null;
  #descriptionFallback = null;
  #descriptionSlot = null;
  #plot = null;
  #xAxis = null;
  #legend = null;
  #pointControls = null;
  #detail = null;
  #hover = null;
  #summaryTable = null;
  #summary = null;
  #seriesInput = [];
  #series = [];
  #labels = [];
  #valueFormatter = null;
  #referenceLines = [];
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #descriptionId = "";
  #messages = {};

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      stackedBarChartId += 1;
      this.id = `rowan-stacked-bar-chart-${stackedBarChartId}`;
    }
    this.#labelId = `${this.id}__label`;
    this.#descriptionId = `${this.id}__description`;
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

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanStackedBarChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanStackedBarChartMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  get interactive() {
    return this.readBoolean("interactive");
  }

  set interactive(value) {
    this.reflectBoolean("interactive", Boolean(value));
  }

  /** @returns {"vertical" | "horizontal"} */
  get orientation() {
    return normalizeEnum(this.readString("orientation", "vertical"), ORIENTATIONS, "vertical");
  }

  /** @param {"vertical" | "horizontal"} value */
  set orientation(value) {
    reflectEnum(this, "orientation", value, ORIENTATIONS, "vertical");
  }

  /** @returns {"absolute" | "normalized"} */
  get stackMode() {
    return normalizeEnum(this.readString("stack-mode", "absolute"), STACK_MODES, "absolute");
  }

  /** @param {"absolute" | "normalized"} value */
  set stackMode(value) {
    reflectEnum(this, "stack-mode", value, STACK_MODES, "absolute");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (
      name === "orientation" &&
      rewriteEnumAttribute(this, name, newValue, ORIENTATIONS, "vertical")
    ) {
      return;
    }
    if (
      name === "stack-mode" &&
      rewriteEnumAttribute(this, name, newValue, STACK_MODES, "absolute")
    ) {
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

  /** @returns {RowanStackedBarChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      referenceLines: this.referenceLines,
      orientation: this.orientation,
      stackMode: this.stackMode,
    };
  }

  /** @param {RowanStackedBarChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneChartSeriesInput(source.series);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.#referenceLines = normalizeReferenceLines(source.referenceLines);
    this.reflectBoolean("interactive", Boolean(source.interactive));
    reflectEnum(this, "orientation", source.orientation, ORIENTATIONS, "vertical");
    reflectEnum(this, "stack-mode", source.stackMode, STACK_MODES, "absolute");
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

  /** @returns {import("../chart/model.js").RowanChartReferenceLine[]} */
  get referenceLines() {
    return this.#referenceLines.map((line) => ({ ...line }));
  }

  /** @param {import("../chart/model.js").RowanChartReferenceLine[]} value */
  set referenceLines(value) {
    this.#referenceLines = normalizeReferenceLines(value);
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
            <div class="plot-band">
              <div class="plot-wrap">
                <svg class="plot" part="plot" viewBox="0 0 ${SVG_NAMESPACE_WIDTH} ${SVG_NAMESPACE_HEIGHT}"></svg>
                <div class="point-controls" dir="ltr"></div>
              </div>
              <div class="x-axis" aria-hidden="true"></div>
            </div>
            <ul class="legend" part="legend"></ul>
            <output class="detail" part="detail" aria-live="polite" hidden></output>
          </figure>
          <details class="summary" part="summary" open>
            <summary></summary>
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
      this.#xAxis = this.renderRoot.querySelector(".x-axis");
      this.#legend = this.renderRoot.querySelector(".legend");
      this.#pointControls = this.renderRoot.querySelector(".point-controls");
      this.#detail = this.renderRoot.querySelector(".detail");
      this.#summaryTable = this.renderRoot.querySelector("table");
      this.#summary = this.renderRoot.querySelector("summary");
      this.#hover = createChartHoverBubble();
      this.renderRoot.querySelector(".chart").append(this.#hover);
      bindChartHover(this, {
        target: this.renderRoot.querySelector(".chart"),
        bubble: this.#hover,
        textForEvent: (event) =>
          referenceLineHoverText(
            event,
            resolveMessage(this.#messages, DEFAULT_MESSAGES, "reference"),
          ) || seriesHoverText(this.#entries, event),
      });

      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#descriptionSlot, "slotchange", () => this.requestRender());
      this.listen(this.#pointControls, "click", (event) => this.#handlePointClick(event));
      this.listen(this.#pointControls, "focusin", (event) => this.#handlePointFocus(event));
      this.listen(this.#pointControls, "keydown", (event) => this.#handlePointKeydown(event));
    }

    this.#syncLabels();
    this.#summary.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTable");
    this.#renderChart();
    this.#applyDefaultA11y();
  }

  #displayLabel() {
    const assigned = this.#labelSlot
      .assignedNodes()
      .map((node) => node.textContent)
      .join("")
      .trim();
    return assigned || this.label;
  }

  #displayDescription() {
    const assigned = this.#descriptionSlot
      .assignedNodes()
      .map((node) => node.textContent)
      .join("")
      .trim();
    return assigned || this.description;
  }

  #syncLabels() {
    const label = this.#displayLabel();
    const description = this.#displayDescription();
    const hasLabelSlot = this.#labelSlot.assignedNodes().length > 0;
    const hasDescriptionSlot = this.#descriptionSlot.assignedNodes().length > 0;

    this.#heading.hidden = !label && !description;
    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasLabelSlot || !this.label;
    this.#descriptionFallback.textContent = this.description;
    this.#descriptionFallback.hidden = hasDescriptionSlot || !this.description;
    this.renderRoot.querySelector(".chart-label").id = this.#labelId;
    this.renderRoot.querySelector(".description").id = this.#descriptionId;
    this.#plot.setAttribute("role", "img");
    this.#plot.setAttribute("aria-label", label || this.#chartName());
    if (description) {
      this.#plot.setAttribute("aria-describedby", this.#descriptionId);
    } else {
      this.#plot.removeAttribute("aria-describedby");
    }
  }

  #plotBox() {
    return {
      left: PLOT_LEFT,
      top: PLOT_TOP,
      width: SVG_NAMESPACE_WIDTH - PLOT_LEFT - PLOT_RIGHT,
      height: SVG_NAMESPACE_HEIGHT - PLOT_TOP - PLOT_BOTTOM,
    };
  }

  #valueDomain() {
    const plotDomain = stackedBarPlotDomain(this.#series, this.stackMode);
    if (this.stackMode === "normalized") return plotDomain;
    return expandDomainWithReferenceLines(plotDomain, this.#referenceLines);
  }

  #renderChart() {
    const labels = resolveChartLabels(this.#series, this.#labels, (index) =>
      this.#pointLabel(index),
    );
    const domain = this.#valueDomain();
    this.#entries = this.#createEntries(labels, domain);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(domain);
    this.#renderAxis(labels);
    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#chartName(),
      }),
      labels,
      series: this.#series.map((item) => ({
        ...item,
        values: item.values.map((point) =>
          point.value !== null && point.value < 0 ? { ...point, value: null } : point,
        ),
      })),
      formatValue: (value, series, index, label) =>
        this.#formatValue(value, { series, index, label }),
      messages: this.#messages,
      referenceLines: this.#referenceLines,
    });
    this.#syncActivePoint();
  }

  #createEntries(labels, domain) {
    const orientation = this.orientation;
    const stackMode = this.stackMode;
    const categoryCount = Math.max(labels.length, 1);
    const plot = this.#plotBox();
    const groupSpan = orientation === "horizontal" ? plot.height : plot.width;
    const groupSize = groupSpan / categoryCount;
    const barThickness = groupSize * 0.62;
    const axisStart = orientation === "horizontal" ? plot.top : plot.left;
    const entries = [];

    for (let index = 0; index < labels.length; index += 1) {
      let stack = 0;
      const categoryTotal = stackedBarCategoryTotal(this.#series, index);
      const groupStart = axisStart + index * groupSize + (groupSize - barThickness) / 2;

      this.#series.forEach((series, seriesIndex) => {
        const point = series.values[index];
        if (!point || point.value === null || point.value <= 0) return;

        const value = point.value;
        const plotValue =
          stackMode === "normalized" && categoryTotal > 0 ? (value / categoryTotal) * 100 : value;
        const rect = categoricalBarRect({
          orientation,
          from: stack,
          to: stack + plotValue,
          domain,
          groupStart,
          thickness: barThickness,
          plot,
        });
        const formattedValue = this.#formatValue(value, {
          series,
          index,
          label: labels[index],
        });

        entries.push({
          key: `${series.id}::${index}`,
          series,
          seriesIndex,
          index,
          label: labels[index] || point.label,
          value,
          formattedValue,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: Math.max(rect.height, 1),
          barY: rect.y,
        });
        stack += plotValue;
      });
    }

    return entries;
  }

  #renderPlot(domain) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#chartName();
    fragment.append(title);

    const plot = this.#plotBox();
    const baseline = categoricalBaseline(this.orientation, domain, plot);
    const axis = createSvgElement("line");
    axis.setAttribute("class", "zero-line");
    axis.setAttribute("x1", String(baseline.x1));
    axis.setAttribute("x2", String(baseline.x2));
    axis.setAttribute("y1", String(baseline.y1));
    axis.setAttribute("y2", String(baseline.y2));
    fragment.append(axis);

    for (const entry of this.#entries) {
      const bar = createSvgElement("rect");
      bar.setAttribute("class", "bar");
      bar.setAttribute("part", "bar");
      bar.dataset.pointKey = entry.key;
      bar.setAttribute("x", String(entry.x));
      bar.setAttribute("y", String(entry.barY));
      bar.setAttribute("width", String(Math.max(entry.width, 1)));
      bar.setAttribute("height", String(Math.max(entry.height, 1)));
      bar.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
      fragment.append(bar);
    }

    const range = domain.max - domain.min || 1;
    for (const line of this.#referenceLines) {
      const referenceLabel =
        line.label || resolveMessage(this.#messages, DEFAULT_MESSAGES, "reference");
      const formattedValue = this.#formatValue(line.value, { label: referenceLabel });
      if (this.orientation === "horizontal") {
        const x = plot.left + ((line.value - domain.min) / range) * plot.width;
        fragment.append(
          createReferenceLine({
            x,
            y1: plot.top,
            y2: plot.top + plot.height,
            tone: line.tone,
            label: referenceLabel,
            formattedValue,
          }),
        );
        continue;
      }

      const y = plot.top + ((domain.max - line.value) / range) * plot.height;
      fragment.append(
        createReferenceLine({
          x1: plot.left,
          x2: plot.left + plot.width,
          y,
          tone: line.tone,
          label: referenceLabel,
          formattedValue,
        }),
      );
    }

    this.#plot.replaceChildren(fragment);
  }

  #renderAxis(labels) {
    this.#xAxis.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const label of labels) {
      const item = document.createElement("span");
      item.textContent = label;
      item.title = label;
      fragment.append(item);
    }
    this.#xAxis.append(fragment);
    this.#xAxis.style.setProperty("--category-count", String(Math.max(labels.length, 1)));
  }

  #renderLegend() {
    this.#legend.replaceChildren();
    this.#legend.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "series"),
    );
    const fragment = document.createDocumentFragment();
    for (const [seriesIndex, series] of this.#series.entries()) {
      const item = document.createElement("li");
      item.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.setProperty("--series-color", chartSeriesColor(series, seriesIndex));
      item.append(swatch, document.createTextNode(series.label));
      fragment.append(item);
    }
    this.#legend.append(fragment);
  }

  #renderPointControls() {
    withRestoredPointFocus(this.#pointControls, this.#activePointKey, () => {
      this.#pointControls.textContent = "";
      this.#pointControls.hidden = !this.interactive;
      if (!this.interactive) return;

      const fragment = document.createDocumentFragment();
      for (const entry of this.#entries) {
        const button = document.createElement("button");
        button.className = "point-button";
        button.type = "button";
        button.dataset.pointKey = entry.key;
        button.style.setProperty("--point-x", `${(entry.x / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty("--point-y", `${(entry.barY / SVG_NAMESPACE_HEIGHT) * 100}%`);
        button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty(
          "--point-height",
          `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`,
        );
        button.setAttribute(
          "aria-label",
          `${entry.series.label}, ${entry.label}, ${entry.formattedValue}`,
        );
        fragment.append(button);
      }
      this.#pointControls.append(fragment);
    });
  }

  #syncActivePoint() {
    const entry = this.#entries.find((item) => item.key === this.#activePointKey) ?? null;
    this.#detail.hidden = !entry;
    this.#detail.textContent = entry
      ? `${entry.series.label}, ${entry.label}: ${entry.formattedValue}`
      : "";
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

  #chartName() {
    return this.#displayLabel() || resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
  }

  #formatValue(value, context) {
    if (this.#valueFormatter) return formatChartValue(this.#valueFormatter, value, context);

    return formatNumber(value, { fallback: String(value), locale: this.locale });
  }

  #pointLabel(index) {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "point", {
      index: String(index + 1),
    });
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
      this.internals.ariaLabel = this.#chartName();
    }
  }
}

define("rowan-stacked-bar-chart", RowanStackedBarChart);
