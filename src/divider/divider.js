import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

function normalizeOrientation(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "vertical"
    ? "vertical"
    : "horizontal";
}

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

  /** @returns {"horizontal" | "vertical"} */
  get orientation() {
    return normalizeOrientation(this.readString("orientation", "horizontal"));
  }

  /** @param {"horizontal" | "vertical"} value */
  set orientation(value) {
    const next = normalizeOrientation(value);
    this.reflectString("orientation", next === "horizontal" ? null : next);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "orientation") {
      const orientation = normalizeOrientation(newValue);
      const attributeValue = orientation === "horizontal" ? null : orientation;
      if (newValue !== attributeValue) {
        this.reflectString("orientation", attributeValue);
        return;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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
