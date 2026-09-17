import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { keys } from "../lib/keys.js";

function isHTMLElement(value) {
  return value instanceof HTMLElement;
}

/**
 * Lightweight tooltip text.
 * @tag rowan-tooltip
 * @attr {string} text
 * @attr {boolean} open
 * @slot - Trigger element
 * @csspart trigger
 * @csspart tooltip
 */
export class RowanTooltip extends BaseElement {
  static styleUrl = new URL("./tooltip.css", import.meta.url).href;
  static observedAttributes = ["text", "open"];
  static upgradeProperties = ["text", "open"];

  #trigger = null;
  #triggerSlot = null;
  #tooltip = null;

  disconnectedCallback() {
    this.#hideTooltipPopover();
    this.#releaseTrigger();
    super.disconnectedCallback();
  }

  get text() {
    return this.readString("text", "");
  }

  set text(value) {
    this.reflectString("text", value);
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  render() {
    if (!this.#triggerSlot) {
      this.renderRoot.innerHTML = `
        <span class="trigger" part="trigger"><slot></slot></span>
        <span class="tooltip" part="tooltip" role="tooltip"></span>
      `;

      this.#triggerSlot = this.renderRoot.querySelector("slot");
      this.#tooltip = this.renderRoot.querySelector(".tooltip");

      this.listen(this.#triggerSlot, "slotchange", () => this.requestRender());
      this.listen(this, "mouseenter", () => {
        this.open = true;
      });
      this.listen(this, "mouseleave", () => {
        this.open = false;
      });
      this.listen(this, "focusin", () => {
        this.open = true;
      });
      this.listen(this, "focusout", (event) => {
        if (!this.#isNodeInTooltip(event.relatedTarget)) this.open = false;
      });
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
    }

    const text = this.text.trim();
    this.#tooltip.textContent = text;
    if (this.open && text) {
      this.#showTooltipPopover();
    } else {
      this.#hideTooltipPopover();
    }
    this.#syncTrigger(text);
  }

  #showTooltipPopover() {
    if (!this.#tooltip) return;

    this.#tooltip.hidden = false;
    if (typeof this.#tooltip.showPopover === "function") {
      if (this.#tooltip.getAttribute("popover") !== "manual") {
        this.#tooltip.setAttribute("popover", "manual");
      }

      try {
        if (!this.#tooltip.matches(":popover-open")) this.#tooltip.showPopover();
      } catch {
        this.#tooltip.hidden = false;
      }
    }

    this.#positionTooltip();
  }

  #hideTooltipPopover() {
    if (!this.#tooltip) return;

    this.#tooltip.hidden = true;
    if (typeof this.#tooltip.hidePopover !== "function") return;

    try {
      if (this.#tooltip.matches(":popover-open")) this.#tooltip.hidePopover();
    } catch {
      return;
    }
  }

  #positionTooltip() {
    if (!this.#tooltip) return;

    const anchor = this.#trigger ?? this;
    const bounds = anchor.getBoundingClientRect();
    this.#tooltip.style.top = `${Math.round(bounds.bottom + 6)}px`;
    this.#tooltip.style.left = `${Math.round(bounds.left + bounds.width / 2)}px`;
  }

  #syncTrigger(text) {
    const trigger =
      this.#triggerSlot.assignedElements({ flatten: true }).find(isHTMLElement) ?? null;
    if (trigger !== this.#trigger) {
      this.#releaseTrigger();
      this.#trigger = trigger;
    }

    if (!this.#trigger || !text) {
      if (!text) this.#releaseDescription();
      return;
    }

    if (this.#trigger.hasAttribute("aria-describedby")) {
      this.#releaseDescription();
      return;
    }

    const description = this.#trigger.getAttribute("aria-description");
    const managedDescription = this.#trigger.dataset.rowanTooltipDescription;
    if (!description) {
      this.#setManagedDescription(text);
      return;
    }

    if (managedDescription === description) {
      this.#setManagedDescription(text);
      return;
    }

    delete this.#trigger.dataset.rowanTooltipDescription;
  }

  #releaseTrigger() {
    this.#releaseDescription();
    this.#trigger = null;
  }

  #setManagedDescription(text) {
    this.#trigger.setAttribute("aria-description", text);
    this.#trigger.dataset.rowanTooltipDescription = text;
  }

  #releaseDescription() {
    if (!this.#trigger) return;

    const managedDescription = this.#trigger.dataset.rowanTooltipDescription;
    if (managedDescription === this.#trigger.getAttribute("aria-description")) {
      this.#trigger.removeAttribute("aria-description");
    }
    delete this.#trigger.dataset.rowanTooltipDescription;
  }

  #handleKeydown(event) {
    if (event.key !== keys.ESCAPE || !this.open) return;

    event.preventDefault();
    this.open = false;
  }

  #isNodeInTooltip(node) {
    if (!(node instanceof Node)) return false;
    return this.contains(node) || this.shadowRoot?.contains(node);
  }
}

define("rowan-tooltip", RowanTooltip);
