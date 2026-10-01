import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  renderKeyedChartTable,
} from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, seriesHoverText } from "../chart/hover.js";
import { chartSeriesColor, formatChartValue } from "../chart/model.js";
import {
  cloneScatterSeries,
  cloneScatterSeriesInput,
  normalizeScatterSeries,
  scatterDomains,
} from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 48;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const MIN_RADIUS = 4;
const MAX_RADIUS = 18;

let scatterChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function scatterRadius(size, sizeDomain, sizeRange) {
  if (size === null || !sizeDomain) return 5;
  const radius = MIN_RADIUS + ((size - sizeDomain.min) / sizeRange) * (MAX_RADIUS - MIN_RADIUS);
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, radius));
}

function formatScatterPoint(formatter, point, context) {
  const x = formatChartValue(formatter, point.x, context);
  const y = formatChartValue(formatter, point.y, context);
  if (point.size === null) return `x=${x}, y=${y}`;
  return `x=${x}, y=${y}, size=${formatChartValue(formatter, point.size, context)}`;
}

/**
 * Experimental scatter / bubble chart. Bubble is a `size` encoding, not a
 * second tag. Null x or y is no-data.
 * @tag rowan-scatter-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Series of `{ id, label, color?, points: [{ x, y, size?, label? }] }`. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart point
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-scatter-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive point.
 */
export class RowanScatterChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./scatter-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-scatter-chart-"];
  static observedAttributes = ["label", "description", "interactive"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "series",
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
  #xAxis = null;
  #yAxis = null;
  #legend = null;
  #pointControls = null;
  #detail = null;
  #hover = null;
  #summaryTable = null;
  #seriesInput = [];
  #series = [];
  #valueFormatter = null;
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #descriptionId = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      scatterChartId += 1;
      this.id = `rowan-scatter-chart-${scatterChartId}`;
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

  get interactive() {
    return this.readBoolean("interactive");
  }

  set interactive(value) {
    this.reflectBoolean("interactive", Boolean(value));
  }

  get series() {
    return cloneScatterSeries(this.#series);
  }

  set series(value) {
    this.#seriesInput = cloneScatterSeriesInput(value);
    this.#series = normalizeScatterSeries(this.#seriesInput);
    this.#activePointKey = "";
    this.requestRender();
  }

  get config() {
    return {
      series: this.series,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  set config(value) {
    const source = isObject(value) ? value : {};
    this.#seriesInput = cloneScatterSeriesInput(source.series);
    this.#series = normalizeScatterSeries(this.#seriesInput);
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
            <div class="plot-layout">
              <div class="y-axis" aria-hidden="true"></div>
              <div class="plot-wrap">
                <svg class="plot" part="plot" viewBox="0 0 ${SVG_NAMESPACE_WIDTH} ${SVG_NAMESPACE_HEIGHT}"></svg>
                <div class="point-controls"></div>
              </div>
            </div>
            <div class="x-axis" aria-hidden="true"></div>
            <ul class="legend" part="legend" aria-label="Series"></ul>
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
      this.#xAxis = this.renderRoot.querySelector(".x-axis");
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
    this.#plot.setAttribute("aria-label", label || "Scatter chart");
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
    const domains = scatterDomains(this.#series);
    const plot = this.#plotBox();
    this.#entries = this.#createEntries(domains, plot);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(plot);
    this.#renderAxes(domains);
    this.#renderLegend();
    this.#renderPointControls();
    const hasSize = this.#entries.some((entry) => entry.size !== null);
    renderKeyedChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || "Scatter chart"} data table`,
      columns: [
        { key: "series", header: "Series" },
        { key: "label", header: "Point" },
        { key: "x", header: "X" },
        { key: "y", header: "Y" },
        ...(hasSize ? [{ key: "size", header: "Size" }] : []),
      ],
      rows: this.#entries.map((entry) => ({
        series: entry.series.label,
        label: entry.label,
        x: formatChartValue(this.#valueFormatter, entry.x, { label: entry.label }),
        y: formatChartValue(this.#valueFormatter, entry.y, { label: entry.label }),
        size:
          entry.size === null
            ? null
            : formatChartValue(this.#valueFormatter, entry.size, { label: entry.label }),
      })),
    });
    this.#syncActivePoint();
  }

  #createEntries(domains, plot) {
    const xRange = domains.x.max - domains.x.min || 1;
    const yRange = domains.y.max - domains.y.min || 1;
    const sizeRange = domains.size ? domains.size.max - domains.size.min || 1 : 1;
    const entries = [];

    this.#series.forEach((series, seriesIndex) => {
      series.points.forEach((point, index) => {
        if (point.x === null || point.y === null) return;
        const x = plot.left + ((point.x - domains.x.min) / xRange) * plot.width;
        const y = plot.top + ((domains.y.max - point.y) / yRange) * plot.height;
        const radius = scatterRadius(point.size, domains.size, sizeRange);
        const formattedValue = formatScatterPoint(this.#valueFormatter, point, {
          series,
          index,
          label: point.label,
        });
        entries.push({
          key: `${series.id}::${index}`,
          series,
          seriesIndex,
          index,
          label: point.label,
          value: point.y,
          formattedValue,
          x: point.x,
          y: point.y,
          size: point.size,
          plotX: x,
          plotY: y,
          radius,
          detail: { x: point.x, y: point.y, size: point.size },
        });
      });
    });
    return entries;
  }

  #renderPlot(plot) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || "Scatter chart";
    fragment.append(title);

    const axis = createSvgElement("rect");
    axis.setAttribute("class", "plot-frame");
    axis.setAttribute("x", String(plot.left));
    axis.setAttribute("y", String(plot.top));
    axis.setAttribute("width", String(plot.width));
    axis.setAttribute("height", String(plot.height));
    fragment.append(axis);

    for (const entry of this.#entries) {
      const mark = createSvgElement("circle");
      mark.setAttribute("class", "point");
      mark.setAttribute("part", "point");
      mark.dataset.pointKey = entry.key;
      mark.setAttribute("cx", String(entry.plotX));
      mark.setAttribute("cy", String(entry.plotY));
      mark.setAttribute("r", String(entry.radius));
      mark.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
      fragment.append(mark);
    }
    this.#plot.replaceChildren(fragment);
  }

  #renderAxes(domains) {
    const ticks = (domain) => [domain.max, (domain.max + domain.min) / 2, domain.min];
    this.#yAxis.replaceChildren();
    for (const tick of ticks(domains.y)) {
      const item = document.createElement("span");
      item.textContent = formatChartValue(this.#valueFormatter, tick, { tick: true });
      this.#yAxis.append(item);
    }
    this.#xAxis.replaceChildren();
    for (const tick of [...ticks(domains.x)].reverse()) {
      const item = document.createElement("span");
      item.textContent = formatChartValue(this.#valueFormatter, tick, { tick: true });
      this.#xAxis.append(item);
    }
  }

  #renderLegend() {
    this.#legend.replaceChildren();
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
      this.internals.ariaLabel = this.#displayLabel() || "Scatter chart";
    }
  }
}

define("rowan-scatter-chart", RowanScatterChart);
