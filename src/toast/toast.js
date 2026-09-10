import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

const TONE_VALUES = new Set(["info", "success", "warning", "danger"]);

/**
 * Compact status notification with optional dismiss control.
 * @tag rowan-toast
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {boolean} dismissible
 * @slot title
 * @slot - Notification message
 * @slot actions
 * @csspart toast
 * @csspart close
 * @event rowan-dismiss - Fired when dismissed by user interaction
 */
export class RowanToast extends BaseElement {
  static styleUrl = new URL("./toast.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["tone", "dismissible"];
  static upgradeProperties = ["tone", "dismissible"];

  #title = null;
  #titleSlot = null;
  #actions = null;
  #actionsSlot = null;
  #closeButton = null;

  get tone() {
    const value = this.readString("tone", "info");
    return TONE_VALUES.has(value) ? value : "info";
  }

  set tone(value) {
    const nextTone = TONE_VALUES.has(value) ? value : "info";
    this.reflectString("tone", nextTone === "info" ? null : nextTone);
  }

  get dismissible() {
    return this.readBoolean("dismissible");
  }

  set dismissible(value) {
    this.reflectBoolean("dismissible", Boolean(value));
  }

  render() {
    if (!this.#title) {
      this.renderRoot.innerHTML = `
        <article class="toast" part="toast">
          <div class="content">
            <p class="title" part="title" hidden><slot name="title"></slot></p>
            <div class="message" part="message"><slot></slot></div>
            <div class="actions" part="actions" hidden><slot name="actions"></slot></div>
          </div>
          <button class="close" part="close" type="button" aria-label="Dismiss notification">Dismiss</button>
        </article>
      `;

      this.#title = this.renderRoot.querySelector(".title");
      this.#titleSlot = this.renderRoot.querySelector('slot[name="title"]');
      this.#actions = this.renderRoot.querySelector(".actions");
      this.#actionsSlot = this.renderRoot.querySelector('slot[name="actions"]');
      this.#closeButton = this.renderRoot.querySelector(".close");

      this.listen(this.#closeButton, "click", () => {
        this.#requestDismiss("dismiss-button");
      });

      this.listen(this.#titleSlot, "slotchange", () => {
        this.#syncSlotState();
      });

      this.listen(this.#actionsSlot, "slotchange", () => {
        this.#syncSlotState();
      });
    }

    this.#syncSlotState();
    this.#closeButton.hidden = !this.dismissible;
    this.#applyDefaultA11y();
  }

  #requestDismiss(reason) {
    if (!this.dismissible || this.hidden) return;

    this.hidden = true;
    emit(this, "rowan-dismiss", {
      tone: this.tone,
      reason,
    });
  }

  #syncSlotState() {
    this.#title.hidden = !this.#hasRenderableAssignedNodes(this.#titleSlot);
    this.#actions.hidden = !this.#hasRenderableAssignedNodes(this.#actionsSlot);
  }

  #hasRenderableAssignedNodes(slot) {
    if (!slot) return false;

    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }

      return true;
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = this.tone === "danger" ? "alert" : "status";
    }

    if (!this.hasAttribute("aria-live") && "ariaLive" in this.internals) {
      this.internals.ariaLive = this.tone === "danger" ? "assertive" : "polite";
    }
  }
}

define("rowan-toast", RowanToast);