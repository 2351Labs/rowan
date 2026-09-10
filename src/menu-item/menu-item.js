import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Selectable menu item.
 * @tag rowan-menu-item
 * @attr {string} value
 * @attr {boolean} disabled
 * @slot - Item label
 * @csspart item
 */
export class RowanMenuItem extends BaseElement {
  static styleUrl = new URL("./menu-item.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["value", "disabled"];
  static upgradeProperties = ["value", "disabled"];

  #button = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML =
        '<button class="item" part="item" type="button"><slot></slot></button>';
      this.#button = this.renderRoot.querySelector("button");
    }

    this.#button.disabled = this.disabled;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "menuitem";
    }
  }
}

define("rowan-menu-item", RowanMenuItem);
