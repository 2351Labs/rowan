import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);

function normalizeText(value) {
  return String(value ?? "").trim();
}

function hasAssignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

function formatMetric(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function formatDelta(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : String(value);
}

/**
 * Experimental dashboard stat tile. Value and delta stay property-only.
 * @tag rowan-kpi-card
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {string} delta-label
 * @attr {boolean} loading
 * @property {number | string | null} value - Displayed metric. Property-only.
 * @property {number | null} delta - Signed change. Property-only. Null hides the delta.
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
 */
export class RowanKpiCard extends BaseElement {
  static styleUrl = new URL("./kpi-card.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "tone", "delta-label", "loading"];
  static upgradeProperties = ["label", "tone", "deltaLabel", "loading", "value", "delta"];
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
  #value = null;
  #delta = null;

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

  render() {
    if (!this.#card) {
      this.renderRoot.innerHTML = `
        <article class="card" part="card">
          <div class="icon" part="icon"><slot name="icon"></slot></div>
          <div class="body" part="body">
            <p class="label" part="label"></p>
            <p class="value" part="value"></p>
            <p class="delta" part="delta"></p>
            <div class="description" part="description"><slot></slot></div>
            <div class="chart" part="chart"><slot name="chart"></slot></div>
          </div>
        </article>
      `;

      this.#card = this.renderRoot.querySelector(".card");
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
    this.#description.hidden = !hasAssignedContent(this.#descriptionSlot);
    this.#chart.hidden = !hasAssignedContent(this.#chartSlot);

    const deltaText = formatDelta(this.#delta);
    const deltaLabel = this.deltaLabel;
    this.#deltaElement.hidden = !deltaText;
    this.#deltaElement.textContent = deltaText
      ? deltaLabel
        ? `${deltaText} ${deltaLabel}`
        : deltaText
      : "";

    if (this.loading) {
      this.#valueElement.replaceChildren();
      const skeleton = document.createElement("span");
      skeleton.className = "skeleton";
      skeleton.setAttribute("aria-hidden", "true");
      this.#valueElement.append(skeleton);
    } else {
      this.#valueElement.textContent = formatMetric(this.#value) || "No data";
    }

    this.#applyDefaultA11y(label);
  }

  #applyDefaultA11y(label) {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = label || "KPI";
    }

    if ("ariaBusy" in this.internals) {
      this.internals.ariaBusy = this.loading ? "true" : "false";
    }
  }
}

define("rowan-kpi-card", RowanKpiCard);
