import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  withRestoredPointFocus,
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
import {
  radarAreaPath,
  radarDomain,
  radarDominantBaseline,
  radarLinePath,
  radarPoint,
  radarPolygonPath,
  radarRadius,
  radarRingPoint,
  radarTextAnchor,
} from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 1000;
const PLOT_PAD = 88;
const GEOMETRIES = new Set(["line", "area"]);
const DEFAULT_MESSAGES = Object.freeze({
  chart: ({ geometry }) => (geometry === "area" ? "Radar area chart" : "Radar chart"),
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  metric: "Metric",
  noData: "No data",
  point: "Point {index}",
  series: "Series",
});

let radarChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {object} RowanRadarChartMessages
 * @property {string | ((context: { geometry: "line" | "area" }) => string)} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [series]
 */

/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   geometry?: "line" | "area",
 * }} RowanRadarChartConfig
 */

/**
 * Experimental polar comparison. Categories are axes around the ring.
 * `geometry` is `line` (default) or `area`. Null is no-data and breaks the
 * ring; the host does not treat a gap as zero. Frozen categorical `series`.
 * Nightingale and radial bars are not this host.
 * @tag rowan-radar-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"line"|"area"} geometry - Default `line`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Axis labels around the ring. Arrays are property-only.
 * @property {RowanRadarChartConfig} config - Replaces the complete chart configuration. Omitted `geometry` resets to line.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @property {RowanRadarChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart line
 * @csspart area
 * @csspart point
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-radar-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive vertex.
 */
export class RowanRadarChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./radar-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-radar-chart-"];
  static observedAttributes = ["label", "description", "interactive", "geometry", "locale"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "geometry",
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
      radarChartId += 1;
      this.id = `rowan-radar-chart-${radarChartId}`;
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

  /** @returns {RowanRadarChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanRadarChartMessages | null | undefined} value */
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

  /** @returns {"line" | "area"} */
  get geometry() {
    return normalizeEnum(this.readString("geometry", "line"), GEOMETRIES, "line");
  }

  /** @param {"line" | "area"} value */
  set geometry(value) {
    reflectEnum(this, "geometry", value, GEOMETRIES, "line");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "geometry" && rewriteEnumAttribute(this, name, newValue, GEOMETRIES, "line")) {
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

  /** @returns {RowanRadarChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      geometry: this.geometry,
    };
  }

  /** @param {RowanRadarChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneChartSeriesInput(source.series);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    reflectEnum(this, "geometry", source.geometry, GEOMETRIES, "line");
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
            <div class="plot-wrap">
              <svg class="plot" part="plot" viewBox="0 0 ${SVG_NAMESPACE_WIDTH} ${SVG_NAMESPACE_HEIGHT}"></svg>
              <div class="point-controls" dir="ltr"></div>
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
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart", { geometry: this.geometry });
  }

  #plotBox() {
    const size = Math.min(SVG_NAMESPACE_WIDTH, SVG_NAMESPACE_HEIGHT);
    const cx = SVG_NAMESPACE_WIDTH / 2;
    const cy = SVG_NAMESPACE_HEIGHT / 2;
    return {
      cx,
      cy,
      radius: size / 2 - PLOT_PAD,
    };
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

  #renderChart() {
    const labels = resolveChartLabels(this.#series, this.#labels, (index) =>
      this.#pointLabel(index),
    );
    const domain = radarDomain(this.#series);
    const plot = this.#plotBox();
    this.#entries = this.#createEntries(labels, domain, plot);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(labels, domain, plot);
    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#displayLabel() || this.#chartName(),
      }),
      labels,
      series: this.#series,
      formatValue: (value, item, index, label) =>
        this.#formatValue(value, {
          series: item,
          index,
          label,
        }),
      messages: this.#messages,
    });
    this.#syncActivePoint();
  }

  #createEntries(labels, domain, plot) {
    const categoryCount = Math.max(labels.length, 1);
    const entries = [];
    this.#series.forEach((series, seriesIndex) => {
      labels.forEach((label, index) => {
        const point = series.values[index];
        if (!point || point.value === null) return;
        const polar = radarPoint(
          index,
          categoryCount,
          point.value,
          domain,
          plot.cx,
          plot.cy,
          plot.radius,
        );
        entries.push({
          key: `${series.id}::${index}`,
          series,
          seriesIndex,
          index,
          label,
          value: point.value,
          formattedValue: this.#formatValue(point.value, {
            series,
            index,
            label,
          }),
          plotX: polar.x,
          plotY: polar.y,
        });
      });
    });
    return entries;
  }

  #renderPlot(labels, domain, plot) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || this.#chartName();
    fragment.append(title);

    const categoryCount = Math.max(labels.length, 1);
    const rings = [1 / 3, 2 / 3, 1];
    for (const fraction of rings) {
      const d = radarPolygonPath(categoryCount, plot.cx, plot.cy, plot.radius * fraction);
      if (!d) continue;
      const ring = createSvgElement("path");
      ring.setAttribute("class", "grid");
      ring.setAttribute("d", d);
      fragment.append(ring);
    }

    for (let index = 0; index < categoryCount; index += 1) {
      const tip = radarRingPoint(index, categoryCount, plot.cx, plot.cy, plot.radius);
      const spoke = createSvgElement("path");
      spoke.setAttribute("class", "spoke");
      spoke.setAttribute(
        "d",
        `M${plot.cx.toFixed(2)},${plot.cy.toFixed(2)} L${tip.x.toFixed(2)},${tip.y.toFixed(2)}`,
      );
      fragment.append(spoke);
    }

    const ticks = [domain.max, (domain.max + domain.min) / 2, domain.min];
    for (const tick of ticks) {
      const label = createSvgElement("text");
      label.setAttribute("class", "tick-label");
      label.setAttribute("x", String(plot.cx + 8));
      label.setAttribute("y", String(plot.cy - radarRadius(tick, domain, plot.radius)));
      label.textContent = this.#formatValue(tick, { tick: true });
      fragment.append(label);
    }

    labels.forEach((label, index) => {
      const tip = radarRingPoint(index, categoryCount, plot.cx, plot.cy, plot.radius + 28);
      const text = createSvgElement("text");
      text.setAttribute("class", "axis-label");
      text.setAttribute("x", tip.x.toFixed(2));
      text.setAttribute("y", tip.y.toFixed(2));
      text.setAttribute("text-anchor", radarTextAnchor(tip.angle));
      text.setAttribute("dominant-baseline", radarDominantBaseline(tip.angle));
      text.textContent = label;
      fragment.append(text);
    });

    const area = this.geometry === "area";
    this.#series.forEach((series, seriesIndex) => {
      const vertices = [];
      labels.forEach((_label, index) => {
        const point = series.values[index];
        if (!point || point.value === null) return;
        const polar = radarPoint(
          index,
          categoryCount,
          point.value,
          domain,
          plot.cx,
          plot.cy,
          plot.radius,
        );
        vertices.push({ index, x: polar.x, y: polar.y });
      });
      const color = chartSeriesColor(series, seriesIndex);
      const fill = area ? radarAreaPath(vertices, categoryCount) : "";
      if (fill) {
        const band = createSvgElement("path");
        band.setAttribute("class", "series-area");
        band.setAttribute("part", "area");
        band.setAttribute("d", fill);
        band.style.fill = color;
        band.style.stroke = color;
        fragment.append(band);
      } else {
        const stroke = radarLinePath(vertices, categoryCount);
        if (stroke) {
          const line = createSvgElement("path");
          line.setAttribute("class", "series-line");
          line.setAttribute("part", "line");
          line.setAttribute("d", stroke);
          line.style.stroke = color;
          fragment.append(line);
        }
      }
    });

    for (const entry of this.#entries) {
      const mark = createSvgElement("circle");
      mark.setAttribute("class", "point");
      mark.setAttribute("part", "point");
      mark.dataset.pointKey = entry.key;
      mark.setAttribute("cx", entry.plotX.toFixed(2));
      mark.setAttribute("cy", entry.plotY.toFixed(2));
      mark.setAttribute("r", "6");
      mark.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
      fragment.append(mark);
    }

    this.#plot.replaceChildren(fragment);
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

define("rowan-radar-chart", RowanRadarChart);
