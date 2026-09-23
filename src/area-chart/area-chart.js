import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { createReferenceLine } from "../chart/dom.js";
import {
  bindChartHover,
  createChartHoverBubble,
  nearestPointByClientX,
  referenceLineHoverText,
} from "../chart/hover.js";
import { expandDomainWithReferenceLines, normalizeReferenceLines } from "../chart/model.js";
import {
  cloneTrendSeries,
  normalizeTrendLabels,
  normalizeTrendSeries,
  resolveTrendLabels,
  trendValueDomain,
} from "../trend-chart/model.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 18;
const SERIES_COLORS = [
  "var(--rowan-area-chart-series-1, var(--rowan-trend-chart-series-1))",
  "var(--rowan-area-chart-series-2, var(--rowan-trend-chart-series-2))",
  "var(--rowan-area-chart-series-3, var(--rowan-trend-chart-series-3))",
  "var(--rowan-area-chart-series-4, var(--rowan-trend-chart-series-4))",
];

let areaChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function cloneTrendSeriesInput(value) {
  if (!Array.isArray(value)) return [];

  return value.map((series) => {
    if (!isObject(series)) return series;

    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) =>
            isObject(point) ? { label: point.label, value: point.value } : point,
          )
        : series.values,
    };
  });
}

function createSvgElement(name) {
  return document.createElementNS(SVG_NAMESPACE, name);
}

function createCell(tagName, text, scope = "") {
  const cell = document.createElement(tagName);
  if (scope) cell.scope = scope;
  cell.textContent = text;
  return cell;
}

/**
 * Experimental filled multi-series area chart. Same data contract as the line
 * chart. Null values break both the line and the fill.
 * @tag rowan-area-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Point labels shared across series. Arrays are property-only.
 * @property {import("../trend-chart/model.js").RowanTrendChartConfig} config - Replaces the complete chart configuration.
 * @property {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} valueFormatter - Formats chart and table values. Its context includes tick for compact axis labels. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Arrays are property-only.
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
 * @csspart area
 * @csspart line
 * @csspart hover
 * @csspart reference-line
 * @cssprop --rowan-area-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive data point.
 */
export class RowanAreaChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./area-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-area-chart-"];
  static observedAttributes = ["label", "description", "interactive"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "series",
    "labels",
    "config",
    "valueFormatter",
    "referenceLines",
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
  #seriesInput = [];
  #series = [];
  #labels = [];
  #valueFormatter = null;
  #referenceLines = [];
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #descriptionId = "";

  connectedCallback() {
    super.connectedCallback();

    if (!this.id) {
      areaChartId += 1;
      this.id = `rowan-area-chart-${areaChartId}`;
    }

    this.#labelId = `${this.id}__label`;
    this.#descriptionId = `${this.id}__description`;
    this.#applyDefaultA11y();
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

  get interactive() {
    return this.readBoolean("interactive");
  }

  set interactive(value) {
    this.reflectBoolean("interactive", Boolean(value));
  }

  /** @returns {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} */
  get series() {
    return cloneTrendSeries(this.#series);
  }

  /** @param {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} value */
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

  /** @returns {import("../trend-chart/model.js").RowanTrendChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      referenceLines: this.referenceLines,
    };
  }

  /** @param {import("../trend-chart/model.js").RowanTrendChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeTrendLabels(source.labels);
    this.#seriesInput = cloneTrendSeriesInput(source.series);
    this.#series = normalizeTrendSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.#referenceLines = normalizeReferenceLines(source.referenceLines);
    this.reflectBoolean("interactive", Boolean(source.interactive));
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} */
  get valueFormatter() {
    return this.#valueFormatter;
  }

  /** @param {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} value */
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
            <div class="plot-layout">
              <div class="y-axis" aria-hidden="true"></div>
              <div class="plot-wrap">
                <svg class="plot" part="plot" viewBox="0 0 1000 400"></svg>
                <div class="point-controls"></div>
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
      this.#xAxis = this.renderRoot.querySelector(".x-axis");
      this.#legend = this.renderRoot.querySelector(".legend");
      this.#pointControls = this.renderRoot.querySelector(".point-controls");
      this.#detail = this.renderRoot.querySelector(".detail");
      this.#summaryTable = this.renderRoot.querySelector("table");
      this.#hover = createChartHoverBubble();
      this.renderRoot.querySelector(".chart").append(this.#hover);
      bindChartHover(this, {
        target: this.renderRoot.querySelector(".chart"),
        bubble: this.#hover,
        anchor: this.#plot,
        textForEvent: (event) => this.#hoverText(event),
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
    this.#plot.setAttribute("aria-label", label || "Area chart");
    if (description) {
      this.#plot.setAttribute("aria-describedby", this.#descriptionId);
    } else {
      this.#plot.removeAttribute("aria-describedby");
    }
  }

  #renderChart() {
    const labels = resolveTrendLabels(this.#series, this.#labels);
    const domain = expandDomainWithReferenceLines(
      trendValueDomain(this.#series),
      this.#referenceLines,
    );
    this.#entries = this.#createEntries(labels, domain);

    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }

    this.#renderPlot(domain);
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

  #renderPlot(domain) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || "Area chart";
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
    paths.setAttribute("class", "series-paths");
    const markers = createSvgElement("g");
    markers.setAttribute("class", "series-markers");

    const range = domain.max - domain.min || 1;
    const plotHeight = VIEWBOX_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const baselineValue = domain.min > 0 ? domain.min : Math.min(0, domain.max);
    const baselineY = PLOT_TOP + ((domain.max - baselineValue) / range) * plotHeight;

    for (const [seriesIndex, series] of this.#series.entries()) {
      const seriesEntries = this.#entries.filter((entry) => entry.series.id === series.id);
      const color = this.#seriesColor(series, seriesIndex);

      const area = createSvgElement("path");
      area.setAttribute("class", "series-area");
      area.setAttribute("part", "area");
      area.style.fill = color;
      area.setAttribute("d", this.#areaPathData(seriesEntries, baselineY));
      paths.append(area);

      const path = createSvgElement("path");
      path.setAttribute("class", "series-line");
      path.setAttribute("part", "line");
      path.setAttribute("fill", "none");
      path.style.stroke = color;
      path.setAttribute("d", this.#pathData(seriesEntries));
      paths.append(path);

      for (const entry of seriesEntries) {
        const marker = createSvgElement("circle");
        marker.setAttribute("class", "point-marker");
        marker.setAttribute("part", "point-marker");
        marker.dataset.pointKey = entry.key;
        marker.setAttribute("cx", String(entry.x));
        marker.setAttribute("cy", String(entry.y));
        marker.setAttribute("r", "4");
        marker.style.fill = this.#seriesColor(series, seriesIndex);
        marker.setAttribute("aria-hidden", "true");
        markers.append(marker);
      }
    }

    fragment.append(paths, markers);

    const plotWidth = VIEWBOX_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    for (const line of this.#referenceLines) {
      const y = PLOT_TOP + ((domain.max - line.value) / range) * plotHeight;
      fragment.append(
        createReferenceLine({
          x1: PLOT_LEFT,
          x2: PLOT_LEFT + plotWidth,
          y,
          tone: line.tone,
          label: line.label,
          formattedValue: this.#formatValue(line.value, { label: line.label || "Reference" }),
        }),
      );
    }

    if (this.#entries.length === 0) {
      const empty = createSvgElement("text");
      empty.setAttribute("class", "empty-label");
      empty.setAttribute("x", String(VIEWBOX_WIDTH / 2));
      empty.setAttribute("y", String(VIEWBOX_HEIGHT / 2));
      empty.setAttribute("text-anchor", "middle");
      empty.textContent = "No metric data";
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
      label.title = label.textContent;
      yAxis.append(label);
    }
    this.#yAxis.replaceChildren(yAxis);

    const xAxis = document.createDocumentFragment();
    const maximumLabels = 6;
    const labelStep = Math.max(1, Math.ceil(labels.length / maximumLabels));
    this.#xAxis.style.setProperty("--area-chart-label-count", String(Math.max(labels.length, 1)));

    labels.forEach((value, index) => {
      if (index % labelStep !== 0 && index !== labels.length - 1) return;

      const label = document.createElement("span");
      label.className = "axis-x-label";
      label.style.gridColumnStart = String(index + 1);
      label.textContent = value;
      label.title = value;
      xAxis.append(label);
    });
    this.#xAxis.replaceChildren(xAxis);
  }

  #renderLegend() {
    this.#legend.textContent = "";
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
    const plotWidth = VIEWBOX_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    const plotHeight = VIEWBOX_HEIGHT - PLOT_TOP - PLOT_BOTTOM;

    for (let tick = 0; tick <= 4; tick += 1) {
      const ratio = tick / 4;
      const y = PLOT_TOP + ratio * plotHeight;
      const line = createSvgElement("line");
      line.setAttribute("x1", String(PLOT_LEFT));
      line.setAttribute("x2", String(PLOT_LEFT + plotWidth));
      line.setAttribute("y1", String(y));
      line.setAttribute("y2", String(y));
      group.append(line);
    }
  }

  #renderPointControls() {
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
  }

  #renderSummary(labels) {
    const fragment = document.createDocumentFragment();
    const caption = document.createElement("caption");
    caption.className = "sr-only";
    caption.textContent = `${this.#displayLabel() || "Area chart"} data table`;
    fragment.append(caption);

    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.append(createCell("th", "Metric", "col"));
    for (const label of labels) {
      headerRow.append(createCell("th", label, "col"));
    }
    head.append(headerRow);
    fragment.append(head);

    const body = document.createElement("tbody");
    for (const series of this.#series) {
      const row = document.createElement("tr");
      row.append(createCell("th", series.label, "row"));
      for (let index = 0; index < labels.length; index += 1) {
        const point = series.values[index];
        const text =
          point?.value === null || !point
            ? "No data"
            : this.#formatValue(point.value, { series, index, label: labels[index] });
        row.append(createCell("td", text));
      }
      body.append(row);
    }
    fragment.append(body);

    if (this.#referenceLines.length) {
      const refs = document.createElement("tbody");
      const span = Math.max(1, labels.length);
      for (const line of this.#referenceLines) {
        const row = document.createElement("tr");
        row.append(createCell("th", line.label || "Reference", "row"));
        const cell = document.createElement("td");
        cell.colSpan = span;
        cell.textContent = this.#formatValue(line.value, { label: line.label || "Reference" });
        row.append(cell);
        refs.append(row);
      }
      fragment.append(refs);
    }

    this.#summaryTable.replaceChildren(fragment);
  }

  #hoverText(event) {
    const reference = referenceLineHoverText(event);
    if (reference) return reference;
    const nearest = nearestPointByClientX(this.#plot, this.#entries, event.clientX);
    if (!nearest) return "";
    return `${nearest.series.label}, ${nearest.label}: ${nearest.formattedValue}`;
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
    } else if (event.key === "Home") {
      target = this.#entries.at(0);
    } else if (event.key === "End") {
      target = this.#entries.at(-1);
    }

    if (!target) return;
    event.preventDefault();
    this.#setActivePoint(target);
    this.#pointButtonFor(target.key)?.focus({ preventScroll: true });
  }

  #activatePoint(entry) {
    this.#setActivePoint(entry);
    emit(this, "rowan-point-activate", {
      seriesId: entry.series.id,
      seriesLabel: entry.series.label,
      index: entry.index,
      label: entry.label,
      value: entry.value,
      formattedValue: entry.formattedValue,
    });
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

  #areaPathData(entries, baselineY) {
    const segments = [];
    let current = [];

    for (const entry of entries) {
      if (current.length > 0 && entry.index !== current.at(-1).index + 1) {
        segments.push(current);
        current = [];
      }
      current.push(entry);
    }
    if (current.length) segments.push(current);

    return segments
      .map((segment) => {
        const line = segment
          .map((entry, index) => {
            const command = index === 0 ? "M" : "L";
            return `${command}${entry.x.toFixed(2)},${entry.y.toFixed(2)}`;
          })
          .join(" ");
        const first = segment[0];
        const last = segment.at(-1);
        return `${line} L${last.x.toFixed(2)},${baselineY.toFixed(2)} L${first.x.toFixed(2)},${baselineY.toFixed(2)} Z`;
      })
      .join(" ");
  }

  #pathData(entries) {
    let hasPreviousEntry = false;
    let previousIndex = -1;

    return entries
      .map((entry) => {
        const command = hasPreviousEntry && entry.index === previousIndex + 1 ? "L" : "M";
        hasPreviousEntry = true;
        previousIndex = entry.index;
        return `${command}${entry.x.toFixed(2)},${entry.y.toFixed(2)}`;
      })
      .join(" ");
  }

  #seriesColor(series, index) {
    return series.color || SERIES_COLORS[index % SERIES_COLORS.length];
  }

  #formatValue(value, context) {
    if (!this.#valueFormatter) return String(value);

    try {
      return String(this.#valueFormatter(value, context));
    } catch (_error) {
      return String(value);
    }
  }

  #displayLabel() {
    return this.#assignedSlotText(this.#labelSlot) || this.label;
  }

  #displayDescription() {
    return this.#assignedSlotText(this.#descriptionSlot) || this.description;
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
      this.internals.ariaLabel = this.hasAttribute("aria-labelledby")
        ? null
        : this.#displayLabel() || "Area chart";
    }

    if (!this.hasAttribute("aria-description") && "ariaDescription" in this.internals) {
      this.internals.ariaDescription = this.#displayDescription() || null;
    }
  }
}

define("rowan-area-chart", RowanAreaChart);
