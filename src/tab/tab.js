import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Single tab button.
 * @tag rowan-tab
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Label
 * @csspart tab
 */
export class RowanTab extends BaseElement {
  static styleUrl = new URL("./tab.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["value", "active"];
  static upgradeProperties = ["value", "active"];

  #button = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get active() {
    return this.readBoolean("active");
  }

  set active(value) {
    this.reflectBoolean("active", Boolean(value));
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML =
        '<button class="tab" part="tab" type="button"><slot></slot></button>';
      this.#button = this.renderRoot.querySelector("button");
    }

    const selected = this.active ? "true" : "false";

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tab";
    }

    if (
      this.internals &&
      !this.hasAttribute("role") &&
      !this.hasAttribute("aria-selected") &&
      "ariaSelected" in this.internals
    ) {
      this.internals.ariaSelected = selected;
    }

    this.#button.setAttribute("aria-selected", selected);
    this.#button.tabIndex = this.active ? 0 : -1;
  }
}

define("rowan-tab", RowanTab);
