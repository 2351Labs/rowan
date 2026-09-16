import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

const SIZES = new Set(["sm", "md", "lg"]);

function normalizeSize(value) {
  const size = String(value ?? "")
    .trim()
    .toLowerCase();
  return SIZES.has(size) ? size : "md";
}

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

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeSize(this.readString("size", "md"));
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    const next = normalizeSize(value);
    this.reflectString("size", next === "md" ? null : next);
  }

  get label() {
    return this.readString("label", "Loading");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "size") {
      const size = normalizeSize(newValue);
      const attributeValue = size === "md" ? null : size;
      if (newValue !== attributeValue) {
        this.reflectString("size", attributeValue);
        return;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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
