import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
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
  donutSlices,
  formatChartValue,
  normalizeChartLabels,
  normalizeChartSeries,
  resolveChartLabels,
} from "../chart/model.js";

const VIEWBOX = 200;
const CX = 100;
const CY = 100;
const OUTER = 78;
const INNER = 46;

let donutChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function polar(radius, angle) {
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function slicePath(startAngle, endAngle) {
  const twoPi = Math.PI * 2;
  const span = endAngle - startAngle;
  if (span >= twoPi - 1e-6) {
    const [ox1, oy1] = polar(OUTER, -Math.PI / 2);
    const [ox2, oy2] = polar(OUTER, Math.PI / 2);
    const [ix1, iy1] = polar(INNER, Math.PI / 2);
    const [ix2, iy2] = polar(INNER, -Math.PI / 2);
    return `M${ox1},${oy1} A${OUTER},${OUTER} 0 1 1 ${ox2},${oy2} A${OUTER},${OUTER} 0 1 1 ${ox1},${oy1} M${ix2},${iy2} A${INNER},${INNER} 0 1 0 ${ix1},${iy1} A${INNER},${INNER} 0 1 0 ${ix2},${iy2} Z`;
  }

  const large = span > Math.PI ? 1 : 0;
  const [x1, y1] = polar(OUTER, startAngle);
  const [x2, y2] = polar(OUTER, endAngle);
  const [x3, y3] = polar(INNER, endAngle);
  const [x4, y4] = polar(INNER, startAngle);
  return `M${x1},${y1} A${OUTER},${OUTER} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${INNER},${INNER} 0 ${large} 0 ${x4},${y4} Z`;
}

/**
 * Frozen parts-of-a-whole chart. Uses the first series. Negative values
 * are treated as no-data, not slices.
 * @tag rowan-donut-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Slice labels. Arrays are property-only.
 * @property {import("../chart/model.js").RowanChartConfig} config
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart plot
 * @csspart slice
 * @csspart total
 * @csspart legend
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-donut-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive slice.
 */
export class RowanDonutChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./donut-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-donut-chart-"];
  static observedAttributes = ["label", "description", "interactive"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
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
  #total = null;
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
      donutChartId += 1;
      this.id = `rowan-donut-chart-${donutChartId}`;
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

  /** @returns {import("../chart/model.js").RowanChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  /** @param {import("../chart/model.js").RowanChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneChartSeriesInput(source.series);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
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
            <div class="plot-wrap">
              <svg class="plot" part="plot" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"></svg>
              <div class="total" part="total"></div>
              <div class="point-controls"></div>
            </div>
            <ul class="legend" part="legend" aria-label="Slices"></ul>
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
      this.#total = this.renderRoot.querySelector(".total");
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
    const assigned = this.#labelSlot
      .assignedNodes()
      .map((node) => node.textContent)
      .join("")
      .trim();
    return assigned || this.label;
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
    this.#plot.setAttribute("aria-label", label || "Donut chart");
  }

  #renderChart() {
    const series = this.#primarySeries();
    const labels = resolveChartLabels(this.#series.slice(0, 1), this.#labels);
    const slices = donutSlices(series);
    const total = slices.reduce((sum, slice) => sum + (slice.value ?? 0), 0);
    this.#entries = [];

    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || "Donut chart";
    fragment.append(title);

    let angle = -Math.PI / 2;
    slices.forEach((slice, colorIndex) => {
      if (slice.value === null || total <= 0) return;
      const sweep = (slice.value / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      const formattedValue = formatChartValue(this.#valueFormatter, slice.value, {
        series,
        index: slice.index,
        label: labels[slice.index],
      });
      const entry = {
        key: `${series.id}::${slice.index}`,
        series,
        seriesIndex: colorIndex,
        index: slice.index,
        label: labels[slice.index] || slice.label,
        value: slice.value,
        formattedValue,
      };
      this.#entries.push(entry);

      const path = createSvgElement("path");
      path.setAttribute("class", "slice");
      path.setAttribute("part", "slice");
      path.dataset.pointKey = entry.key;
      path.setAttribute("d", slicePath(start, end));
      path.style.fill = chartSeriesColor({ ...series, color: "" }, colorIndex);
      fragment.append(path);
    });

    this.#plot.replaceChildren(fragment);
    this.#total.textContent = total
      ? formatChartValue(this.#valueFormatter, total, { series, label: "Total" })
      : "No data";

    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || "Donut chart"} data table`,
      labels,
      series: series
        ? [
            {
              label: series.label,
              values: slices.map((slice) => ({ value: slice.value })),
            },
          ]
        : [],
      formatValue: (value, item, index, label) =>
        formatChartValue(this.#valueFormatter, value, { series, index, label }),
    });
    this.#syncActivePoint();
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
      button.type = "button";
      button.dataset.pointKey = entry.key;
      button.textContent = `${entry.label}, ${entry.formattedValue}`;
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
      this.internals.ariaLabel = this.#displayLabel() || "Donut chart";
    }
  }
}

define("rowan-donut-chart", RowanDonutChart);
