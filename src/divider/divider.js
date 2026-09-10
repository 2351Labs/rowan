import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Visual separator line.
 * @tag rowan-divider
 * @attr {"horizontal"|"vertical"} orientation
 * @csspart divider
 */
export class RowanDivider extends BaseElement {
  static styleUrl = new URL("./divider.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["orientation"];
  static upgradeProperties = ["orientation"];

  #line = null;

  get orientation() {
    return this.readString("orientation", "horizontal");
  }

  set orientation(value) {
    this.reflectString("orientation", value === "horizontal" ? null : value);
  }

  render() {
    if (!this.#line) {
      this.renderRoot.innerHTML = '<span class="divider" part="divider"></span>';
      this.#line = this.renderRoot.querySelector(".divider");
    }

    const orientation = this.orientation === "vertical" ? "vertical" : "horizontal";

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "separator";
    }

    if (
      this.internals &&
      !this.hasAttribute("aria-orientation") &&
      "ariaOrientation" in this.internals
    ) {
      this.internals.ariaOrientation = orientation;
    }
  }
}

define("rowan-divider", RowanDivider);
