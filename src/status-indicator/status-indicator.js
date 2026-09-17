import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const TONES = new Set(["neutral", "info", "success", "warning", "danger"]);
const SIZES = new Set(["sm", "md", "lg"]);

function hasAssignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * Concise semantic status marker with an optional visible label.
 * @tag rowan-status-indicator
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} label
 * @attr {boolean} pulse
 * @slot - Visible status label
 * @csspart status
 * @csspart indicator
 * @csspart label
 * @cssprop --rowan-status-indicator-color
 * @cssprop --rowan-status-indicator-fg
 * @cssprop --rowan-status-indicator-gap
 */
export class RowanStatusIndicator extends BaseElement {
  static styleUrl = new URL("./status-indicator.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["tone", "size", "label", "pulse"];
  static upgradeProperties = ["tone", "size", "label", "pulse"];
  static componentTokenPrefixes = ["--rowan-status-indicator-"];

  #labelSlot = null;
  #labelFallback = null;

  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone() {
    return normalizeEnum(this.readString("tone", "neutral"), TONES, "neutral");
  }

  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    reflectEnum(this, "tone", value, TONES, "neutral");
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

    if (name === "tone" && rewriteEnumAttribute(this, name, newValue, TONES, "neutral")) {
      return;
    }

    if (name === "size" && rewriteEnumAttribute(this, name, newValue, SIZES, "md")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get pulse() {
    return this.readBoolean("pulse");
  }

  set pulse(value) {
    this.reflectBoolean("pulse", Boolean(value));
  }

  render() {
    if (!this.#labelSlot) {
      this.renderRoot.innerHTML = `
        <span class="status" part="status">
          <span class="indicator" part="indicator" aria-hidden="true"></span>
          <span class="label" part="label"><slot><span class="label-fallback"></span></slot></span>
        </span>
      `;

      this.#labelSlot = this.renderRoot.querySelector("slot");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
    }

    this.#syncLabel();
    this.#applyDefaultA11y();
  }

  #syncLabel() {
    const hasContent = hasAssignedContent(this.#labelSlot);
    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasContent || !this.label;
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "status";
    }

    if (!this.hasAttribute("aria-live") && "ariaLive" in this.internals) {
      this.internals.ariaLive = "polite";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const hasContent = hasAssignedContent(this.#labelSlot);
      this.internals.ariaLabel = hasContent ? null : this.label || `${this.tone} status`;
    }
  }
}

define("rowan-status-indicator", RowanStatusIndicator);
