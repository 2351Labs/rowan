import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Inline loading indicator.
 * @tag rowan-spinner
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} label
 * @csspart spinner
 */
export class RowanSpinner extends BaseElement {
  static styleUrl = new URL("./spinner.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["size", "label"];
  static upgradeProperties = ["size", "label"];

  #label = null;

  get size() {
    return this.readString("size", "md");
  }

  set size(value) {
    this.reflectString("size", value === "md" ? null : value);
  }

  get label() {
    return this.readString("label", "Loading");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  render() {
    if (!this.#label) {
      this.renderRoot.innerHTML = `
        <span class="spinner" part="spinner" aria-hidden="true"></span>
        <span class="sr-only"></span>
      `;

      this.#label = this.renderRoot.querySelector(".sr-only");
    }

    this.#applyDefaultA11y();
    this.#label.textContent = this.label || "Loading";
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "status";
    }

    if (!this.hasAttribute("aria-live") && "ariaLive" in this.internals) {
      this.internals.ariaLive = "polite";
    }
  }
}

define("rowan-spinner", RowanSpinner);
