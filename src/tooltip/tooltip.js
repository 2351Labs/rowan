import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Lightweight tooltip text.
 * @tag rowan-tooltip
 * @attr {string} text
 * @attr {boolean} open
 * @slot - Trigger element
 * @csspart trigger
 * @csspart tooltip
 */
export class RowanTooltip extends BaseElement {
  static styleUrl = new URL("./tooltip.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["text", "open"];
  static upgradeProperties = ["text", "open"];

  #trigger = null;
  #tooltip = null;

  get text() {
    return this.readString("text", "");
  }

  set text(value) {
    this.reflectString("text", value);
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  render() {
    if (!this.#trigger) {
      this.renderRoot.innerHTML = `
        <span class="trigger" part="trigger"><slot></slot></span>
        <span class="tooltip" part="tooltip"></span>
      `;

      this.#trigger = this.renderRoot.querySelector(".trigger");
      this.#tooltip = this.renderRoot.querySelector(".tooltip");

      this.listen(this, "mouseenter", () => {
        this.open = true;
      });

      this.listen(this, "mouseleave", () => {
        this.open = false;
      });

      this.listen(this, "focusin", () => {
        this.open = true;
      });

      this.listen(this, "focusout", () => {
        this.open = false;
      });
    }

    const hasText = this.text.trim().length > 0;
    this.#tooltip.textContent = this.text;
    this.#tooltip.hidden = !this.open || !hasText;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tooltip";
    }

    if (this.internals && !this.hasAttribute("aria-hidden") && "ariaHidden" in this.internals) {
      this.internals.ariaHidden = this.open && hasText ? "false" : "true";
    }
  }
}

define("rowan-tooltip", RowanTooltip);
