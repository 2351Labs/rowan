import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Loading placeholder block.
 * @tag rowan-skeleton
 * @attr {"text"|"rect"|"circle"} shape
 * @attr {string} width
 * @attr {string} height
 * @attr {boolean} animated
 * @csspart skeleton
 */
export class RowanSkeleton extends BaseElement {
  static styleUrl = new URL("./skeleton.css", import.meta.url).href;
  static observedAttributes = ["shape", "width", "height", "animated"];
  static upgradeProperties = ["shape", "width", "height", "animated"];

  #skeleton = null;

  get shape() {
    return this.readString("shape", "text");
  }

  set shape(value) {
    this.reflectString("shape", value === "text" ? null : value);
  }

  get width() {
    return this.readString("width", "");
  }

  set width(value) {
    this.reflectString("width", value);
  }

  get height() {
    return this.readString("height", "");
  }

  set height(value) {
    this.reflectString("height", value);
  }

  get animated() {
    if (!this.hasAttribute("animated")) return true;
    return this.readBoolean("animated");
  }

  set animated(value) {
    this.reflectBoolean("animated", Boolean(value));
  }

  render() {
    if (!this.#skeleton) {
      this.renderRoot.innerHTML =
        '<span class="skeleton" part="skeleton" aria-hidden="true"></span>';
      this.#skeleton = this.renderRoot.querySelector(".skeleton");
    }

    this.#skeleton.style.width = this.width || "100%";
    this.#skeleton.style.height = this.height || "";
    this.#skeleton.classList.toggle("animated", this.animated);
  }
}

define("rowan-skeleton", RowanSkeleton);
