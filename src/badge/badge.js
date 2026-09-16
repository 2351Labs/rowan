import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

const TONES = new Set(["info", "success", "warning", "danger"]);
const SIZES = new Set(["sm", "md", "lg"]);

function normalizeTone(value) {
  const tone = String(value ?? "")
    .trim()
    .toLowerCase();
  return TONES.has(tone) ? tone : "info";
}

function normalizeSize(value) {
  const size = String(value ?? "")
    .trim()
    .toLowerCase();
  return SIZES.has(size) ? size : "md";
}

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

  /** @returns {"info" | "success" | "warning" | "danger"} */
  get tone() {
    return normalizeTone(this.readString("tone", "info"));
  }

  /** @param {"info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    const next = normalizeTone(value);
    this.reflectString("tone", next === "info" ? null : next);
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeSize(this.readString("size", "md"));
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    const next = normalizeSize(value);
    this.reflectString("size", next === "md" ? null : next);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "tone") {
      const tone = normalizeTone(newValue);
      const attributeValue = tone === "info" ? null : tone;
      if (newValue !== attributeValue) {
        this.reflectString("tone", attributeValue);
        return;
      }
    }

    if (name === "size") {
      const size = normalizeSize(newValue);
      const attributeValue = size === "md" ? null : size;
      if (newValue !== attributeValue) {
        this.reflectString("size", attributeValue);
        return;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.renderRoot.firstElementChild) {
      this.renderRoot.innerHTML = '<span class="badge" part="badge"><slot></slot></span>';
    }
  }
}

define("rowan-badge", RowanBadge);
