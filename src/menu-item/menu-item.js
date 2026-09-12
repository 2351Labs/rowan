import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Selectable menu item.
 * @tag rowan-menu-item
 * @attr {string} value
 * @attr {boolean} disabled
 * @slot - Item label
 * @csspart item
 */
export class RowanMenuItem extends BaseElement {
  static styleUrl = new URL("./menu-item.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["value", "disabled", "tabindex"];
  static upgradeProperties = ["value", "disabled"];

  #button = null;
  #rovingTabIndex = null;
  #rovingOwner = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  focus(options) {
    if (this.#button) {
      this.#button.focus(options);
      return;
    }

    super.focus(options);
  }

  /** @internal */
  activate() {
    if (!this.disabled) this.#button?.click();
  }

  /** @internal */
  setRovingTabIndex(value, owner = null) {
    const isClearing = value == null;
    if (isClearing && owner && this.#rovingOwner !== owner) return;

    const nextTabIndex = isClearing ? null : Number(value) === 0 ? 0 : -1;
    const nextOwner = isClearing ? null : owner;
    if (this.#rovingTabIndex === nextTabIndex && this.#rovingOwner === nextOwner) return;

    this.#rovingTabIndex = nextTabIndex;
    this.#rovingOwner = nextOwner;
    if (this.#button) this.#button.tabIndex = this.#resolvedTabIndex();
    this.requestRender();
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML =
        '<button class="item" part="item" type="button"><slot></slot></button>';
      this.#button = this.renderRoot.querySelector("button");
    }

    this.#button.disabled = this.disabled;
    this.#button.tabIndex = this.#resolvedTabIndex();

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "menuitem";
    }
  }

  #resolvedTabIndex() {
    if (this.disabled) return -1;
    return this.#rovingTabIndex ?? (this.hasAttribute("tabindex") ? this.tabIndex : 0);
  }
}

define("rowan-menu-item", RowanMenuItem);
