import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Inline popover surface.
 * @tag rowan-popover
 * @attr {boolean} open
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 */
export class RowanPopover extends BaseElement {
  static styleUrl = new URL("./popover.css", import.meta.url).href;
  static observedAttributes = ["open"];
  static upgradeProperties = ["open"];

  #panel = null;

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
        <section class="panel" part="panel"><slot></slot></section>
      `;

      this.#panel = this.renderRoot.querySelector(".panel");
    }

    this.#panel.hidden = !this.open;
  }
}

define("rowan-popover", RowanPopover);
