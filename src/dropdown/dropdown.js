import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { isFocusable } from "../lib/focus.js";
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
 * Triggered dropdown surface. Menu content (`rowan-menu-item`) closes on Tab.
 * Other focusable panel content is tabbed through; Tab at the edge closes.
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
  #ownedAria = {};
  #panel = null;
  #panelId = "";
  #removeDocumentPointerListener = null;
  #panelSizeObserver = null;
  #watchingStylesheet = false;

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
    this.#releaseTriggerAria();
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
      this.#releaseTriggerAria();
      this.#trigger = trigger;
      const type = custom ? "click" : "rowan-click";
      this.#removeTriggerListener = this.listen(trigger, type, () =>
        this.#setOpenFromUser(!this.open),
      );
    }

    this.#syncTriggerAria();
  }

  #syncTriggerAria() {
    if (!this.#trigger) return;

    const next = {
      "aria-controls": this.#panelId,
      "aria-expanded": this.open ? "true" : "false",
      "aria-haspopup": this.#hasPopupType(),
    };

    for (const [attribute, value] of Object.entries(next)) {
      const current = this.#trigger.getAttribute(attribute);
      const owned = this.#ownedAria[attribute];
      if (current !== null && owned !== current) {
        delete this.#ownedAria[attribute];
        continue;
      }
      this.#trigger.setAttribute(attribute, value);
      this.#ownedAria[attribute] = value;
    }
  }

  #releaseTriggerAria() {
    const trigger = this.#trigger;
    if (!trigger) return;

    for (const [attribute, value] of Object.entries(this.#ownedAria)) {
      if (trigger.getAttribute(attribute) === value) {
        trigger.removeAttribute(attribute);
      }
    }

    this.#ownedAria = {};
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
    this.#focusPanelContents();
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

    if (event.key !== keys.TAB) return;

    if (this.#isMenuPopup() || this.#panelFocusables().length === 0) {
      noteDismissibleClose();
      this.#setOpenFromUser(false);
      return;
    }

    if (this.#tabLeavesPanel(event)) {
      noteDismissibleClose();
      this.#setOpenFromUser(false);
    }
  }

  #isMenuPopup() {
    return Boolean(this.querySelector("rowan-menu-item"));
  }

  #hasPopupType() {
    if (this.#isMenuPopup()) return "menu";
    return this.#panelFocusables().length > 0 ? "true" : "menu";
  }

  #panelFocusables() {
    const nodes = [];
    for (const child of this.children) {
      if (!(child instanceof HTMLElement) || child.slot === "trigger") continue;
      if (isFocusable(child)) nodes.push(child);
      for (const nested of child.querySelectorAll(
        "input, select, textarea, button, a[href], [tabindex]",
      )) {
        if (isFocusable(nested)) nodes.push(nested);
      }
    }
    return nodes;
  }

  #tabLeavesPanel(event) {
    const focusables = this.#panelFocusables();
    const active =
      focusables.find((node) => node === event.target || node.contains(event.target)) ?? null;
    if (!active) {
      if (!event.shiftKey && focusables.length > 0) {
        event.preventDefault();
        focusables[0].focus({ preventScroll: true });
        return false;
      }
      return true;
    }
    if (event.shiftKey) return active === focusables[0];
    return active === focusables[focusables.length - 1];
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
    this.#watchPanelLayout();
  }

  #hidePanelPopover() {
    if (!this.#panel) return;

    this.#unobservePanelSize();
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
    const offset = 5;
    this.#panel.style.top = `${Math.round(bounds.bottom + offset)}px`;

    const width = this.#panel.getBoundingClientRect().width;
    const margin = 8;
    let left = bounds.left;
    if (width && left + width > window.innerWidth - margin) {
      left = bounds.right - width;
    }
    if (width) {
      const maxLeft = Math.max(margin, window.innerWidth - width - margin);
      left = Math.min(Math.max(margin, left), maxLeft);
    }
    this.#panel.style.left = `${Math.round(left)}px`;
  }

  #watchPanelLayout() {
    this.#watchStylesheet();
    this.#observePanelSize();
  }

  #watchStylesheet() {
    if (this.#watchingStylesheet) return;

    const stylesheet = this.shadowRoot.querySelector('link[rel="stylesheet"]');
    if (!stylesheet) return;

    this.#watchingStylesheet = true;
    this.listen(stylesheet, "load", () => {
      if (this.open) this.#positionPanel();
    });
  }

  #observePanelSize() {
    if (typeof ResizeObserver === "undefined" || !this.#panel) return;

    if (!this.#panelSizeObserver) {
      this.#panelSizeObserver = new ResizeObserver(() => {
        if (!this.open) return;
        this.#positionPanel();
      });
      this.observe(this.#panelSizeObserver, () => {
        if (this.open && this.#panel) this.#panelSizeObserver.observe(this.#panel);
      });
    }

    this.#panelSizeObserver.observe(this.#panel);
  }

  #unobservePanelSize() {
    if (this.#panelSizeObserver && this.#panel) {
      this.#panelSizeObserver.unobserve(this.#panel);
    }
  }

  #focusPanelContents() {
    const item = this.querySelector("rowan-menu-item");
    if (item && typeof item.focus === "function") {
      item.focus({ preventScroll: true });
      return;
    }

    const first = this.#panelFocusables()[0];
    if (first) first.focus({ preventScroll: true });
  }

  #setOpenFromUser(open) {
    if (this.open === open) return;

    this.open = open;
    emit(this, "rowan-change", { open });
  }
}

define("rowan-dropdown", RowanDropdown);
