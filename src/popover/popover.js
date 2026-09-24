import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { collectFocusableElements } from "../lib/focus.js";
import { keys } from "../lib/keys.js";
import {
  isTopmostOverlay,
  noteDismissibleClose,
  pushDismissible,
  removeDismissible,
} from "../lib/overlay-stack.js";

let popoverId = 0;

const TRIGGER_MODES = new Set(["click", "manual"]);

function isHTMLElement(value) {
  return value instanceof HTMLElement;
}

function elementReferencesMatch(element, property, elements) {
  const applied = Array.from(element[property] ?? []);
  return (
    applied.length === elements.length && applied.every((value, index) => value === elements[index])
  );
}

function setElementReferences(element, property, elements) {
  if (!(property in element)) return false;

  try {
    element[property] = elements;
  } catch (_error) {
    return false;
  }

  if (elementReferencesMatch(element, property, elements)) return true;

  try {
    element[property] = [];
  } catch (_error) {
    // The unsupported reference remains inaccessible rather than overriding author ARIA.
  }
  return false;
}

/**
 * Inline popover surface.
 * @tag rowan-popover
 * @attr {boolean} open
 * @attr {string} label
 * @attr {"click"|"manual"} trigger
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the popover
 */
export class RowanPopover extends BaseElement {
  static styleUrl = new URL("./popover.css", import.meta.url).href;
  static observedAttributes = ["open", "label", "trigger"];
  static upgradeProperties = ["open", "label", "trigger"];

  #triggerContainer = null;
  #triggerSlot = null;
  #panel = null;
  #trigger = null;
  #triggerControl = null;
  #panelId = "";
  #removeTriggerClickListener = null;
  #removeDocumentPointerListener = null;
  #removeDocumentKeydownListener = null;
  #managedControlsElement = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#panelId) {
      popoverId += 1;
      this.#panelId = `rowan-popover-${popoverId}-panel`;
    }
  }

  disconnectedCallback() {
    this.#teardownDocumentDismissal();
    this.#hidePanelPopover();
    this.#releaseTrigger();
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
    return this.readString("label", "Popover");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next && next !== "Popover" ? next : null);
  }

  /** @returns {"click" | "manual"} */
  get trigger() {
    return normalizeEnum(this.readString("trigger", "click"), TRIGGER_MODES, "click");
  }

  /** @param {"click" | "manual"} value */
  set trigger(value) {
    reflectEnum(this, "trigger", value, TRIGGER_MODES, "click");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "trigger" && rewriteEnumAttribute(this, name, newValue, TRIGGER_MODES, "click")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
        <section class="panel" part="panel" role="dialog"><slot></slot></section>
      `;

      this.#triggerContainer = this.renderRoot.querySelector(".trigger");
      this.#triggerSlot = this.#triggerContainer.querySelector("slot");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.listen(this.#triggerSlot, "slotchange", () => this.requestRender());
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
      this.listen(this, "focusout", (event) => this.#handleFocusOut(event));
    }

    this.#panel.id = this.#panelId;
    this.#panel.setAttribute("aria-label", this.label);
    this.#panel.tabIndex = -1;
    this.#syncTrigger();
    this.#syncDocumentDismissal();
  }

  #syncTrigger() {
    const trigger =
      this.#triggerSlot.assignedElements({ flatten: true }).find(isHTMLElement) ?? null;
    if (trigger !== this.#trigger) {
      this.#releaseTrigger();
      this.#trigger = trigger;
    }

    this.#syncTriggerClick();

    if (!this.#trigger) return;

    const control = this.#trigger;

    if (control !== this.#triggerControl) {
      this.#releaseTriggerControl();
      this.#triggerControl = control;
    }

    this.#syncControlsReference();
    this.#syncManagedAttribute(
      "aria-expanded",
      this.open ? "true" : "false",
      "rowanPopoverExpanded",
    );
    this.#syncManagedAttribute("aria-haspopup", "dialog", "rowanPopoverHasPopup");
  }

  #syncTriggerClick() {
    const shouldListen = this.trigger === "click" && this.#trigger;
    if (!shouldListen) {
      this.#removeTriggerClickListener?.();
      this.#removeTriggerClickListener = null;
      return;
    }

    if (this.#removeTriggerClickListener) return;
    this.#removeTriggerClickListener = this.listen(this.#trigger, "click", () =>
      this.#toggleFromUser(),
    );
  }

  #releaseTrigger() {
    this.#removeTriggerClickListener?.();
    this.#removeTriggerClickListener = null;
    this.#releaseTriggerControl();
    this.#trigger = null;
  }

  #syncControlsReference() {
    const control = this.#triggerControl;
    const controlsAttribute = control.getAttribute("aria-controls");

    if (controlsAttribute) {
      if (this.#managedControlsElement === control) {
        setElementReferences(control, "ariaControlsElements", []);
        this.#managedControlsElement = null;
      }

      if (control.dataset.rowanPopoverControls !== controlsAttribute) {
        delete control.dataset.rowanPopoverControls;
      }
      return;
    }

    if (this.#managedControlsElement === control) {
      if (elementReferencesMatch(control, "ariaControlsElements", [this.#panel])) return;
      this.#managedControlsElement = null;
      return;
    }

    if (control.dataset.rowanPopoverControls) {
      delete control.dataset.rowanPopoverControls;
    }

    const existingReferences = Array.from(control.ariaControlsElements ?? []);
    if (existingReferences.length > 0) return;

    if (setElementReferences(control, "ariaControlsElements", [this.#panel])) {
      this.#managedControlsElement = control;
      return;
    }

    if (control.getRootNode() === this.#panel.getRootNode()) {
      control.setAttribute("aria-controls", this.#panelId);
      control.dataset.rowanPopoverControls = this.#panelId;
    }
  }

  #syncManagedAttribute(attribute, value, dataKey) {
    const control = this.#triggerControl;
    const currentValue = control.getAttribute(attribute);
    const managedValue = control.dataset[dataKey];

    if (!currentValue) {
      control.setAttribute(attribute, value);
      control.dataset[dataKey] = value;
      return;
    }

    if (managedValue === currentValue) {
      control.setAttribute(attribute, value);
      control.dataset[dataKey] = value;
      return;
    }

    delete control.dataset[dataKey];
  }

  #releaseTriggerControl() {
    const control = this.#triggerControl;
    if (!control) return;

    if (
      this.#managedControlsElement === control &&
      elementReferencesMatch(control, "ariaControlsElements", [this.#panel])
    ) {
      setElementReferences(control, "ariaControlsElements", []);
    }
    this.#managedControlsElement = null;

    const controlsAttribute = control.dataset.rowanPopoverControls;
    if (controlsAttribute === control.getAttribute("aria-controls")) {
      control.removeAttribute("aria-controls");
    }
    delete control.dataset.rowanPopoverControls;

    for (const [attribute, dataKey] of [
      ["aria-expanded", "rowanPopoverExpanded"],
      ["aria-haspopup", "rowanPopoverHasPopup"],
    ]) {
      if (control.dataset[dataKey] === control.getAttribute(attribute)) {
        control.removeAttribute(attribute);
      }
      delete control.dataset[dataKey];
    }

    this.#triggerControl = null;
  }

  #syncDocumentDismissal() {
    if (!this.open) {
      this.#teardownDocumentDismissal();
      this.#hidePanelPopover();
      removeDismissible(this);
      return;
    }

    if (this.#removeDocumentPointerListener) return;
    pushDismissible(this);
    this.#showPanelPopover();
    this.#focusPanel();
    this.#removeDocumentPointerListener = this.listen(document, "pointerdown", (event) => {
      if (!isTopmostOverlay(this)) return;
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this.#panel)) return;
      event.preventDefault();
      event.stopPropagation();
      noteDismissibleClose();
      this.#setOpenFromUser(false);
    });
    this.#removeDocumentKeydownListener = this.listen(document, "keydown", (event) => {
      if (event.key !== keys.ESCAPE || !this.open) return;
      if (!isTopmostOverlay(this)) return;
      event.preventDefault();
      event.stopPropagation();
      noteDismissibleClose();
      this.#setOpenFromUser(false);
      this.#trigger?.focus({ preventScroll: true });
    });
  }

  #teardownDocumentDismissal() {
    this.#removeDocumentPointerListener?.();
    this.#removeDocumentPointerListener = null;
    this.#removeDocumentKeydownListener?.();
    this.#removeDocumentKeydownListener = null;
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
    if (!this.#panel) return;

    const anchor = this.#trigger ?? this;
    const bounds = anchor.getBoundingClientRect();
    const offset = 6;
    this.#panel.style.top = `${Math.round(bounds.bottom + offset)}px`;
    this.#panel.style.left = `${Math.round(bounds.left)}px`;
  }

  #focusPanel() {
    if (!this.#panel) return;

    const first = collectFocusableElements(this.#panel)[0] ?? this.#panel;
    first.focus({ preventScroll: true });
  }

  #handleKeydown(event) {
    if (event.key !== keys.ESCAPE || !this.open) return;
    if (!isTopmostOverlay(this)) return;

    event.preventDefault();
    event.stopPropagation();
    noteDismissibleClose();
    this.#setOpenFromUser(false);
    this.#trigger?.focus({ preventScroll: true });
  }

  #handleFocusOut(event) {
    if (!this.open) return;
    if (this.#containsNode(event.relatedTarget)) return;

    noteDismissibleClose();
    this.#setOpenFromUser(false);
  }

  #containsNode(node) {
    let current = node instanceof Node ? node : null;

    while (current) {
      if (current === this || current === this.#panel || current === this.shadowRoot) return true;
      current = current.parentNode ?? current.host ?? null;
    }

    return false;
  }

  #toggleFromUser() {
    this.#setOpenFromUser(!this.open);
  }

  #setOpenFromUser(open) {
    if (this.open === open) return;

    this.open = open;
    emit(this, "rowan-change", { open });
  }
}

define("rowan-popover", RowanPopover);
