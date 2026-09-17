import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import {
  isTopmostOverlay,
  noteDismissibleClose,
  pushDismissible,
  removeDismissible,
} from "../lib/overlay-stack.js";

import "../button/button.js";

let dropdownId = 0;

/**
 * Triggered dropdown surface.
 * @tag rowan-dropdown
 * @attr {boolean} open
 * @attr {string} label
 * @slot - Dropdown content
 * @slot trigger - Optional custom trigger. The default secondary button is used when this slot is empty.
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the dropdown
 */
export class RowanDropdown extends BaseElement {
  static styleUrl = new URL("./dropdown.css", import.meta.url).href;
  static observedAttributes = ["open", "label"];
  static upgradeProperties = ["open", "label"];

  #trigger = null;
  #triggerSlot = null;
  #fallbackTrigger = null;
  #removeTriggerListener = null;
  #panel = null;
  #panelId = "";
  #removeDocumentPointerListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#panelId) {
      dropdownId += 1;
      this.#panelId = `rowan-dropdown-${dropdownId}-panel`;
    }
  }

  disconnectedCallback() {
    this.#removeDocumentPointerListener?.();
    this.#removeDocumentPointerListener = null;
    this.#hidePanelPopover();
    removeDismissible(this);
    super.disconnectedCallback();
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get label() {
    return this.readString("label", "Options");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <span class="trigger" part="trigger">
          <slot name="trigger"></slot>
          <rowan-button class="fallback-trigger" variant="secondary" size="sm"></rowan-button>
        </span>
        <section class="panel" part="panel"><slot></slot></section>
      `;

      this.#triggerSlot = this.renderRoot.querySelector("slot[name='trigger']");
      this.#fallbackTrigger = this.renderRoot.querySelector(".fallback-trigger");
      this.#panel = this.renderRoot.querySelector(".panel");

      this.listen(this.#triggerSlot, "slotchange", () => this.requestRender());
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
      this.listen(this, "rowan-change", (event) => this.#handleMenuChange(event));
    }

    this.#syncTrigger();
    this.#panel.id = this.#panelId;
    this.#panel.setAttribute("aria-hidden", this.open ? "false" : "true");
    this.#syncDocumentDismissal();
  }

  #syncTrigger() {
    const custom =
      this.#triggerSlot
        .assignedElements({ flatten: true })
        .find((node) => node instanceof HTMLElement) ?? null;
    this.#fallbackTrigger.hidden = Boolean(custom);
    if (!custom) this.#fallbackTrigger.textContent = this.label;

    const trigger = custom ?? this.#fallbackTrigger;
    if (trigger !== this.#trigger) {
      this.#removeTriggerListener?.();
      this.#removeTriggerListener = null;
      this.#trigger = trigger;
      const type = custom ? "click" : "rowan-click";
      this.#removeTriggerListener = this.listen(trigger, type, () =>
        this.#setOpenFromUser(!this.open),
      );
    }

    this.#trigger.setAttribute("aria-controls", this.#panelId);
    this.#trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.#trigger.setAttribute("aria-haspopup", "menu");
  }

  #syncDocumentDismissal() {
    if (!this.open) {
      this.#removeDocumentPointerListener?.();
      this.#removeDocumentPointerListener = null;
      this.#hidePanelPopover();
      removeDismissible(this);
      return;
    }

    if (this.#removeDocumentPointerListener) return;
    pushDismissible(this);
    this.#showPanelPopover();
    this.#focusFirstMenuItem();
    this.#removeDocumentPointerListener = this.listen(document, "pointerdown", (event) => {
      if (!isTopmostOverlay(this)) return;
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this.#panel)) return;
      event.preventDefault();
      event.stopPropagation();
      noteDismissibleClose();
      this.#setOpenFromUser(false);
    });
  }

  #handleKeydown(event) {
    if (!this.open) return;
    if (!isTopmostOverlay(this)) return;

    if (event.key === keys.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      noteDismissibleClose();
      this.#setOpenFromUser(false);
      this.#trigger.focus({ preventScroll: true });
      return;
    }

    if (event.key === keys.TAB) {
      noteDismissibleClose();
      this.#setOpenFromUser(false);
    }
  }

  #handleMenuChange(event) {
    if (event.target === this || !this.open) return;
    if (!(event.detail && "item" in event.detail)) return;

    this.#setOpenFromUser(false);
  }

  #showPanelPopover() {
    if (!this.#panel) return;

    this.#panel.hidden = false;
    if (typeof this.#panel.showPopover === "function") {
      if (this.#panel.getAttribute("popover") !== "manual") {
        this.#panel.setAttribute("popover", "manual");
      }

      try {
        if (!this.#panel.matches(":popover-open")) this.#panel.showPopover();
      } catch {
        this.#panel.hidden = false;
      }
    }

    this.#positionPanel();
  }

  #hidePanelPopover() {
    if (!this.#panel) return;

    this.#panel.hidden = true;
    if (typeof this.#panel.hidePopover !== "function") return;

    try {
      if (this.#panel.matches(":popover-open")) this.#panel.hidePopover();
    } catch {
      return;
    }
  }

  #positionPanel() {
    if (!this.#panel || !this.#trigger) return;

    const bounds = this.#trigger.getBoundingClientRect();
    this.#panel.style.top = `${Math.round(bounds.bottom + 5)}px`;
    this.#panel.style.left = `${Math.round(bounds.left)}px`;
  }

  #focusFirstMenuItem() {
    const item = this.querySelector("rowan-menu-item");
    if (item && typeof item.focus === "function") {
      item.focus({ preventScroll: true });
    }
  }

  #setOpenFromUser(open) {
    if (this.open === open) return;

    this.open = open;
    emit(this, "rowan-change", { open });
  }
}

define("rowan-dropdown", RowanDropdown);
