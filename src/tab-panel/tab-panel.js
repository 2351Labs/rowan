import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Content panel for a tab.
 * @tag rowan-tab-panel
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Panel content
 * @csspart panel
 */
export class RowanTabPanel extends BaseElement {
  static styleUrl = new URL("./tab-panel.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "active"];
  static upgradeProperties = ["value", "active"];

  #panel = null;

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
    if (!this.#panel) {
      this.renderRoot.innerHTML =
        '<section class="panel" part="panel"><slot></slot></section>';
      this.#panel = this.renderRoot.querySelector(".panel");
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tabpanel";
    }

    this.#panel.hidden = !this.active;
  }
}

define("rowan-tab-panel", RowanTabPanel);
