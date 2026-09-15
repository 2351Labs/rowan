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
 * @cssprop --rowan-chip-bg
 * @cssprop --rowan-chip-border
 * @cssprop --rowan-chip-fg
 * @cssprop --rowan-chip-success-bg
 * @cssprop --rowan-chip-warning-bg
 * @cssprop --rowan-chip-danger-bg
 */
export class RowanChip extends BaseElement {
  static styleUrl = new URL("./chip.css", import.meta.url).href;
  static observedAttributes = ["tone", "size"];
  static upgradeProperties = ["tone", "size"];
  static componentTokenPrefixes = ["--rowan-chip-"];

  /** @returns {"info" | "success" | "warning" | "danger"} */
  get tone() {
    return this.readString("tone", "info");
  }

  /** @param {"info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    this.reflectString("tone", value === "info" ? null : value);
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return this.readString("size", "md");
  }

  /** @param {"sm" | "md" | "lg"} value */
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
