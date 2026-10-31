import { declarations as trendChartTokenDeclarations } from "../tokens/parts/trend-chart.js";
import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import { renderChartTable, withRestoredPointFocus, emitPointActivate } from "../chart/dom.js";
import { cloneChartSeriesInput as cloneTrendSeriesInput } from "../chart/model.js";
import {
  bindChartHover,
  createChartHoverBubble,
  readTooltipFormatter,
  writeTooltipFormatter,
  seriesHoverText,
} from "../chart/hover.js";
import {
  readHiddenSeries,
  writeHiddenSeries,
  navigatePointKey,
  visibleEntries,
  applySeriesVisibility,
} from "../chart/api.js";
import {
  cloneTrendSeries,
  normalizeTrendLabels,
  normalizeTrendSeries,
  resolveTrendLabels,
  trendValueDomain,
} from "./model.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 18;
const SERIES_COLORS = [
  "var(--rowan-trend-chart-series-1)",
  "var(--rowan-trend-chart-series-2)",
  "var(--rowan-trend-chart-series-3)",
  "var(--rowan-trend-chart-series-4)",
];
const DEFAULT_MESSAGES = Object.freeze({
  chart: "Trend chart",
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  metric: "Metric",
  noData: "No data",
  noMetricData: "No metric data",
  point: "Point {index}",
  reference: "Reference",
  series: "Series",
});

let trendChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function createSvgElement(name) {
  return document.createElementNS(SVG_NAMESPACE, name);
}

/**
 * @typedef {object} RowanTrendChartMessages
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string} [noMetricData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [reference]
 * @property {string} [series]
 */

/**
 * Frozen small multi-series line chart for operational data sets. Native SVG,
 * no animation, and an equivalent semantic table. Other geometries are
 * separate hosts.
 * @tag rowan-trend-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<import("./model.js").RowanTrendChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Point labels shared across series. Arrays are property-only.
 * @property {import("./model.js").RowanTrendChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanTrendChartValueFormatter | null} valueFormatter - Formats chart and table values. Its context includes tick for compact axis labels. Functions are property-only.
 * @property {RowanTrendChartMessages} messages - Property-only built-in message overrides.
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart chart
 * @csspart plot
 * @csspart legend
 * @csspart legend-item
 * @csspart legend-swatch
 * @csspart point
 * @csspart detail
 * @csspart summary
 * @csspart table
 * @cssprop --rowan-trend-chart-bg
 * @cssprop --rowan-trend-chart-series-1
 * @cssprop --rowan-trend-chart-series-2
 * @event rowan-point-activate - Fired when a user activates an interactive data point.
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - Ids hidden from the plot. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 
 * @attr {boolean} zoom - Opt-in plot zoom and pan.
 * @event rowan-zoom - Fired when the zoom window changes. Detail: x, y, width, height.
 
 * @attr {string} sync-group - Share the axis pointer with charts that use the same group name.
 * @attr {boolean} brush - Drag, or Shift+Arrow, to select an x range. Escape clears it.
 * @attr {number} large-series - Downsample drawn marks above this count. The data table keeps every row.
 * @event rowan-sync - Shared hover. Detail: group, index, label.
 * @event rowan-brush - Selected range. Detail: startIndex, endIndex, startLabel, endLabel, or cleared.
*/
export class RowanTrendChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./trend-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-trend-chart-"];
  static componentTokenDeclarations = trendChartTokenDeclarations;
  static observedAttributes = [
    "label",
    "description",
    "interactive",
    "locale",
    "hidden-series",
    "no-motion",
  ];
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
    "hiddenSeries",
    "tooltipFormatter",
    "noMotion",
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
  #summaryTable = null;
  #summary = null;
  #hover = null;
  #seriesInput = [];
  #series = [];
  #labels = [];
  #valueFormatter = null;
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #descriptionId = "";
  #messages = {};

  connectedCallback() {
    super.connectedCallback();

    if (!this.id) {
      trendChartId += 1;
      this.id = `rowan-trend-chart-${trendChartId}`;
    }

    this.#labelId = `${this.id}__label`;
    this.#descriptionId = `${this.id}__description`;
    this.#applyDefaultA11y();
    applySeriesVisibility(this.renderRoot, readHiddenSeries(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (["label", "description"].includes(name)) this.#applyDefaultA11y();
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

  /** @returns {RowanTrendChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanTrendChartMessages | null | undefined} value */
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

  /** @returns {Array<import("./model.js").RowanTrendChartSeries>} */
  get series() {
    return cloneTrendSeries(this.#series);
  }

  /** @param {Array<import("./model.js").RowanTrendChartSeries>} value */
  set series(value) {
    this.#seriesInput = cloneTrendSeriesInput(value);
    this.#series = normalizeTrendSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {string[]} */
  get labels() {
    return [...this.#labels];
  }

  /** @param {string[]} value */
  set labels(value) {
    this.#labels = normalizeTrendLabels(value);
    this.#series = normalizeTrendSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {import("./model.js").RowanTrendChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  /** @param {import("./model.js").RowanTrendChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeTrendLabels(source.labels);
    this.#seriesInput = cloneTrendSeriesInput(source.series);
    this.#series = normalizeTrendSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {import("./model.js").RowanTrendChartValueFormatter | null} */
  get valueFormatter() {
    return this.#valueFormatter;
  }

  /** @param {import("./model.js").RowanTrendChartValueFormatter | null} value */
  set valueFormatter(value) {
    this.#valueFormatter = typeof value === "function" ? value : null;
    this.requestRender();
  }

  /** @returns {string[]} */
  get hiddenSeries() {
    return readHiddenSeries(this);
  }

  /** @param {string[] | string | null | undefined} value */
  set hiddenSeries(value) {
    writeHiddenSeries(this, value);
  }

  get tooltipFormatter() {
    return readTooltipFormatter(this);
  }

  set tooltipFormatter(value) {
    writeTooltipFormatter(this, value);
  }

  get noMotion() {
    return this.hasAttribute("no-motion");
  }

  set noMotion(value) {
    this.reflectBoolean("no-motion", Boolean(value));
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
                <svg class="plot" part="plot" viewBox="0 0 1000 400"></svg>
                <div class="point-controls" dir="ltr"></div>
              </div>
            </div>
            <div class="axis-footer" aria-hidden="true">
              <span></span>
              <div class="x-axis"></div>
            </div>
            <ul class="legend" part="legend" aria-label="Series"></ul>
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
        textForEvent: (event) => seriesHoverText(this.#entries, event, this.#plot),
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
    applySeriesVisibility(this.renderRoot, readHiddenSeries(this));
  }

  #syncLabels() {
    const label = this.#displayLabel();
    const description = this.#displayDescription();
    const hasLabelSlot = this.#labelSlot.assignedNodes().length > 0;
    const hasDescriptionSlot = this.#descriptionSlot.assignedNodes().length > 0;
    const labelElement = this.renderRoot.querySelector(".chart-label");
    const descriptionElement = this.renderRoot.querySelector(".description");

    this.#heading.hidden = !label && !description;
    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasLabelSlot || !this.label;
    this.#descriptionFallback.textContent = this.description;
    this.#descriptionFallback.hidden = hasDescriptionSlot || !this.description;
    labelElement.id = this.#labelId;
    descriptionElement.id = this.#descriptionId;

    this.#plot.setAttribute("role", "img");
    this.#plot.setAttribute("aria-label", label || this.#chartName());
    if (description) {
      this.#plot.setAttribute("aria-describedby", this.#descriptionId);
    } else {
      this.#plot.removeAttribute("aria-describedby");
    }
  }

  #renderChart() {
    const labels = resolveTrendLabels(this.#series, this.#labels, (index) =>
      this.#pointLabel(index),
    );
    const domain = trendValueDomain(this.#series);
    this.#entries = this.#createEntries(labels, domain);

    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }

    this.#renderPlot();
    this.#renderAxes(labels, domain);
    this.#renderLegend();
    this.#renderPointControls();
    this.#renderSummary(labels);
    this.#syncActivePoint();
  }

  #createEntries(labels, domain) {
    const pointCount = Math.max(labels.length, 1);
    const plotWidth = VIEWBOX_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    const plotHeight = VIEWBOX_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const range = domain.max - domain.min || 1;

    return this.#series.flatMap((series, seriesIndex) =>
      series.values.flatMap((point, index) => {
        if (point.value === null) return [];

        const x =
          PLOT_LEFT + (pointCount === 1 ? plotWidth / 2 : (index / (pointCount - 1)) * plotWidth);
        const y = PLOT_TOP + ((domain.max - point.value) / range) * plotHeight;
        const formattedValue = this.#formatValue(point.value, {
          series,
          index,
          label: labels[index],
        });

        return [
          {
            key: `${series.id}::${index}`,
            series,
            seriesIndex,
            point,
            index,
            label: labels[index] || point.label,
            value: point.value,
            formattedValue,
            x,
            y,
          },
        ];
      }),
    );
  }

  #renderPlot() {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#chartName();
    fragment.append(title);

    const description = this.#displayDescription();
    if (description) {
      const svgDescription = createSvgElement("desc");
      svgDescription.textContent = description;
      fragment.append(svgDescription);
    }

    const grid = createSvgElement("g");
    grid.setAttribute("class", "grid");
    this.#appendGrid(grid);
    fragment.append(grid);

    const paths = createSvgElement("g");
    const markers = createSvgElement("g");

    for (const [seriesIndex, series] of this.#series.entries()) {
      const seriesEntries = this.#entries.filter((entry) => entry.series.id === series.id);
      const path = createSvgElement("path");
      path.setAttribute("class", "series-line");
      path.dataset.seriesId = series.id;
      path.setAttribute("part", "line");
      path.setAttribute("fill", "none");
      path.style.stroke = this.#seriesColor(series, seriesIndex);
      path.setAttribute("d", this.#pathData(seriesEntries));
      paths.append(path);

      for (const entry of seriesEntries) {
        const marker = createSvgElement("circle");
        marker.setAttribute("class", "point-marker");
        marker.setAttribute("part", "point-marker");
        marker.dataset.pointKey = entry.key;
        marker.setAttribute("cx", entry.x);
        marker.setAttribute("cy", entry.y);
        marker.setAttribute("r", "4");
        marker.style.fill = this.#seriesColor(series, seriesIndex);
        markers.append(marker);
      }
    }

    fragment.append(paths, markers);

    if (this.#entries.length === 0) {
      const empty = createSvgElement("text");
      empty.setAttribute("class", "empty-label");
      empty.setAttribute("x", String(VIEWBOX_WIDTH / 2));
      empty.setAttribute("y", String(VIEWBOX_HEIGHT / 2));
      empty.setAttribute("text-anchor", "middle");
      empty.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "noMetricData");
      fragment.append(empty);
    }

    this.#plot.replaceChildren(fragment);
  }

  #renderAxes(labels, domain) {
    const yAxis = document.createDocumentFragment();
    for (let tick = 0; tick <= 4; tick += 1) {
      const value = domain.max - (tick / 4) * (domain.max - domain.min);
      const label = document.createElement("span");
      label.className = "axis-y-label";
      label.textContent = this.#formatValue(value, { tick: true });
      yAxis.append(label);
    }
    this.#yAxis.replaceChildren(yAxis);

    const xAxis = document.createDocumentFragment();
    const maximumLabels = 6;
    const labelStep = Math.max(1, Math.ceil(labels.length / maximumLabels));
    this.#xAxis.style.setProperty("--trend-chart-label-count", String(Math.max(labels.length, 1)));

    labels.forEach((value, index) => {
      if (index % labelStep !== 0 && index !== labels.length - 1) return;

      const label = document.createElement("span");
      label.className = "axis-x-label";
      label.style.gridColumnStart = String(index + 1);
      label.textContent = value;
      xAxis.append(label);
    });
    this.#xAxis.replaceChildren(xAxis);
  }

  #renderLegend() {
    this.#legend.textContent = "";
    this.#legend.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "series"),
    );
    this.#legend.hidden = this.#series.length === 0;
    if (this.#legend.hidden) return;

    const fragment = document.createDocumentFragment();
    for (const [seriesIndex, series] of this.#series.entries()) {
      const item = document.createElement("li");
      item.className = "legend-item";
      item.setAttribute("part", "legend-item");

      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.setAttribute("part", "legend-swatch");
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.setProperty("--series-color", this.#seriesColor(series, seriesIndex));

      item.append(swatch, document.createTextNode(series.label));
      fragment.append(item);
    }

    this.#legend.append(fragment);
  }

  #appendGrid(group) {
    const right = VIEWBOX_WIDTH - PLOT_RIGHT;
    const plotHeight = VIEWBOX_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const path = createSvgElement("path");
    let d = "";
    for (let tick = 0; tick <= 4; tick += 1) {
      const y = PLOT_TOP + (tick / 4) * plotHeight;
      d += `M${PLOT_LEFT},${y}H${right}`;
    }
    path.setAttribute("d", d);
    group.append(path);
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
        button.setAttribute("part", "point");
        button.type = "button";
        button.dataset.pointKey = entry.key;
        button.style.setProperty("--point-x", `${(entry.x / VIEWBOX_WIDTH) * 100}%`);
        button.style.setProperty("--point-y", `${(entry.y / VIEWBOX_HEIGHT) * 100}%`);
        button.style.setProperty("--point-offset", `${(entry.seriesIndex % 3) * 0.2}rem`);
        button.setAttribute(
          "aria-label",
          `${entry.series.label}, ${entry.label}, ${entry.formattedValue}`,
        );
        button.setAttribute("aria-pressed", entry.key === this.#activePointKey ? "true" : "false");
        fragment.append(button);
      }

      this.#pointControls.append(fragment);
    });
  }

  #renderSummary(labels) {
    renderChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#chartName(),
      }),
      labels,
      series: this.#series,
      formatValue: (value, series, index, label) =>
        this.#formatValue(value, { series, index, label }),
      messages: this.#messages,
    });
  }

  #syncActivePoint() {
    const entry = this.#entries.find((item) => item.key === this.#activePointKey) ?? null;
    this.#detail.hidden = !entry;
    this.#detail.textContent = entry
      ? `${entry.series.label}, ${entry.label}: ${entry.formattedValue}`
      : "";

    for (const button of this.#pointControls.querySelectorAll("button[data-point-key]")) {
      const isActive = button.dataset.pointKey === this.#activePointKey;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    for (const marker of this.#plot.querySelectorAll("circle[data-point-key]")) {
      marker.classList.toggle("is-active", marker.dataset.pointKey === this.#activePointKey);
    }
  }

  #handlePointClick(event) {
    const entry = this.#entryFromEvent(event);
    if (entry) this.#activatePoint(entry);
  }

  #handlePointFocus(event) {
    const entry = this.#entryFromEvent(event);
    if (entry) this.#setActivePoint(entry);
  }

  #handlePointKeydown(event) {
    navigatePointKey(event, visibleEntries(this, this.#entries), (entry, activate) => {
      if (activate) {
        this.#activatePoint(entry);
        return;
      }
      this.#setActivePoint(entry);
      this.#pointButtonFor(entry.key)?.focus({ preventScroll: true });
    });
  }

  #activatePoint(entry) {
    this.#setActivePoint(entry);
    emitPointActivate(this, emit, entry);
  }

  #setActivePoint(entry) {
    if (this.#activePointKey === entry.key) return;
    this.#activePointKey = entry.key;
    this.#syncActivePoint();
  }

  #entryFromEvent(event) {
    const button = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.pointKey);
    if (!button) return null;

    return this.#entries.find((entry) => entry.key === button.dataset.pointKey) ?? null;
  }

  #pointButtonFor(key) {
    return [...this.#pointControls.querySelectorAll("button[data-point-key]")].find(
      (button) => button.dataset.pointKey === key,
    );
  }

  #pathData(entries) {
    return entries
      .map((entry, index) => {
        const previous = entries[index - 1];
        const command = previous && entry.index === previous.index + 1 ? "L" : "M";
        return `${command}${entry.x.toFixed(2)},${entry.y.toFixed(2)}`;
      })
      .join(" ");
  }

  #seriesColor(series, index) {
    return series.color || SERIES_COLORS[index % SERIES_COLORS.length];
  }

  #formatValue(value, context) {
    if (!this.#valueFormatter) {
      return formatNumber(value, { fallback: String(value), locale: this.locale });
    }

    try {
      return String(this.#valueFormatter(value, context));
    } catch (_error) {
      return String(value);
    }
  }

  #pointLabel(index) {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "point", {
      index: String(index + 1),
    });
  }

  #displayLabel() {
    return this.#assignedSlotText(this.#labelSlot) || this.label;
  }

  #displayDescription() {
    return this.#assignedSlotText(this.#descriptionSlot) || this.description;
  }

  #chartName() {
    return this.#displayLabel() || resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
  }

  #assignedSlotText(slot) {
    if (!slot) return "";

    return slot
      .assignedNodes()
      .map((node) => node.textContent ?? "")
      .join(" ")
      .trim();
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.#chartName();
    }

    if (!this.hasAttribute("aria-description") && "ariaDescription" in this.internals) {
      this.internals.ariaDescription = this.#displayDescription() || null;
    }
  }
}

define("rowan-trend-chart", RowanTrendChart);
