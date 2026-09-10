import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Determinate progress indicator.
 * @tag rowan-progress
 * @attr {number} value
 * @attr {number} max
 * @attr {string} label
 * @csspart progress
 * @csspart bar
 * @csspart meta
 */
export class RowanProgress extends BaseElement {
  static styleUrl = new URL("./progress.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "max", "label"];
  static upgradeProperties = ["value", "max", "label"];

  #track = null;
  #bar = null;
  #meta = null;

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
    const valueText = this.label ? `${this.label} ${percent}%` : `${percent}%`;

    this.#bar.style.width = `${percent}%`;
    this.#meta.textContent = valueText;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "progressbar";
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

    if (this.internals && !this.hasAttribute("aria-valuetext") && "ariaValueText" in this.internals) {
      this.internals.ariaValueText = valueText;
    }
  }
}

define("rowan-progress", RowanProgress);
