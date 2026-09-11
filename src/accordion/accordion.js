import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Expandable disclosure section.
 * @tag rowan-accordion
 * @attr {boolean} open
 * @attr {string} summary
 * @slot - Body content
 * @slot summary
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when open state changes
 */
export class RowanAccordion extends BaseElement {
  static styleUrl = new URL("./accordion.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["open", "summary"];
  static upgradeProperties = ["open", "summary"];

  #trigger = null;
  #panel = null;
  #removeClickListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#removeClickListener) return;

    this.#removeClickListener = this.listen(this, "click", (event) => {
      const path = event.composedPath();
      if (path.includes(this.#trigger)) {
        this.open = !this.open;
        emit(this, "rowan-change", { open: this.open });
      }
    });
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get summary() {
    return this.readString("summary", "Details");
  }

  set summary(value) {
    this.reflectString("summary", value);
  }

  render() {
    if (!this.#trigger) {
      this.renderRoot.innerHTML = `
        <button class="trigger" part="trigger" type="button" aria-expanded="false">
          <slot name="summary"></slot>
          <span class="fallback-summary"></span>
        </button>
        <div class="panel" part="panel">
          <slot></slot>
        </div>
      `;
      this.#trigger = this.renderRoot.querySelector(".trigger");
      this.#panel = this.renderRoot.querySelector(".panel");
    }

    const fallbackSummary = this.renderRoot.querySelector(".fallback-summary");
    fallbackSummary.textContent = this.summary;
    fallbackSummary.hidden = this.querySelector('[slot="summary"]') !== null;

    this.#trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.#panel.hidden = !this.open;
  }
}

define("rowan-accordion", RowanAccordion);
