import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Compact pill for lightweight metadata.
 * @tag rowan-chip
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @slot prefix
 * @slot suffix
 * @csspart chip
 */
export class RowanChip extends BaseElement {
  static styleUrl = new URL("./chip.css", import.meta.url).href;
  static observedAttributes = ["tone", "size"];
  static upgradeProperties = ["tone", "size"];

  get tone() {
    return this.readString("tone", "info");
  }

  set tone(value) {
    this.reflectString("tone", value === "info" ? null : value);
  }

  get size() {
    return this.readString("size", "md");
  }

  set size(value) {
    this.reflectString("size", value === "md" ? null : value);
  }

  render() {
    if (!this.renderRoot.firstElementChild) {
      this.renderRoot.innerHTML = `
        <span class="chip" part="chip">
          <span class="prefix"><slot name="prefix"></slot></span>
          <slot></slot>
          <span class="suffix"><slot name="suffix"></slot></span>
        </span>
      `;
    }
  }
}

define("rowan-chip", RowanChip);
