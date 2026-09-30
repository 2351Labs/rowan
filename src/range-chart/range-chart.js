import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  renderKeyedChartTable,
} from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, seriesHoverText } from "../chart/hover.js";
import {
  areaBandPath,
  categoricalBarRect,
  categoricalPointX,
  categoricalValueY,
  chartSeriesColor,
  formatChartValue,
  normalizeChartLabels,
} from "../chart/model.js";
import {
  cloneRangeSeries,
  cloneRangeSeriesInput,
  normalizeRangeSeries,
  rangeDomain,
  rangePointIncluded,
} from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const VARIANTS = new Set(["bar", "area"]);

let rangeChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {{
 *   labels?: string[],
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   variant?: "bar" | "area",
 *   valueFormatter?: Function | null,
 * }} RowanRangeChartConfig
 */

/**
 * Experimental categorical range. Per-category `{ low, high }`. `variant` is
 * `bar` (default) or `area`. Null low or high is no-data. Own series model —
 * not frozen categorical `series.values`.
 * @tag rowan-range-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"bar"|"area"} variant - Default `bar`.
 * @property {Array<object>} series - Series of `{ id, label, color?, values: [{ low, high }] }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanRangeChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to bar.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart area
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-range-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive range. Detail includes `low` and `high`.
 */
export class RowanRangeChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./range-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-range-chart-"];
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
  #entries = [];
  #activePointKey = "";
  #labelId = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      rangeChartId += 1;
      this.id = `rowan-range-chart-${rangeChartId}`;
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

  /** @returns {"bar" | "area"} */
  get variant() {
    return normalizeEnum(this.readString("variant", "bar"), VARIANTS, "bar");
  }

  /** @param {"bar" | "area"} value */
  set variant(value) {
    reflectEnum(this, "variant", value, VARIANTS, "bar");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "variant" && rewriteEnumAttribute(this, name, newValue, VARIANTS, "bar")) {
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** @returns {Array<object>} */
  get series() {
    return cloneRangeSeries(this.#series);
  }

  /** @param {Array<object>} value */
  set series(value) {
    this.#seriesInput = cloneRangeSeriesInput(value);
    this.#series = normalizeRangeSeries(this.#seriesInput, this.#labels);
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
    this.#series = normalizeRangeSeries(this.#seriesInput, this.#labels);
    this.#activePointKey = "";
    this.requestRender();
  }

  /** @returns {RowanRangeChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      variant: this.variant,
    };
  }

  /** @param {RowanRangeChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneRangeSeriesInput(source.series);
    this.#series = normalizeRangeSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    reflectEnum(this, "variant", source.variant, VARIANTS, "bar");
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
              <div class="x-axis" aria-hidden="true"></div>
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

  #chartName() {
    return "Range chart";
  }

  #categoryLabels() {
    const length = Math.max(
      this.#labels.length,
      ...this.#series.map((series) => series.values.length),
      1,
    );
    return Array.from(
      { length },
      (_, index) =>
        this.#labels[index] || this.#series[0]?.values[index]?.label || `Point ${index + 1}`,
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
    const low = formatChartValue(this.#valueFormatter, point.low, context);
    const high = formatChartValue(this.#valueFormatter, point.high, context);
    return `low=${low}, high=${high}`;
  }

  #renderChart() {
    const labels = this.#categoryLabels();
    const domain = rangeDomain(this.#series);
    const plot = this.#plotBox();
    this.#entries = this.#createEntries(labels, domain, plot);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(plot);
    this.#renderAxes(labels, domain);
    this.#renderLegend();
    this.#renderPointControls();
    renderKeyedChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || this.#chartName()} data table`,
      columns: [
        { key: "series", header: "Series" },
        { key: "label", header: "Category" },
        { key: "low", header: "Low" },
        { key: "high", header: "High" },
      ],
      rows: this.#series.flatMap((series) =>
        labels.map((label, index) => {
          const point = series.values[index];
          const included = point && rangePointIncluded(point);
          return {
            series: series.label,
            label,
            low: included
              ? formatChartValue(this.#valueFormatter, point.low, { series, index, label })
              : null,
            high: included
              ? formatChartValue(this.#valueFormatter, point.high, { series, index, label })
              : null,
          };
        }),
      ),
    });
    this.#syncActivePoint();
  }

  #createEntries(labels, domain, plot) {
    const variant = this.variant;
    const categoryCount = Math.max(labels.length, 1);
    const seriesCount = Math.max(this.#series.length, 1);
    const groupSize = plot.width / categoryCount;
    const barThickness = groupSize / (seriesCount + 1);
    const entries = [];

    this.#series.forEach((series, seriesIndex) => {
      labels.forEach((label, index) => {
        const point = series.values[index];
        if (!point || !rangePointIncluded(point)) return;
        const formattedValue = this.#formatPoint(point, series, index, label);
        const groupStart = plot.left + index * groupSize;
        const rect = categoricalBarRect({
          orientation: "vertical",
          from: point.low,
          to: point.high,
          domain,
          groupStart,
          offset: barThickness / 2 + seriesIndex * barThickness,
          thickness: barThickness,
          plot,
        });
        const plotX =
          variant === "area" ? categoricalPointX(index, categoryCount, plot) : rect.x;
        const plotY =
          variant === "area" ? categoricalValueY(Math.max(point.low, point.high), domain, plot) : rect.y;
        entries.push({
          key: `${series.id}::${index}`,
          series,
          seriesIndex,
          index,
          label,
          value: point.high,
          formattedValue,
          low: point.low,
          high: point.high,
          plotX,
          plotY,
          width: variant === "area" ? 12 : rect.width,
          height: variant === "area" ? 12 : Math.max(rect.height, 1),
          barY: rect.y,
          detail: { low: point.low, high: point.high },
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

    if (this.variant === "area") {
      const labels = this.#categoryLabels();
      const domain = rangeDomain(this.#series);
      this.#series.forEach((series, seriesIndex) => {
        const points = labels.flatMap((label, index) => {
          const point = series.values[index];
          if (!point || !rangePointIncluded(point)) return [];
          return [
            {
              index,
              x: categoricalPointX(index, Math.max(labels.length, 1), plot),
              yTop: categoricalValueY(Math.max(point.low, point.high), domain, plot),
              yBottom: categoricalValueY(Math.min(point.low, point.high), domain, plot),
            },
          ];
        });
        const d = areaBandPath(points);
        if (!d) return;
        const band = createSvgElement("path");
        band.setAttribute("class", "series-area");
        band.setAttribute("part", "area");
        band.setAttribute("d", d);
        band.style.fill = chartSeriesColor(series, seriesIndex);
        fragment.append(band);
      });
      for (const entry of this.#entries) {
        const mark = createSvgElement("circle");
        mark.setAttribute("class", "point");
        mark.setAttribute("part", "point");
        mark.dataset.pointKey = entry.key;
        mark.setAttribute("cx", String(entry.plotX));
        mark.setAttribute("cy", String(entry.plotY));
        mark.setAttribute("r", "5");
        mark.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
        fragment.append(mark);
      }
    } else {
      for (const entry of this.#entries) {
        const bar = createSvgElement("rect");
        bar.setAttribute("class", "bar");
        bar.setAttribute("part", "bar");
        bar.dataset.pointKey = entry.key;
        bar.setAttribute("x", String(entry.plotX));
        bar.setAttribute("y", String(entry.barY));
        bar.setAttribute("width", String(Math.max(entry.width, 1)));
        bar.setAttribute("height", String(entry.height));
        bar.style.fill = chartSeriesColor(entry.series, entry.seriesIndex);
        fragment.append(bar);
      }
    }
    this.#plot.replaceChildren(fragment);
  }

  #renderAxes(labels, domain) {
    const ticks = [domain.max, (domain.max + domain.min) / 2, domain.min];
    this.#yAxis.replaceChildren();
    for (const tick of ticks) {
      const item = document.createElement("span");
      item.textContent = formatChartValue(this.#valueFormatter, tick, { tick: true });
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
    const area = this.variant === "area";
    for (const entry of this.#entries) {
      const button = document.createElement("button");
      button.className = "point-button";
      button.type = "button";
      button.dataset.pointKey = entry.key;
      if (area) {
        button.classList.add("point-button-mark");
        button.style.setProperty("--point-x", `${(entry.plotX / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty("--point-y", `${(entry.plotY / SVG_NAMESPACE_HEIGHT) * 100}%`);
      } else {
        button.style.setProperty("--point-x", `${(entry.plotX / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty("--point-y", `${(entry.barY / SVG_NAMESPACE_HEIGHT) * 100}%`);
        button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
        button.style.setProperty("--point-height", `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`);
      }
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
      this.internals.ariaLabel = this.#displayLabel() || this.#chartName();
    }
  }
}

define("rowan-range-chart", RowanRangeChart);
