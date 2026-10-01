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
const VARIANTS = new Set(["donut", "pie"]);
const DEFAULT_MESSAGES = Object.freeze({
  chart: ({ variant }) => (variant === "pie" ? "Pie chart" : "Donut chart"),
  dataTable: "Data table",
  dataTableCaption: "{chart} data table",
  metric: "Metric",
  noData: "No data",
  point: "Point {index}",
  reference: "Reference",
  slices: "Slices",
  total: "Total",
});

let donutChartId = 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * @typedef {object} RowanDonutChartMessages
 * @property {string | ((context: { variant: "donut" | "pie" }) => string)} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [reference]
 * @property {string} [slices]
 * @property {string} [total]
 */

/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   variant?: "donut" | "pie",
 * }} RowanDonutChartConfig
 */

function polar(radius, angle) {
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function slicePath(startAngle, endAngle, inner = INNER, outer = OUTER) {
  const twoPi = Math.PI * 2;
  const span = endAngle - startAngle;
  if (span >= twoPi - 1e-6) {
    if (inner <= 0) {
      return `M${CX - outer},${CY} A${outer},${outer} 0 1 1 ${CX + outer},${CY} A${outer},${outer} 0 1 1 ${CX - outer},${CY} Z`;
    }
    const [ox1, oy1] = polar(outer, -Math.PI / 2);
    const [ox2, oy2] = polar(outer, Math.PI / 2);
    const [ix1, iy1] = polar(inner, Math.PI / 2);
    const [ix2, iy2] = polar(inner, -Math.PI / 2);
    return `M${ox1},${oy1} A${outer},${outer} 0 1 1 ${ox2},${oy2} A${outer},${outer} 0 1 1 ${ox1},${oy1} M${ix2},${iy2} A${inner},${inner} 0 1 0 ${ix1},${iy1} A${inner},${inner} 0 1 0 ${ix2},${iy2} Z`;
  }

  const large = span > Math.PI ? 1 : 0;
  const [x1, y1] = polar(outer, startAngle);
  const [x2, y2] = polar(outer, endAngle);
  if (inner <= 0) {
    return `M${x1},${y1} A${outer},${outer} 0 ${large} 1 ${x2},${y2} L${CX},${CY} Z`;
  }
  const [x3, y3] = polar(inner, endAngle);
  const [x4, y4] = polar(inner, startAngle);
  return `M${x1},${y1} A${outer},${outer} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`;
}

/**
 * Frozen parts-of-a-whole chart. Uses the first series. Negative values
 * are treated as no-data, not slices.
 * @tag rowan-donut-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"donut"|"pie"} variant - `pie` fills the hole. Default `donut`. Total stays in the matching table.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Slice labels. Arrays are property-only.
 * @property {RowanDonutChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to donut.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @property {RowanDonutChartMessages} messages - Property-only built-in message overrides.
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
  static observedAttributes = ["label", "description", "interactive", "variant", "locale"];
  static upgradeProperties = [
    "label",
    "description",
    "interactive",
    "variant",
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
  #total = null;
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

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanDonutChartMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanDonutChartMessages | null | undefined} value */
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

  /** @returns {"donut" | "pie"} */
  get variant() {
    return normalizeEnum(this.readString("variant", "donut"), VARIANTS, "donut");
  }

  /** @param {"donut" | "pie"} value */
  set variant(value) {
    reflectEnum(this, "variant", value, VARIANTS, "donut");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "variant" && rewriteEnumAttribute(this, name, newValue, VARIANTS, "donut")) {
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

  /** @returns {RowanDonutChartConfig} */
  get config() {
    return {
      series: this.series,
      labels: this.labels,
      interactive: this.interactive,
      valueFormatter: this.valueFormatter,
      variant: this.variant,
    };
  }

  /** @param {RowanDonutChartConfig | null | undefined} value */
  set config(value) {
    const source = isObject(value) ? value : {};
    this.#labels = normalizeChartLabels(source.labels);
    this.#seriesInput = cloneChartSeriesInput(source.series);
    this.#series = normalizeChartSeries(this.#seriesInput, this.#labels);
    this.#valueFormatter =
      typeof source.valueFormatter === "function" ? source.valueFormatter : null;
    this.reflectBoolean("interactive", Boolean(source.interactive));
    reflectEnum(this, "variant", source.variant, VARIANTS, "donut");
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
      this.#total = this.renderRoot.querySelector(".total");
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
    this.#plot.setAttribute("aria-label", label || this.#chartName());
  }

  #chartName() {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "chart", { variant: this.variant });
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

  #renderChart() {
    const series = this.#primarySeries();
    const labels = resolveChartLabels(this.#series.slice(0, 1), this.#labels, (index) =>
      this.#pointLabel(index),
    );
    const slices = donutSlices(series);
    const total = slices.reduce((sum, slice) => sum + (slice.value ?? 0), 0);
    this.#entries = [];

    const fragment = document.createDocumentFragment();
    const title = createSvgElement("title");
    title.textContent = this.#displayLabel() || this.#chartName();
    fragment.append(title);

    const inner = this.variant === "pie" ? 0 : INNER;
    let angle = -Math.PI / 2;
    slices.forEach((slice, colorIndex) => {
      if (slice.value === null || total <= 0) return;
      const sweep = (slice.value / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      const formattedValue = this.#formatValue(slice.value, {
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
      path.setAttribute("d", slicePath(start, end, inner, OUTER));
      path.style.fill = chartSeriesColor({ ...series, color: "" }, colorIndex);
      fragment.append(path);
    });

    this.#plot.replaceChildren(fragment);
    const isPie = this.variant === "pie";
    this.#total.hidden = isPie;
    this.#total.textContent = isPie
      ? ""
      : total
        ? this.#formatValue(total, {
            series,
            label: resolveMessage(this.#messages, DEFAULT_MESSAGES, "total"),
          })
        : resolveMessage(this.#messages, DEFAULT_MESSAGES, "noData");

    this.#renderLegend();
    this.#renderPointControls();
    renderChartTable(this.#summaryTable, {
      caption: resolveMessage(this.#messages, DEFAULT_MESSAGES, "dataTableCaption", {
        chart: this.#displayLabel() || this.#chartName(),
      }),
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
        this.#formatValue(value, { series, index, label }),
      messages: this.#messages,
    });
    this.#syncActivePoint();
  }

  #renderLegend() {
    this.#legend.replaceChildren();
    this.#legend.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "slices"),
    );
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
    withRestoredPointFocus(this.#pointControls, this.#activePointKey, () => {
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

define("rowan-donut-chart", RowanDonutChart);
