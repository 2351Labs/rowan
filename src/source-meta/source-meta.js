import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

function normalizeText(value) {
  return String(value ?? "").trim();
}

function hasAssignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

/**
 * Provenance line for KPI description, chart description, or table caption.
 * Does not add fields to those frozen hosts.
 * @tag rowan-source-meta
 * @attr {string} source
 * @attr {string} as-of
 * @slot source - Replaces the source attribute.
 * @slot as-of - Replaces the as-of attribute.
 * @csspart meta
 * @csspart source
 * @csspart as-of
 */
export class RowanSourceMeta extends BaseElement {
  static styleUrl = new URL("./source-meta.css", import.meta.url).href;
  static observedAttributes = ["source", "as-of"];
  static upgradeProperties = ["source", "asOf"];

  #sourceItem = null;
  #asOfItem = null;
  #sourceSlot = null;
  #asOfSlot = null;
  #sourceFallback = null;
  #asOfFallback = null;

  get source() {
    return this.readString("source", "");
  }

  set source(value) {
    this.reflectString("source", normalizeText(value) || null);
  }

  get asOf() {
    return this.readString("as-of", "");
  }

  set asOf(value) {
    this.reflectString("as-of", normalizeText(value) || null);
  }

  render() {
    if (!this.#sourceItem) {
      this.renderRoot.innerHTML = `
        <span class="meta" part="meta">
          <span class="item source" part="source" hidden>
            <span class="value"><slot name="source"><span class="source-fallback"></span></slot></span>
          </span>
          <span class="item as-of" part="as-of" hidden>
            <span class="term">As of</span>
            <span class="value"><slot name="as-of"><span class="as-of-fallback"></span></slot></span>
          </span>
        </span>
      `;
      this.#sourceItem = this.renderRoot.querySelector(".source");
      this.#asOfItem = this.renderRoot.querySelector(".as-of");
      this.#sourceSlot = this.renderRoot.querySelector('slot[name="source"]');
      this.#asOfSlot = this.renderRoot.querySelector('slot[name="as-of"]');
      this.#sourceFallback = this.renderRoot.querySelector(".source-fallback");
      this.#asOfFallback = this.renderRoot.querySelector(".as-of-fallback");
      this.listen(this.#sourceSlot, "slotchange", () => this.requestRender());
      this.listen(this.#asOfSlot, "slotchange", () => this.requestRender());
    }

    this.#sync();
  }

  #sync() {
    const sourceAssigned = hasAssignedContent(this.#sourceSlot);
    const asOfAssigned = hasAssignedContent(this.#asOfSlot);
    const sourceText = this.source;
    const asOfText = this.asOf;

    this.#sourceFallback.textContent = sourceText;
    this.#sourceFallback.hidden = sourceAssigned || !sourceText;
    this.#sourceItem.hidden = !sourceAssigned && !sourceText;

    this.#asOfFallback.textContent = asOfText;
    this.#asOfFallback.hidden = asOfAssigned || !asOfText;
    this.#asOfItem.hidden = !asOfAssigned && !asOfText;
  }
}

define("rowan-source-meta", RowanSourceMeta);
