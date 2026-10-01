import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const DEFAULT_MESSAGES = Object.freeze({
  labeledValueText: "{label} {value}%",
  progress: "Progress",
  valueText: "{value}%",
});

/**
 * @typedef {object} RowanProgressMessages
 * @property {string | ((context: { label: string, value: string }) => string)} [labeledValueText]
 * @property {string} [progress]
 * @property {string | ((context: { value: string }) => string)} [valueText]
 */

/**
 * Determinate progress indicator.
 * @tag rowan-progress
 * @attr {number} value
 * @attr {number} max
 * @attr {string} label
 * @attr {boolean} hide-meta
 * @attr {string} locale
 * @property {RowanProgressMessages} messages - Property-only built-in message overrides.
 * @csspart progress
 * @csspart bar
 * @csspart meta
 */
export class RowanProgress extends BaseElement {
  static styleUrl = new URL("./progress.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "max", "label", "hide-meta", "locale"];
  static upgradeProperties = ["value", "max", "label", "hideMeta", "locale", "messages"];

  #track = null;
  #bar = null;
  #meta = null;
  #messages = {};

  get value() {
    return this.readNumber("value", 0);
  }

  set value(value) {
    this.reflectNumber("value", value);
  }

  get max() {
    return this.readNumber("max", 100);
  }

  set max(value) {
    this.reflectNumber("max", value);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get hideMeta() {
    return this.readBoolean("hide-meta");
  }

  set hideMeta(value) {
    this.reflectBoolean("hide-meta", Boolean(value));
  }

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanProgressMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanProgressMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  render() {
    if (!this.#track) {
      this.renderRoot.innerHTML = `
        <div class="progress" part="progress">
          <div class="bar" part="bar"></div>
        </div>
        <span class="meta" part="meta"></span>
      `;

      this.#track = this.renderRoot.querySelector(".progress");
      this.#bar = this.renderRoot.querySelector(".bar");
      this.#meta = this.renderRoot.querySelector(".meta");
    }

    const max = this.max > 0 ? this.max : 100;
    const value = Math.max(0, Math.min(this.value, max));
    const percent = Math.round((value / max) * 100);
    const formattedPercent = formatNumber(percent, {
      fallback: String(percent),
      locale: this.locale,
    });
    const valueText = this.label
      ? resolveMessage(this.#messages, DEFAULT_MESSAGES, "labeledValueText", {
          label: this.label,
          value: formattedPercent,
        })
      : resolveMessage(this.#messages, DEFAULT_MESSAGES, "valueText", {
          value: formattedPercent,
        });

    this.#bar.style.width = `${percent}%`;
    this.#meta.textContent = valueText;
    this.#meta.hidden = this.hideMeta;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "progressbar";
    }

    if (
      this.internals &&
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      "ariaLabel" in this.internals
    ) {
      this.internals.ariaLabel =
        this.label.trim() || resolveMessage(this.#messages, DEFAULT_MESSAGES, "progress");
    }

    if (this.internals && !this.hasAttribute("aria-valuemin") && "ariaValueMin" in this.internals) {
      this.internals.ariaValueMin = "0";
    }

    if (this.internals && !this.hasAttribute("aria-valuemax") && "ariaValueMax" in this.internals) {
      this.internals.ariaValueMax = String(max);
    }

    if (this.internals && !this.hasAttribute("aria-valuenow") && "ariaValueNow" in this.internals) {
      this.internals.ariaValueNow = String(value);
    }

    if (
      this.internals &&
      !this.hasAttribute("aria-valuetext") &&
      "ariaValueText" in this.internals
    ) {
      this.internals.ariaValueText = valueText;
    }
  }
}

define("rowan-progress", RowanProgress);
