import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Single tab button.
 * @tag rowan-tab
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Label
 * @csspart tab
 */
export class RowanTab extends BaseElement {
  static styleUrl = new URL("./tab.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["value", "active", "aria-controls", "aria-selected"];
  static upgradeProperties = ["value", "active"];

  #button = null;
  #rovingTabIndex = null;
  #rovingOwner = null;
  #panel = null;
  #panelOwner = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get active() {
    return this.readBoolean("active");
  }

  set active(value) {
    this.reflectBoolean("active", Boolean(value));
  }

  focus(options) {
    if (this.#button) {
      this.#button.focus(options);
      return;
    }

    super.focus(options);
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

  /** @internal */
  setPanel(panel, owner = null) {
    const isClearing = panel == null;
    if (isClearing && owner && this.#panelOwner !== owner) return;

    const nextPanel = panel instanceof HTMLElement ? panel : null;
    const nextOwner = isClearing ? null : owner;
    if (this.#panel === nextPanel && this.#panelOwner === nextOwner) return;

    this.#panel = nextPanel;
    this.#panelOwner = nextOwner;
    this.requestRender();
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML =
        '<button class="tab" part="tab" type="button"><slot></slot></button>';
      this.#button = this.renderRoot.querySelector("button");
    }

    const selected = this.active ? "true" : "false";

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tab";
    }

    if (
      this.internals &&
      !this.hasAttribute("role") &&
      !this.hasAttribute("aria-selected") &&
      "ariaSelected" in this.internals
    ) {
      this.internals.ariaSelected = selected;
    }

    if (this.internals && "ariaControlsElements" in this.internals) {
      this.internals.ariaControlsElements =
        !this.hasAttribute("role") && !this.hasAttribute("aria-controls") && this.#panel
          ? [this.#panel]
          : [];
    }

    this.#button.removeAttribute("aria-selected");
    this.#button.setAttribute("role", "presentation");
    this.#button.tabIndex = this.#resolvedTabIndex();
  }

  #resolvedTabIndex() {
    return this.#rovingTabIndex ?? (this.active ? 0 : -1);
  }
}

define("rowan-tab", RowanTab);
