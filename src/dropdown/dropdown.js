import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

import "../button/button.js";

let dropdownId = 0;

/**
 * Triggered dropdown surface.
 * @tag rowan-dropdown
 * @attr {boolean} open
 * @attr {string} label
 * @slot - Dropdown content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the dropdown
 */
export class RowanDropdown extends BaseElement {
  static styleUrl = new URL("./dropdown.css", import.meta.url).href;
  static observedAttributes = ["open", "label"];
  static upgradeProperties = ["open", "label"];

  #trigger = null;
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
    if (!this.#trigger) {
      this.renderRoot.innerHTML = `
        <rowan-button class="trigger" part="trigger" variant="secondary" size="sm"></rowan-button>
        <section class="panel" part="panel"><slot></slot></section>
      `;

      this.#trigger = this.renderRoot.querySelector("rowan-button");
      this.#panel = this.renderRoot.querySelector(".panel");

      this.listen(this.#trigger, "rowan-click", () => this.#setOpenFromUser(!this.open));
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
    }

    this.#trigger.textContent = this.label;
    this.#trigger.setAttribute("aria-controls", this.#panelId);
    this.#trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.#trigger.setAttribute("aria-haspopup", "menu");
    this.#panel.id = this.#panelId;
    this.#panel.hidden = !this.open;
    this.#panel.setAttribute("aria-hidden", this.open ? "false" : "true");
    this.#syncDocumentDismissal();
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
    this.#trigger.focus({ preventScroll: true });
  }

  #setOpenFromUser(open) {
    if (this.open === open) return;

    this.open = open;
    emit(this, "rowan-change", { open });
  }
}

define("rowan-dropdown", RowanDropdown);
