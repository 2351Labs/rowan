import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import {
  createSvgElement,
  emitPointActivate,
  pointControlFor,
  renderMatrixChartTable,
} from "../chart/dom.js";
import { bindChartHover, createChartHoverBubble, seriesHoverText } from "../chart/hover.js";
import { formatChartValue } from "../chart/model.js";
import { cloneHeatmap, cloneHeatmapInput, heatmapValueDomain, normalizeHeatmap } from "./model.js";

const SVG_NAMESPACE_WIDTH = 1000;
const SVG_NAMESPACE_HEIGHT = 400;
const PLOT_LEFT = 48;
const PLOT_RIGHT = 18;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 28;
const CELL_GAP = 2;

let heatmapChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function cellOpacity(value, domain) {
  const range = domain.max - domain.min;
  if (range === 0) return 1;
  return 0.12 + ((value - domain.min) / range) * 0.88;
}

/**
 * Experimental categorical heatmap. Single-hue intensity via fill-opacity.
 * Null is empty / no-data. Accepts a matrix or `{ x, y, value }` points.
 * @tag rowan-heatmap-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {string[]} rows - Row labels. Arrays are property-only.
 * @property {string[]} columns - Column labels. Arrays are property-only.
 * @property {Array<Array<number | null>>} values - Matrix of cell values. Arrays are property-only.
 * @property {Array<object>} points - Optional `{ x, y, value }` or `{ column, row, value }` triples. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart cell
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-heatmap-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive cell.
 */
export class RowanHeatmapChart extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./heatmap-chart.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-heatmap-chart-"];
  static observedAttributes = ["label", "description", "interactive"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "rows",
    "columns",
    "values",
    "points",
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
  #pointControls = null;
  #detail = null;
  #hover = null;
  #summaryTable = null;
  #input = cloneHeatmapInput();
  #heatmap = normalizeHeatmap();
  #valueFormatter = null;
  #entries = [];
  #activePointKey = "";
  #labelId = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      heatmapChartId += 1;
      this.id = `rowan-heatmap-chart-${heatmapChartId}`;
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

  get rows() {
    return [...this.#heatmap.rows];
  }

  set rows(value) {
    this.#applyHeatmap({ ...this.#input, rows: value, points: [] });
  }

  get columns() {
    return [...this.#heatmap.columns];
  }

  set columns(value) {
    this.#applyHeatmap({ ...this.#input, columns: value, points: [] });
  }

  get values() {
    return cloneHeatmap(this.#heatmap).values;
  }

  set values(value) {
    this.#applyHeatmap({ ...this.#input, values: value, points: [] });
  }

  get points() {
    return this.#heatmap.rows.flatMap((row, rowIndex) =>
      this.#heatmap.columns.map((column, columnIndex) => ({
        x: column,
        y: row,
        value: this.#heatmap.values[rowIndex]?.[columnIndex] ?? null,
      })),
    );
  }

  set points(value) {
    this.#applyHeatmap({ ...this.#input, points: value, values: [] });
  }

  get config() {
    return {
      rows: this.rows,
      columns: this.columns,
      values: this.values,
      points: this.points,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
    };
  }

  set config(value) {
    const source = isObject(value) ? value : {};
    this.#applyHeatmap(source);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
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
            </div>
            <div class="x-axis" aria-hidden="true"></div>
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

  #applyHeatmap(input) {
    this.#input = cloneHeatmapInput(input);
    this.#heatmap = normalizeHeatmap(this.#input);
    this.#activePointKey = "";
    this.requestRender();
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
    this.#plot.setAttribute("aria-label", label || "Heatmap chart");
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
    const plot = this.#plotBox();
    const domain = heatmapValueDomain(this.#heatmap.values);
    this.#entries = this.#createEntries(plot, domain);
    if (!this.#entries.some((entry) => entry.key === this.#activePointKey)) {
      this.#activePointKey = "";
    }
    this.#renderPlot(plot);
    this.#renderAxes();
    this.#renderPointControls();
    renderMatrixChartTable(this.#summaryTable, {
      caption: `${this.#displayLabel() || "Heatmap chart"} data table`,
      rows: this.#heatmap.rows,
      columns: this.#heatmap.columns,
      values: this.#heatmap.values,
      formatValue: (value, rowIndex, columnIndex) =>
        formatChartValue(this.#valueFormatter, value, {
          label: this.#heatmap.columns[columnIndex],
          index: rowIndex,
        }),
    });
    this.#syncActivePoint();
  }

  #createEntries(plot, domain) {
    const { rows, columns, values } = this.#heatmap;
    const columnCount = Math.max(columns.length, 1);
    const rowCount = Math.max(rows.length, 1);
    const cellWidth = plot.width / columnCount;
    const cellHeight = plot.height / rowCount;
    const entries = [];

    rows.forEach((row, rowIndex) => {
      columns.forEach((column, columnIndex) => {
        const value = values[rowIndex]?.[columnIndex];
        if (value === null || value === undefined) return;
        const x = plot.left + columnIndex * cellWidth + CELL_GAP / 2;
        const y = plot.top + rowIndex * cellHeight + CELL_GAP / 2;
        const formattedValue = formatChartValue(this.#valueFormatter, value, {
          label: column,
          index: rowIndex,
        });
        entries.push({
          key: `${rowIndex}::${columnIndex}`,
          series: { id: "heatmap", label: row },
          index: rowIndex * columns.length + columnIndex,
          label: column,
          value,
          formattedValue,
          row,
          column,
          rowIndex,
          columnIndex,
          opacity: cellOpacity(value, domain),
          plotX: x,
          plotY: y,
          width: Math.max(cellWidth - CELL_GAP, 1),
          height: Math.max(cellHeight - CELL_GAP, 1),
        });
      });
    });
    return entries;
  }

  #renderPlot(plot) {
    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || "Heatmap chart";
    fragment.append(title);

    const axis = createSvgElement("rect");
    axis.setAttribute("class", "plot-frame");
    axis.setAttribute("x", String(plot.left));
    axis.setAttribute("y", String(plot.top));
    axis.setAttribute("width", String(plot.width));
    axis.setAttribute("height", String(plot.height));
    fragment.append(axis);

    for (const entry of this.#entries) {
      const cell = createSvgElement("rect");
      cell.setAttribute("class", "cell");
      cell.setAttribute("part", "cell");
      cell.dataset.pointKey = entry.key;
      cell.setAttribute("x", String(entry.plotX));
      cell.setAttribute("y", String(entry.plotY));
      cell.setAttribute("width", String(entry.width));
      cell.setAttribute("height", String(entry.height));
      cell.setAttribute("fill-opacity", String(entry.opacity));
      fragment.append(cell);
    }
    this.#plot.replaceChildren(fragment);
  }

  #renderAxes() {
    this.#yAxis.replaceChildren();
    this.#yAxis.style.setProperty("--row-count", String(Math.max(this.#heatmap.rows.length, 1)));
    for (const row of this.#heatmap.rows) {
      const item = document.createElement("span");
      item.textContent = row;
      item.title = row;
      this.#yAxis.append(item);
    }
    this.#xAxis.replaceChildren();
    this.#xAxis.style.setProperty(
      "--column-count",
      String(Math.max(this.#heatmap.columns.length, 1)),
    );
    for (const column of this.#heatmap.columns) {
      const item = document.createElement("span");
      item.textContent = column;
      item.title = column;
      this.#xAxis.append(item);
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
      button.type = "button";
      button.dataset.pointKey = entry.key;
      button.style.setProperty("--point-x", `${(entry.plotX / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty("--point-y", `${(entry.plotY / SVG_NAMESPACE_HEIGHT) * 100}%`);
      button.style.setProperty("--point-width", `${(entry.width / SVG_NAMESPACE_WIDTH) * 100}%`);
      button.style.setProperty("--point-height", `${(entry.height / SVG_NAMESPACE_HEIGHT) * 100}%`);
      button.setAttribute("aria-label", `${entry.row}, ${entry.column}, ${entry.formattedValue}`);
      fragment.append(button);
    }
    this.#pointControls.append(fragment);
  }

  #syncActivePoint() {
    const entry = this.#entries.find((item) => item.key === this.#activePointKey) ?? null;
    this.#detail.hidden = !entry;
    this.#detail.textContent = entry
      ? `${entry.row}, ${entry.column}: ${entry.formattedValue}`
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
      this.internals.ariaLabel = this.#displayLabel() || "Heatmap chart";
    }
  }
}

define("rowan-heatmap-chart", RowanHeatmapChart);
