import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Compact label for status and metadata.
 * @tag rowan-badge
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @csspart badge
 */
export class RowanBadge extends BaseElement {
  static styleUrl = new URL("./badge.css", import.meta.url).href;
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
      this.renderRoot.innerHTML = '<span class="badge" part="badge"><slot></slot></span>';
    }
  }
}

define("rowan-badge", RowanBadge);
