import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  withRestoredPointFocus,
  renderKeyedChartTable,
} from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, seriesHoverText } from "../chart/hover.js";
import {
  categoricalBarRect,
  categoricalValueY,
  chartSeriesColor,
  formatChartValue,
  normalizeChartLabels,
} from "../chart/model.js";
import {
  boxPlotDomain,
  boxPlotIncluded,
  cloneBoxPlotSeries,
  cloneBoxPlotSeriesInput,
  normalizeBoxPlotSeries,
  resolveBoxPlotLabels,
} from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const OUTLIER_RADIUS = 3.5;
const DEFAULT_MESSAGES = Object.freeze({
  category: "Category",
  chart: "Box plot",
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  max: "Max",
  maxValue: "max",
  median: "Median",
  medianValue: "median",
  min: "Min",
  minValue: "min",
  noData: "No data",
  outliers: "Outliers",
  q1: "Q1",
  q1Value: "q1",
  q3: "Q3",
  q3Value: "q3",
  point: "Point {index}",
  series: "Series",
});

let boxPlotChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {object} RowanBoxPlotChartMessages
 * @property {string} [category]
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [max]
 * @property {string} [maxValue]
 * @property {string} [median]
 * @property {string} [medianValue]
 * @property {string} [min]
 * @property {string} [minValue]
 * @property {string} [noData]
 * @property {string} [outliers]
 * @property {string} [q1]
 * @property {string} [q1Value]
 * @property {string} [q3]
 * @property {string} [q3Value]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [series]
 */

/**
 * @typedef {{
 *   labels?: string[],
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   valueFormatter?: import("./model.js").RowanBoxPlotChartValueFormatter | null,
 * }} RowanBoxPlotChartConfig
 */

/**
 * Experimental box plot. Per-category `{ min, q1, median, q3, max, outliers? }`.
 * The host does not compute quartiles. Null in the five-number summary is
 * no-data. Own series model — not frozen categorical `series.values`.
 * @tag rowan-box-plot-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - Series of `{ id, label, color?, values: [{ min, q1, median, q3, max, outliers? }] }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanBoxPlotChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanBoxPlotChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanBoxPlotChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart box
 * @csspart whisker
 * @csspart median
 * @csspart outlier
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-box-plot-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive box. Detail includes min, q1, median, q3, and max.
 */
export class RowanBoxPlotChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./box-plot-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-box-plot-chart-"];
  static observedAttributes = ["label", "description", "interactive", "locale"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "series",
    "labels",
    "config",
    "valueFormatter",
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
  #yAxis = null;
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
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #messages = {};

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      boxPlotChartId += 1;
      this.id = `rowan-box-plot-chart-${boxPlotChartId}`;
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

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanBoxPlotChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanBoxPlotChartMessages | null | undefined} value */
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

  /** @returns {Array<object>} */
  get series() {
    return cloneBoxPlotSeries(this.#series);
  }

  /** @param {Array<object>} value */
  set series(value) {
    this.#seriesInput = cloneBoxPlotSeriesInput(value);
    this.#series = normalizeBoxPlotSeries(this.#seriesInput, this.#labels);
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
    this.#series = normalizeBoxPlotSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {RowanBoxPlotChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  /** @param {RowanBoxPlotChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneBoxPlotSeriesInput(source.series);
    this.#series = normalizeBoxPlotSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {import("./model.js").RowanBoxPlotChartValueFormatter | null} */
  get valueFormatter() {
    return this.#valueFormatter;
  }

  /** @param {import("./model.js").RowanBoxPlotChartValueFormatter | null} value */
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
      this.#yAxis = this.renderRoot.querySelector(".y-axis");
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
        textForEvent: (event) => seriesHoverText(this.#entries, event),
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
    return (
      this.#labelSlot
        .assignedNodes()
        .map((node) => node.textContent)
        .join("")
        .trim() || this.label
    );
  }

  #chartName() {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
  }

  #categoryLabels() {
    return resolveBoxPlotLabels(this.#series, this.#labels, (index) => this.#pointLabel(index));
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

  #plotBox() {
    return {
      left: PLOT_LEFT,
      top: PLOT_TOP,
      width: SVG_NAMESPACE_WIDTH - PLOT_LEFT - PLOT_RIGHT,
      height: SVG_NAMESPACE_HEIGHT - PLOT_TOP - PLOT_BOTTOM,
    };
  }

  #formatPoint(point, series, index, label) {
    const context = { series, index, label };
    const min = this.#formatValue(point.min, context);
    const q1 = this.#formatValue(point.q1, context);
    const median = this.#formatValue(point.median, context);
    const q3 = this.#formatValue(point.q3, context);
    const max = this.#formatValue(point.max, context);
    return [
      `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "minValue")}=${min}`,
      `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "q1Value")}=${q1}`,
      `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "medianValue")}=${median}`,
      `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "q3Value")}=${q3}`,
      `${resolveMessage(this.#messages, DEFAULT_MESSAGES, "maxValue")}=${max}`,
    ].join(", ");
  }

  #renderChart() {
    const labels = this.#categoryLabels();
    const domain = boxPlotDomain(this.#series);
    const plot = this.#plotBox();
    this.#entries = this.#createEntries(labels, domain, plot);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(plot);
    this.#renderAxes(labels, domain);
    this.#renderLegend();
    this.#renderPointControls();
    const hasOutliers = this.#series.some((series) =>
      series.values.some((point) => point.outliers.length > 0),
    );
    renderKeyedChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#displayLabel() || this.#chartName(),
      }),
      columns: [
        { key: "series", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "series") },
        { key: "label", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "category") },
        { key: "min", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "min") },
        { key: "q1", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "q1") },
        { key: "median", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "median") },
        { key: "q3", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "q3") },
        { key: "max", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "max") },
        ...(hasOutliers
          ? [
              {
                key: "outliers",
                header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "outliers"),
              },
            ]
          : []),
      ],
      rows: this.#series.flatMap((series) =>
        labels.map((label, index) => {
          const point = series.values[index];
          const included = point && boxPlotIncluded(point);
          const context = { series, index, label };
          return {
            series: series.label,
            label,
            min: included ? this.#formatValue(point.min, context) : null,
            q1: included ? this.#formatValue(point.q1, context) : null,
            median: included ? this.#formatValue(point.median, context) : null,
            q3: included ? this.#formatValue(point.q3, context) : null,
            max: included ? this.#formatValue(point.max, context) : null,
            outliers:
              included && point.outliers.length
                ? point.outliers.map((value) => this.#formatValue(value, context)).join(", ")
                : null,
          };
        }),
      ),
      messages: this.#messages,
    });
    this.#syncActivePoint();
  }

  #createEntries(labels, domain, plot) {
    const categoryCount = Math.max(labels.length, 1);
    const seriesCount = Math.max(this.#series.length, 1);
    const groupSize = plot.width / categoryCount;
    const boxThickness = groupSize / (seriesCount + 1);
    const entries = [];

    this.#series.forEach((series, seriesIndex) => {
      labels.forEach((label, index) => {
        const point = series.values[index];
        if (!point || !boxPlotIncluded(point)) return;
        const groupStart = plot.left + index * groupSize;
        const offset = boxThickness / 2 + seriesIndex * boxThickness;
        const box = categoricalBarRect({
          orientation: "vertical",
          from: point.q1,
          to: point.q3,
          domain,
          groupStart,
          offset,
          thickness: boxThickness,
          plot,
        });
        const centerX = box.x + box.width / 2;
        entries.push({
          key: `${series.id}::${index}`,
          series,
          seriesIndex,
          index,
          label,
          value: point.median,
          formattedValue: this.#formatPoint(point, series, index, label),
          min: point.min,
          q1: point.q1,
          median: point.median,
          q3: point.q3,
          max: point.max,
          outliers: point.outliers,
          plotX: box.x,
          plotY: box.y,
          width: box.width,
          height: Math.max(box.height, 1),
          centerX,
          minY: categoricalValueY(point.min, domain, plot),
          maxY: categoricalValueY(point.max, domain, plot),
          medianY: categoricalValueY(point.median, domain, plot),
          outlierYs: point.outliers.map((value) => categoricalValueY(value, domain, plot)),
          detail: {
            min: point.min,
            q1: point.q1,
            median: point.median,
            q3: point.q3,
            max: point.max,
          },
        });
      });
    });
    return entries;
  }

  #renderPlot(plot) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || this.#chartName();
    fragment.append(title);

    const axis = createSvgElement("rect");
    axis.setAttribute("class", "plot-frame");
    axis.setAttribute("x", String(plot.left));
    axis.setAttribute("y", String(plot.top));
    axis.setAttribute("width", String(plot.width));
    axis.setAttribute("height", String(plot.height));
    fragment.append(axis);

    for (const entry of this.#entries) {
      const color = chartSeriesColor(entry.series, entry.seriesIndex);
      const whisker = createSvgElement("line");
      whisker.setAttribute("class", "whisker");
      whisker.setAttribute("part", "whisker");
      whisker.setAttribute("x1", String(entry.centerX));
      whisker.setAttribute("x2", String(entry.centerX));
      whisker.setAttribute("y1", String(entry.maxY));
      whisker.setAttribute("y2", String(entry.minY));
      whisker.style.stroke = color;
      fragment.append(whisker);

      const cap = (y) => {
        const line = createSvgElement("line");
        line.setAttribute("class", "whisker-cap");
        line.setAttribute("x1", String(entry.plotX));
        line.setAttribute("x2", String(entry.plotX + entry.width));
        line.setAttribute("y1", String(y));
        line.setAttribute("y2", String(y));
        line.style.stroke = color;
        return line;
      };
      fragment.append(cap(entry.maxY), cap(entry.minY));

      const box = createSvgElement("rect");
      box.setAttribute("class", "box");
      box.setAttribute("part", "box");
      box.dataset.pointKey = entry.key;
      box.setAttribute("x", String(entry.plotX));
      box.setAttribute("y", String(entry.plotY));
      box.setAttribute("width", String(Math.max(entry.width, 1)));
      box.setAttribute("height", String(entry.height));
      box.style.fill = color;
      fragment.append(box);

      const median = createSvgElement("line");
      median.setAttribute("class", "median");
      median.setAttribute("part", "median");
      median.setAttribute("x1", String(entry.plotX));
      median.setAttribute("x2", String(entry.plotX + entry.width));
      median.setAttribute("y1", String(entry.medianY));
      median.setAttribute("y2", String(entry.medianY));
      fragment.append(median);

      for (const outlierY of entry.outlierYs) {
        const mark = createSvgElement("circle");
        mark.setAttribute("class", "outlier");
        mark.setAttribute("part", "outlier");
        mark.setAttribute("cx", String(entry.centerX));
        mark.setAttribute("cy", String(outlierY));
        mark.setAttribute("r", String(OUTLIER_RADIUS));
        mark.style.fill = color;
        fragment.append(mark);
      }
    }
    this.#plot.replaceChildren(fragment);
  }

  #renderAxes(labels, domain) {
    const ticks = [domain.max, (domain.max + domain.min) / 2, domain.min];
    this.#yAxis.replaceChildren();
    for (const tick of ticks) {
      const item = document.createElement("span");
      item.textContent = this.#formatValue(tick, { tick: true });
      this.#yAxis.append(item);
    }
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
        button.style.setProperty("--point-x", `${(entry.plotX / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty("--point-y", `${(entry.plotY / SVG_NAMESPACE_HEIGHT) * 100}%`);
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
      this.internals.ariaLabel = this.#displayLabel() || this.#chartName();
    }
  }
}

define("rowan-box-plot-chart", RowanBoxPlotChart);
