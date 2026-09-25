import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import {
  createReferenceLine,
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  renderChartTable,
} from "../chart/dom.js";
import {
  bindChartHover,
  createChartHoverBubble,
  referenceLineHoverText,
  seriesHoverText,
} from "../chart/hover.js";
import {
  chartSeriesColor,
  cloneChartSeries,
  expandDomainWithReferenceLines,
  formatChartValue,
  normalizeReferenceLines,
  resolveChartLabels,
} from "../chart/model.js";
import { cloneComboSeriesInput, comboAxisDomain, normalizeComboSeries } from "./model.js";
import { createParetoData } from "./pareto.js";

export { createParetoData };

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 48;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;

let comboChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function yForValue(value, domain, plotHeight) {
  const range = domain.max - domain.min || 1;
  return PLOT_TOP + ((domain.max - value) / range) * plotHeight;
}

/**
 * Categorical combo chart: bars and lines on a shared category axis.
 * Optional `axis: "secondary"` for a second value scale (Pareto cumulative %).
 * @tag rowan-combo-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Chart series with optional geometry (bar|line) and axis (primary|secondary). Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Optional axis primary|secondary. Arrays are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart line
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-combo-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive mark.
 */
export class RowanComboChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./combo-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-combo-chart-"];
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
  #xAxis = null;
  #yAxisSecondary = null;
  #legend = null;
  #pointControls = null;
  #detail = null;
  #hover = null;
  #summaryTable = null;
  #seriesInput = [];
  #series = [];
  #labels = [];
  #valueFormatter = null;
  #referenceLinesInput = [];
  #referenceLines = [];
  #entries = [];
  #activePointKey = "";
  #labelId = "";
  #descriptionId = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      comboChartId += 1;
      this.id = `rowan-combo-chart-${comboChartId}`;
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
    return cloneChartSeries(this.#series);
  }

  set series(value) {
    this.#seriesInput = cloneComboSeriesInput(value);
    this.#series = normalizeComboSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  get labels() {
    return [...this.#labels];
  }

  set labels(value) {
    this.#labels = normalizeChartLabelsFromModel(value);
    this.#series = normalizeComboSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      referenceLines: this.referenceLines,
    };
  }

  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabelsFromModel(source.labels);
    this.#seriesInput = cloneComboSeriesInput(source.series);
    this.#series = normalizeComboSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.#referenceLinesInput = Array.isArray(source.referenceLines) ? source.referenceLines : [];
    this.#referenceLines = normalizeComboReferenceLines(this.#referenceLinesInput);
    this.reflectBoolean("interactive", Boolean(source.interactive));
    this.#activePointKey = "";
    this.requestRender();
  }

  get valueFormatter() {
    return this.#valueFormatter;
  }

  set valueFormatter(value) {
    this.#valueFormatter = typeof value === "function" ? value : null;
    this.requestRender();
  }

  get referenceLines() {
    return this.#referenceLines.map((line) => ({ ...line }));
  }

  set referenceLines(value) {
    this.#referenceLinesInput = Array.isArray(value) ? value : [];
    this.#referenceLines = normalizeComboReferenceLines(this.#referenceLinesInput);
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
              <div class="y-axis-secondary" aria-hidden="true"></div>
              <div class="point-controls"></div>
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
      this.#yAxisSecondary = this.renderRoot.querySelector(".y-axis-secondary");
      this.#legend = this.renderRoot.querySelector(".legend");
      this.#pointControls = this.renderRoot.querySelector(".point-controls");
      this.#detail = this.renderRoot.querySelector(".detail");
      this.#summaryTable = this.renderRoot.querySelector("table");
      this.#hover = createChartHoverBubble();
      this.renderRoot.querySelector(".chart").append(this.#hover);
      bindChartHover(this, {
        target: this.renderRoot.querySelector(".chart"),
        bubble: this.#hover,
        textForEvent: (event) =>
          referenceLineHoverText(event) || seriesHoverText(this.#entries, event),
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
    this.#plot.setAttribute("aria-label", label || "Combo chart");
  }

  #renderChart() {
    const labels = resolveChartLabels(this.#series, this.#labels);
    const primary = expandDomainWithReferenceLines(
      comboAxisDomain(this.#series, "primary"),
      this.#referenceLines.filter((line) => line.axis !== "secondary"),
    );
    const secondary = expandDomainWithReferenceLines(
      comboAxisDomain(this.#series, "secondary"),
      this.#referenceLines.filter((line) => line.axis === "secondary"),
    );
    this.#entries = this.#createEntries(labels, primary, secondary);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(primary, secondary);
    this.#renderAxis(labels);
    this.#renderSecondaryAxis(secondary);
    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || "Combo chart"} data table`,
      labels,
      series: this.#series,
      formatValue: (value, series, index, label) =>
        formatChartValue(this.#valueFormatter, value, { series, index, label }),
      referenceLines: this.#referenceLines,
    });
    this.#syncActivePoint();
  }

  #domainFor(series, primary, secondary) {
    return series.axis === "secondary" ? secondary : primary;
  }

  #createEntries(labels, primary, secondary) {
    const categoryCount = Math.max(labels.length, 1);
    const barSeries = this.#series.filter((series) => series.geometry === "bar");
    const plotWidth = SVG_NAMESPACE_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    const plotHeight = SVG_NAMESPACE_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const groupWidth = plotWidth / categoryCount;
    const barCount = Math.max(barSeries.length, 1);
    const barWidth = groupWidth / (barCount + 1);

    return this.#series.flatMap((series, seriesIndex) => {
      const domain = this.#domainFor(series, primary, secondary);
      const range = domain.max - domain.min || 1;
      const baseline = PLOT_TOP + ((domain.max - 0) / range) * plotHeight;
      const barIndex = barSeries.indexOf(series);

      return series.values.flatMap((point, index) => {
        if (point.value === null) return [];
        const groupX = PLOT_LEFT + index * groupWidth;
        const centerX = groupX + groupWidth / 2;
        const x =
          series.geometry === "bar"
            ? groupX + barWidth / 2 + Math.max(barIndex, 0) * barWidth
            : centerX;
        const y = yForValue(point.value, domain, plotHeight);
        const formattedValue = formatChartValue(this.#valueFormatter, point.value, {
          series,
          index,
          label: labels[index],
        });
        return [
          {
            key: `${series.id}::${index}`,
            series,
            seriesIndex,
            index,
            label: labels[index] || point.label,
            value: point.value,
            formattedValue,
            x,
            y,
            width: series.geometry === "bar" ? barWidth : 16,
            height: series.geometry === "bar" ? Math.abs(baseline - y) : 16,
            barY: series.geometry === "bar" ? Math.min(y, baseline) : y - 8,
            geometry: series.geometry,
          },
        ];
      });
    });
  }

  #renderPlot(primary, secondary) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || "Combo chart";
    fragment.append(title);

    const plotWidth = SVG_NAMESPACE_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    const plotHeight = SVG_NAMESPACE_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const primaryRange = primary.max - primary.min || 1;
    const baseline = PLOT_TOP + ((primary.max - 0) / primaryRange) * plotHeight;
    const axis = createSvgElement("line");
    axis.setAttribute("class", "zero-line");
    axis.setAttribute("x1", String(PLOT_LEFT));
    axis.setAttribute("x2", String(PLOT_LEFT + plotWidth));
    axis.setAttribute("y1", String(baseline));
    axis.setAttribute("y2", String(baseline));
    fragment.append(axis);

    for (const line of this.#referenceLines) {
      const domain = line.axis === "secondary" ? secondary : primary;
      const range = domain.max - domain.min || 1;
      const y = PLOT_TOP + ((domain.max - line.value) / range) * plotHeight;
      fragment.append(
        createReferenceLine({
          x1: PLOT_LEFT,
          x2: PLOT_LEFT + plotWidth,
          y,
          tone: line.tone,
          label: line.label,
          formattedValue: formatChartValue(this.#valueFormatter, line.value, {
            label: line.label || "Reference",
          }),
        }),
      );
    }

    for (const entry of this.#entries.filter((item) => item.geometry === "bar")) {
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

    for (const [seriesIndex, series] of this.#series.entries()) {
      if (series.geometry !== "line") continue;
      const domain = this.#domainFor(series, primary, secondary);
      const points = series.values
        .map((point, index) => {
          if (point.value === null) return null;
          const categoryCount = Math.max(resolveChartLabels(this.#series, this.#labels).length, 1);
          const groupWidth = plotWidth / categoryCount;
          const x = PLOT_LEFT + index * groupWidth + groupWidth / 2;
          const y = yForValue(point.value, domain, plotHeight);
          return `${x},${y}`;
        })
        .filter(Boolean);
      if (!points.length) continue;
      const path = createSvgElement("polyline");
      path.setAttribute("class", "line");
      path.setAttribute("part", "line");
      path.setAttribute("fill", "none");
      path.setAttribute("points", points.join(" "));
      path.style.stroke = chartSeriesColor(series, seriesIndex);
      fragment.append(path);
    }

    for (const entry of this.#entries.filter((item) => item.geometry === "line")) {
      const mark = createSvgElement("circle");
      mark.setAttribute("class", "line-point");
      mark.dataset.pointKey = entry.key;
      mark.setAttribute("cx", String(entry.x));
      mark.setAttribute("cy", String(entry.y));
      mark.setAttribute("r", "5");
      mark.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
      fragment.append(mark);
    }

    this.#plot.replaceChildren(fragment);
  }

  #renderAxis(labels) {
    this.#xAxis.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const label of labels) {
      const item = document.createElement("span");
      item.textContent = label;
      fragment.append(item);
    }
    this.#xAxis.append(fragment);
    this.#xAxis.style.setProperty("--category-count", String(Math.max(labels.length, 1)));
  }

  #renderSecondaryAxis(domain) {
    const hasSecondary = this.#series.some((series) => series.axis === "secondary");
    this.#yAxisSecondary.hidden = !hasSecondary;
    this.#yAxisSecondary.replaceChildren();
    if (!hasSecondary) return;

    const ticks = [domain.max, (domain.max + domain.min) / 2, domain.min];
    const fragment = document.createDocumentFragment();
    for (const tick of ticks) {
      const item = document.createElement("span");
      item.textContent = formatChartValue(this.#valueFormatter, tick, { tick: true });
      fragment.append(item);
    }
    this.#yAxisSecondary.append(fragment);
  }

  #renderLegend() {
    this.#legend.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const [seriesIndex, series] of this.#series.entries()) {
      const item = document.createElement("li");
      item.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = series.geometry === "line" ? "legend-swatch is-line" : "legend-swatch";
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
      button.style.setProperty("--point-x", `${(entry.x / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty(
        "--point-y",
        `${((entry.geometry === "bar" ? entry.barY : entry.y - 8) / SVG_NAMESPACE_HEIGHT) * 100}%`,
      );
      button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty("--point-height", `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`);
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
      this.internals.ariaLabel = this.#displayLabel() || "Combo chart";
    }
  }
}

function normalizeChartLabelsFromModel(value) {
  return Array.isArray(value) ? value.map((label) => String(label ?? "").trim()) : [];
}

function normalizeComboReferenceLines(value) {
  const source = Array.isArray(value) ? value : [];
  return normalizeReferenceLines(source).map((line, index) => ({
    ...line,
    axis: source[index]?.axis === "secondary" ? "secondary" : "primary",
  }));
}

define("rowan-combo-chart", RowanComboChart);
