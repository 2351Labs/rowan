import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../button/button.js";

/**
 * Triggered dropdown surface.
 * @tag rowan-dropdown
 * @attr {boolean} open
 * @attr {string} label
 * @slot - Dropdown content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when open state changes
 */
export class RowanDropdown extends BaseElement {
  static styleUrl = new URL("./dropdown.css", import.meta.url).href;
  static observedAttributes = ["open", "label"];
  static upgradeProperties = ["open", "label"];

  #trigger = null;
  #panel = null;

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get label() {
    return this.readString("label", "Options");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  render() {
    if (!this.#trigger) {
      this.renderRoot.innerHTML = `
        <rowan-button class="trigger" part="trigger" variant="secondary" size="sm"></rowan-button>
        <section class="panel" part="panel"><slot></slot></section>
      `;

      this.#trigger = this.renderRoot.querySelector("rowan-button");
      this.#panel = this.renderRoot.querySelector(".panel");

      this.listen(this.#trigger, "rowan-click", () => {
        this.open = !this.open;
        emit(this, "rowan-change", { open: this.open });
      });
    }

    this.#trigger.textContent = this.label;
    this.#panel.hidden = !this.open;
  }
}

define("rowan-dropdown", RowanDropdown);
