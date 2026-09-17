import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Content panel for a tab.
 * @tag rowan-tab-panel
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Panel content
 * @csspart panel
 */
export class RowanTabPanel extends BaseElement {
  static styleUrl = new URL("./tab-panel.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "active", "aria-hidden", "aria-labelledby"];
  static upgradeProperties = ["value", "active"];

  #panel = null;
  #tab = null;
  #tabOwner = null;
  #inertByComponent = false;

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

  /** @internal */
  setTab(tab, owner = null) {
    const isClearing = tab == null;
    if (isClearing && owner && this.#tabOwner !== owner) return;

    const nextTab = tab instanceof HTMLElement ? tab : null;
    const nextOwner = isClearing ? null : owner;
    if (this.#tab === nextTab && this.#tabOwner === nextOwner) return;

    this.#tab = nextTab;
    this.#tabOwner = nextOwner;
    this.requestRender();
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = '<section class="panel" part="panel"><slot></slot></section>';
      this.#panel = this.renderRoot.querySelector(".panel");
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tabpanel";
    }

    if (this.internals && "ariaLabelledByElements" in this.internals) {
      this.internals.ariaLabelledByElements =
        !this.hasAttribute("role") && !this.hasAttribute("aria-labelledby") && this.#tab
          ? [this.#tab]
          : [];
    }

    if (!this.hasAttribute("aria-hidden") && "ariaHidden" in this.internals) {
      this.internals.ariaHidden = this.active ? "false" : "true";
    }

    this.#panel.removeAttribute("role");
    this.#panel.removeAttribute("aria-label");

    if (this.internals && !this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.#tab?.textContent?.trim() || "Tab panel";
    }
    this.#panel.hidden = !this.active;
    this.#syncInertState();
  }

  #syncInertState() {
    if (!this.active) {
      if (!this.inert) {
        this.inert = true;
        this.#inertByComponent = true;
      }
      return;
    }

    if (this.#inertByComponent) {
      this.inert = false;
      this.#inertByComponent = false;
    }
  }
}

define("rowan-tab-panel", RowanTabPanel);
