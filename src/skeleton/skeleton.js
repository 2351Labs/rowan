import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const SHAPES = new Set(["text", "rect", "circle"]);

/**
 * Loading placeholder block.
 * @tag rowan-skeleton
 * @attr {"text"|"rect"|"circle"} shape
 * @attr {string} width
 * @attr {string} height
 * @attr {boolean} animated
 * @csspart skeleton
 * @cssprop --rowan-skeleton-base
 * @cssprop --rowan-skeleton-highlight
 * @cssprop --rowan-skeleton-shimmer-duration
 */
export class RowanSkeleton extends BaseElement {
  static styleUrl = new URL("./skeleton.css", import.meta.url).href;
  static observedAttributes = ["shape", "width", "height", "animated"];
  static upgradeProperties = ["shape", "width", "height", "animated"];
  static componentTokenPrefixes = ["--rowan-skeleton-"];

  #skeleton = null;

  /** @returns {"text" | "rect" | "circle"} */
  get shape() {
    return normalizeEnum(this.readString("shape", "text"), SHAPES, "text");
  }

  /** @param {"text" | "rect" | "circle"} value */
  set shape(value) {
    reflectEnum(this, "shape", value, SHAPES, "text");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "shape" && rewriteEnumAttribute(this, name, newValue, SHAPES, "text")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
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
