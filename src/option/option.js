import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

function hasAssignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

/**
 * Selectable item for rowan-listbox.
 * @tag rowan-option
 * @attr {string} value
 * @attr {string} label
 * @attr {boolean} selected
 * @attr {boolean} disabled
 * @slot - Option label
 * @slot prefix
 * @slot suffix
 * @csspart option
 * @csspart label
 * @cssprop --rowan-option-fg
 * @cssprop --rowan-option-selected-bg
 */
export class RowanOption extends BaseElement {
  static styleUrl = new URL("./option.css", import.meta.url).href;
  static useElementInternals = true;
  static componentTokenPrefixes = ["--rowan-option-"];
  static observedAttributes = ["value", "label", "selected", "disabled", "tabindex"];
  static upgradeProperties = ["value", "label", "selected", "disabled"];

  #labelSlot = null;
  #labelFallback = null;
  #rovingOwner = null;
  #rovingTabIndex = null;
  #authorTabIndex = null;
  #listboxOwner = null;
  #listboxDisabled = false;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get selected() {
    return this.readBoolean("selected");
  }

  set selected(value) {
    this.reflectBoolean("selected", Boolean(value));
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  /** @internal */
  setRovingTabIndex(value, owner = null) {
    const isClearing = value == null;
    if (isClearing && owner && this.#rovingOwner !== owner) return;

    if (isClearing) {
      if (this.#rovingTabIndex === null && this.#rovingOwner === null) return;

      this.#rovingTabIndex = null;
      this.#rovingOwner = null;
      if (this.#authorTabIndex === null) {
        this.removeAttribute("tabindex");
      } else {
        this.setAttribute("tabindex", this.#authorTabIndex);
      }
      this.#authorTabIndex = null;
      return;
    }

    const next = Number(value) === 0 ? 0 : -1;
    if (this.#rovingOwner !== owner) {
      this.#authorTabIndex = this.getAttribute("tabindex");
    }

    if (this.#rovingTabIndex === next && this.#rovingOwner === owner) return;

    this.#rovingTabIndex = next;
    this.#rovingOwner = owner;
    this.tabIndex = next;
  }

  /** @internal */
  setListboxDisabled(disabled, owner = null) {
    if (!disabled && owner && this.#listboxOwner !== owner) return;

    const next = Boolean(disabled);
    if (this.#listboxDisabled === next && this.#listboxOwner === (next ? owner : null)) return;

    this.#listboxDisabled = next;
    this.#listboxOwner = next ? owner : null;
    this.toggleAttribute("data-rowan-listbox-disabled", next);
    this.requestRender();
  }

  render() {
    if (!this.#labelSlot) {
      this.renderRoot.innerHTML = `
        <span class="option" part="option">
          <span class="prefix"><slot name="prefix"></slot></span>
          <span class="label" part="label"><slot></slot><span class="label-fallback"></span></span>
          <span class="suffix"><slot name="suffix"></slot></span>
        </span>
      `;
      this.#labelSlot = this.renderRoot.querySelector(".label > slot");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
    }

    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = !this.label || hasAssignedContent(this.#labelSlot);
    this.#applyDefaultA11y();
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    const disabled = this.disabled || this.#listboxDisabled;
    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "option";
    }

    if (!this.hasAttribute("aria-selected") && "ariaSelected" in this.internals) {
      this.internals.ariaSelected = this.selected ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
    }
  }
}

define("rowan-option", RowanOption);
