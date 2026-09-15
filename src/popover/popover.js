import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

let popoverId = 0;

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
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the popover
 */
export class RowanPopover extends BaseElement {
  static styleUrl = new URL("./popover.css", import.meta.url).href;
  static observedAttributes = ["open", "label"];
  static upgradeProperties = ["open", "label"];

  #triggerContainer = null;
  #triggerSlot = null;
  #panel = null;
  #trigger = null;
  #triggerControl = null;
  #panelId = "";
  #removeTriggerClickListener = null;
  #removeDocumentPointerListener = null;
  #managedControlsElement = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#panelId) {
      popoverId += 1;
      this.#panelId = `rowan-popover-${popoverId}-panel`;
    }
  }

  disconnectedCallback() {
    this.#removeDocumentPointerListener?.();
    this.#removeDocumentPointerListener = null;
    this.#releaseTrigger();
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
    }

    this.#panel.id = this.#panelId;
    this.#panel.setAttribute("aria-label", this.label);
    this.#panel.hidden = !this.open;
    this.#syncTrigger();
    this.#syncDocumentDismissal();
  }

  #syncTrigger() {
    const trigger =
      this.#triggerSlot.assignedElements({ flatten: true }).find(isHTMLElement) ?? null;
    if (trigger !== this.#trigger) {
      this.#releaseTrigger();
      this.#trigger = trigger;
      if (trigger) {
        this.#removeTriggerClickListener = this.listen(trigger, "click", () =>
          this.#toggleFromUser(),
        );
      }
    }

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
      this.#removeDocumentPointerListener?.();
      this.#removeDocumentPointerListener = null;
      return;
    }

    if (this.#removeDocumentPointerListener) return;
    this.#removeDocumentPointerListener = this.listen(document, "pointerdown", (event) => {
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this.#panel)) return;
      this.#setOpenFromUser(false);
    });
  }

  #handleKeydown(event) {
    if (event.key !== keys.ESCAPE || !this.open) return;

    event.preventDefault();
    this.#setOpenFromUser(false);
    this.#trigger?.focus({ preventScroll: true });
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
