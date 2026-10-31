import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  readTooltipFormatter,
  writeTooltipFormatter,
} from "../chart/hover.js";
import { readHiddenSeries, writeHiddenSeries } from "../chart/api.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const DEFAULT_MESSAGES = Object.freeze({
  deltaWithLabel: "{value} {label}",
  kpi: "KPI",
  noData: "No data",
});

function normalizeText(value) {
  return String(value ?? "").trim();
}

function hasAssignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

function isVisibleGauge(node) {
  return node.localName === "rowan-gauge-chart" && !node.hidden;
}

function formatMetric(value, locale) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) {
    return formatNumber(value, { fallback: String(value), locale });
  }
  return "";
}

function formatDelta(value, locale) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return formatNumber(value, {
    fallback: value === 0 ? "0" : value > 0 ? `+${value}` : String(value),
    locale,
    options: { signDisplay: "exceptZero" },
  });
}

/**
 * @typedef {object} RowanKpiCardMessages
 * @property {string | ((context: { label: string, value: string }) => string)} [deltaWithLabel]
 * @property {string} [kpi]
 * @property {string} [noData]
 */

/**
 * Frozen dashboard stat tile. Value and delta stay property-only.
 * Inline-size container: compact below 10rem, roomy from 22rem. A slotted
 * gauge sits immediately beside the metrics except below 10rem. Does not
 * change chart kind or reformat the value.
 * @tag rowan-kpi-card
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {string} delta-label
 * @attr {boolean} loading
 * @attr {string} locale
 * @property {number | string | null} value - Displayed metric. Property-only.
 * @property {number | null} delta - Signed change. Property-only. Null hides the delta.
 * @property {RowanKpiCardMessages} messages - Property-only built-in message overrides.
 * @slot icon - Optional leading icon
 * @slot - Description or extra copy
 * @slot chart - Optional compact chart
 * @csspart card
 * @csspart icon
 * @csspart body
 * @csspart label
 * @csspart value
 * @csspart delta
 * @csspart description
 * @csspart chart
 * @cssprop --rowan-kpi-card-bg
 * @cssprop --rowan-kpi-card-border
 * @cssprop --rowan-kpi-card-fg
 * @cssprop --rowan-kpi-card-min-inline-size
 * @cssprop --rowan-kpi-card-padding
 * @cssprop --rowan-kpi-card-gap
 * @cssprop --rowan-kpi-card-value-size
 * @cssprop --rowan-kpi-card-chart-height
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - Ids hidden from the plot. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 */
export class RowanKpiCard extends BaseElement {
  static styleUrl = new URL("./kpi-card.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "tone", "delta-label", "loading", "locale", "hidden-series", "no-motion"];
  static upgradeProperties = [
    "label",
    "tone",
    "deltaLabel",
    "loading",
    "locale",
    "value",
    "delta",
    "messages",
    "hiddenSeries",
    "tooltipFormatter",
    "noMotion",
  ];
  static componentTokenPrefixes = ["--rowan-kpi-card-"];

  #card = null;
  #labelElement = null;
  #valueElement = null;
  #deltaElement = null;
  #descriptionSlot = null;
  #iconSlot = null;
  #chartSlot = null;
  #icon = null;
  #description = null;
  #chart = null;
  #gaugeObserver = null;
  #value = null;
  #delta = null;
  #messages = {};

  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone() {
    return normalizeEnum(this.readString("tone", "neutral"), TONES, "neutral");
  }

  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    reflectEnum(this, "tone", value, TONES, "neutral");
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get deltaLabel() {
    return this.readString("delta-label", "");
  }

  set deltaLabel(value) {
    this.reflectString("delta-label", normalizeText(value) || null);
  }

  get loading() {
    return this.readBoolean("loading");
  }

  set loading(value) {
    this.reflectBoolean("loading", Boolean(value));
  }

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanKpiCardMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanKpiCardMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  /** @returns {number | string | null} */
  get value() {
    return this.#value;
  }

  /** @param {number | string | null} value */
  set value(value) {
    if (value === null || value === undefined || value === "") {
      this.#value = null;
    } else if (typeof value === "number") {
      this.#value = Number.isFinite(value) ? value : null;
    } else {
      const text = normalizeText(value);
      this.#value = text || null;
    }

    this.requestRender();
  }

  /** @returns {number | null} */
  get delta() {
    return this.#delta;
  }

  /** @param {number | null} value */
  set delta(value) {
    if (value === null || value === undefined || value === "") {
      this.#delta = null;
    } else {
      const numeric = typeof value === "number" ? value : Number(value);
      this.#delta = Number.isFinite(numeric) ? numeric : null;
    }

    this.requestRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "tone" && rewriteEnumAttribute(this, name, newValue, TONES, "neutral")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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
    if (!this.#card) {
      this.renderRoot.innerHTML = `
        <article class="card" part="card">
          <div class="icon" part="icon"><slot name="icon"></slot></div>
          <div class="body" part="body">
            <div class="metrics">
              <p class="label" part="label"></p>
              <p class="value" part="value" aria-live="polite"></p>
              <p class="delta" part="delta"></p>
              <div class="description" part="description"><slot></slot></div>
            </div>
            <div class="chart" part="chart"><slot name="chart"></slot></div>
            <slot name="tooltip" hidden></slot>
          </div>
        </article>
      `;

      this.#card = this.renderRoot.querySelector(".card");
      this.#card.tabIndex = 0;
      this.#labelElement = this.renderRoot.querySelector(".label");
      this.#valueElement = this.renderRoot.querySelector(".value");
      this.#deltaElement = this.renderRoot.querySelector(".delta");
      this.#icon = this.renderRoot.querySelector(".icon");
      this.#description = this.renderRoot.querySelector(".description");
      this.#chart = this.renderRoot.querySelector(".chart");
      this.#iconSlot = this.renderRoot.querySelector('slot[name="icon"]');
      this.#descriptionSlot = this.renderRoot.querySelector(".description slot");
      this.#chartSlot = this.renderRoot.querySelector('slot[name="chart"]');

      this.listen(this.#iconSlot, "slotchange", () => this.requestRender());
      this.listen(this.#descriptionSlot, "slotchange", () => this.requestRender());
      this.listen(this.#chartSlot, "slotchange", () => this.requestRender());
    }

    const label = this.label;
    this.#labelElement.textContent = label;
    this.#icon.hidden = !hasAssignedContent(this.#iconSlot);
    this.#card.toggleAttribute("data-has-icon", !this.#icon.hidden);
    this.#description.hidden = !hasAssignedContent(this.#descriptionSlot);
    this.#chart.hidden = !hasAssignedContent(this.#chartSlot);
    this.#card.toggleAttribute(
      "data-has-gauge",
      this.#chartSlot.assignedElements().some(isVisibleGauge),
    );
    this.#observeGauges();

    const deltaText = formatDelta(this.#delta, this.locale);
    const deltaLabel = this.deltaLabel;
    this.#deltaElement.hidden = !deltaText;
    this.#deltaElement.textContent = deltaText
      ? deltaLabel
        ? resolveMessage(this.#messages, DEFAULT_MESSAGES, "deltaWithLabel", {
            label: deltaLabel,
            value: deltaText,
          })
        : deltaText
      : "";

    if (this.loading) {
      this.#valueElement.replaceChildren();
      const skeleton = document.createElement("span");
      skeleton.className = "skeleton";
      skeleton.setAttribute("aria-hidden", "true");
      this.#valueElement.append(skeleton);
    } else {
      this.#valueElement.textContent =
        formatMetric(this.#value, this.locale) ||
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "noData");
    }

    this.#applyDefaultA11y(label);
  }

  #observeGauges() {
    if (!this.#gaugeObserver && typeof MutationObserver !== "undefined") {
      this.#gaugeObserver = new MutationObserver(() => this.requestRender());
      this.observe(this.#gaugeObserver, () => this.#observeGauges());
    }

    this.#gaugeObserver?.disconnect();
    if (!this.#chartSlot) return;

    for (const node of this.#chartSlot.assignedElements()) {
      if (node.localName !== "rowan-gauge-chart") continue;
      this.#gaugeObserver?.observe(node, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }
  }

  #applyDefaultA11y(label) {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = label || resolveMessage(this.#messages, DEFAULT_MESSAGES, "kpi");
    }

    if ("ariaBusy" in this.internals) {
      this.internals.ariaBusy = this.loading ? "true" : "false";
    }
  }
}

define("rowan-kpi-card", RowanKpiCard);
