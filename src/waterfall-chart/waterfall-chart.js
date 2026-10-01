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
  categoricalBaseline,
  formatChartValue,
  normalizeChartLabels,
} from "../chart/model.js";
import {
  cloneWaterfallSeries,
  cloneWaterfallSeriesInput,
  normalizeWaterfallSeries,
  waterfallDomain,
  waterfallEntries,
  resolveWaterfallLabels,
} from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const DEFAULT_MESSAGES = Object.freeze({
  category: "Category",
  chart: "Waterfall chart",
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  decrease: "Decrease",
  deltaValue: "delta",
  encodings: "Encodings",
  increase: "Increase",
  noData: "No data",
  point: "Point {index}",
  total: "Total",
  totalValue: "total",
  type: "Type",
  value: "Value",
});

let waterfallChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {object} RowanWaterfallChartMessages
 * @property {string} [category]
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [decrease]
 * @property {string} [deltaValue]
 * @property {string} [encodings]
 * @property {string} [increase]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [total]
 * @property {string} [totalValue]
 * @property {string} [type]
 * @property {string} [value]
 */

function waterfallTone(entry) {
  if (entry.value === null) return "";
  if (entry.type === "total") return "info";
  return entry.value >= 0 ? "success" : "danger";
}

/**
 * Experimental waterfall. Signed deltas from a running total. Totals are
 * `{ type: "total" }` from zero; the host does not invent them. Null is no-data.
 * @tag rowan-waterfall-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - First series of `{ value, type?: "total" }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanWaterfallChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-waterfall-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive bar.
 */
export class RowanWaterfallChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./waterfall-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-waterfall-chart-"];
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
      waterfallChartId += 1;
      this.id = `rowan-waterfall-chart-${waterfallChartId}`;
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

  /** @returns {RowanWaterfallChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanWaterfallChartMessages | null | undefined} value */
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

  get series() {
    return cloneWaterfallSeries(this.#series);
  }

  set series(value) {
    this.#seriesInput = cloneWaterfallSeriesInput(value);
    this.#series = normalizeWaterfallSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  get labels() {
    return [...this.#labels];
  }

  set labels(value) {
    this.#labels = normalizeChartLabels(value);
    this.#series = normalizeWaterfallSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneWaterfallSeriesInput(source.series);
    this.#series = normalizeWaterfallSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
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
    const labels = resolveWaterfallLabels(this.#primarySeries(), this.#labels, (index) =>
      this.#pointLabel(index),
    );
    const steps = waterfallEntries(series, labels);
    const domain = waterfallDomain(steps);
    const plot = this.#plotBox();
    this.#entries = this.#createEntries(steps, series, domain, plot);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(domain, plot);
    this.#renderAxis(labels);
    this.#renderLegend();
    this.#renderPointControls();
    renderKeyedChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#chartName(),
      }),
      columns: [
        { key: "label", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "category") },
        { key: "type", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "type") },
        { key: "value", header: resolveMessage(this.#messages, DEFAULT_MESSAGES, "value") },
      ],
      rows: steps.map((step) => ({
        label: step.label,
        type: step.value === null ? null : this.#typeLabel(step.type),
        value:
          step.value === null
            ? null
            : this.#formatValue(step.value, {
                series,
                index: step.index,
                label: step.label,
              }),
      })),
      messages: this.#messages,
    });
    this.#syncActivePoint();
  }

  #createEntries(steps, series, domain, plot) {
    const categoryCount = Math.max(steps.length, 1);
    const groupSize = plot.width / categoryCount;
    const barThickness = groupSize * 0.62;
    const entries = [];

    for (const step of steps) {
      if (step.value === null) continue;
      const groupStart = plot.left + step.index * groupSize + (groupSize - barThickness) / 2;
      const rect = categoricalBarRect({
        orientation: "vertical",
        from: step.from,
        to: step.to,
        domain,
        groupStart,
        thickness: barThickness,
        plot,
      });
      const formattedValue = this.#formatValue(step.value, {
        series,
        index: step.index,
        label: step.label,
      });
      const range = domain.max - domain.min || 1;
      const yFor = (value) => plot.top + ((domain.max - value) / range) * plot.height;
      entries.push({
        key: `${series?.id ?? "waterfall"}::${step.index}`,
        series: series ?? { id: "waterfall", label: "Waterfall" },
        index: step.index,
        label: step.label,
        value: step.value,
        formattedValue,
        type: step.type,
        tone: waterfallTone(step),
        plotX: rect.x,
        plotY: rect.y,
        width: rect.width,
        height: Math.max(rect.height, 1),
        barY: rect.y,
        fromY: yFor(step.from),
        toY: yFor(step.to),
        detail: { type: step.type },
      });
    }
    return entries;
  }

  #renderPlot(domain, plot) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#chartName();
    fragment.append(title);

    const baseline = categoricalBaseline("vertical", domain, plot);
    const axis = createSvgElement("line");
    axis.setAttribute("class", "zero-line");
    axis.setAttribute("x1", String(baseline.x1));
    axis.setAttribute("x2", String(baseline.x2));
    axis.setAttribute("y1", String(baseline.y1));
    axis.setAttribute("y2", String(baseline.y2));
    fragment.append(axis);

    for (let index = 0; index < this.#entries.length - 1; index += 1) {
      const current = this.#entries[index];
      const next = this.#entries[index + 1];
      const connector = createSvgElement("line");
      connector.setAttribute("class", "connector");
      connector.setAttribute("x1", String(current.plotX + current.width));
      connector.setAttribute("y1", String(current.toY));
      connector.setAttribute("x2", String(next.plotX));
      connector.setAttribute("y2", String(next.fromY));
      fragment.append(connector);
    }

    for (const entry of this.#entries) {
      const bar = createSvgElement("rect");
      bar.setAttribute("class", "bar");
      bar.setAttribute("part", "bar");
      bar.dataset.pointKey = entry.key;
      bar.dataset.tone = entry.tone;
      bar.setAttribute("x", String(entry.plotX));
      bar.setAttribute("y", String(entry.barY));
      bar.setAttribute("width", String(Math.max(entry.width, 1)));
      bar.setAttribute("height", String(entry.height));
      fragment.append(bar);
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
    const items = [
      { tone: "success", label: resolveMessage(this.#messages, DEFAULT_MESSAGES, "increase") },
      { tone: "danger", label: resolveMessage(this.#messages, DEFAULT_MESSAGES, "decrease") },
      { tone: "info", label: resolveMessage(this.#messages, DEFAULT_MESSAGES, "total") },
    ].filter((item) => this.#entries.some((entry) => entry.tone === item.tone));
    this.#legend.replaceChildren();
    this.#legend.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "encodings"),
    );
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const row = document.createElement("li");
      row.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.dataset.tone = item.tone;
      swatch.setAttribute("aria-hidden", "true");
      row.append(swatch, document.createTextNode(item.label));
      fragment.append(row);
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
        button.style.setProperty("--point-y", `${(entry.barY / SVG_NAMESPACE_HEIGHT) * 100}%`);
        button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty(
          "--point-height",
          `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`,
        );
        button.setAttribute(
          "aria-label",
          `${entry.label}, ${this.#typeLabel(entry.type)}, ${entry.formattedValue}`,
        );
        fragment.append(button);
      }
      this.#pointControls.append(fragment);
    });
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

  #chartName() {
    return this.#displayLabel() || resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart");
  }

  #typeLabel(type) {
    const key = type === "total" ? "totalValue" : "deltaValue";
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, key);
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

define("rowan-waterfall-chart", RowanWaterfallChart);
