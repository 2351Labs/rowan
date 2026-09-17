import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const TONES = new Set(["info", "success", "warning", "danger"]);
const SIZES = new Set(["sm", "md", "lg"]);

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
    return normalizeEnum(this.readString("tone", "info"), TONES, "info");
  }

  /** @param {"info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    reflectEnum(this, "tone", value, TONES, "info");
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeEnum(this.readString("size", "md"), SIZES, "md");
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    reflectEnum(this, "size", value, SIZES, "md");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "tone" && rewriteEnumAttribute(this, name, newValue, TONES, "info")) {
      return;
    }

    if (name === "size" && rewriteEnumAttribute(this, name, newValue, SIZES, "md")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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
