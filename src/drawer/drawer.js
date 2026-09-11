import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @slot - Drawer content
 * @slot title
 * @csspart backdrop
 * @csspart panel
 * @event rowan-change - Fired when open changes
 */
export class RowanDrawer extends BaseElement {
  static styleUrl = new URL("./drawer.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["open", "side"];
  static upgradeProperties = ["open", "side"];

  #backdrop = null;
  #closeButton = null;
  #removeClickListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#removeClickListener) return;

    this.#removeClickListener = this.listen(this, "click", (event) => {
      const path = event.composedPath();
      if (path.includes(this.#backdrop) || path.includes(this.#closeButton)) {
        this.open = false;
        emit(this, "rowan-change", { open: this.open });
      }
    });
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get side() {
    return this.readString("side", "start");
  }

  set side(value) {
    const next = value === "end" ? "end" : "start";
    this.reflectString("side", next);
  }

  render() {
    if (!this.#backdrop) {
      this.renderRoot.innerHTML = `
        <div class="backdrop" part="backdrop" aria-hidden="true"></div>
        <aside class="panel" part="panel">
          <header class="header">
            <slot name="title"></slot>
            <button type="button" class="close">Close</button>
          </header>
          <div class="content"><slot></slot></div>
        </aside>
      `;

      this.#backdrop = this.renderRoot.querySelector(".backdrop");
      this.#closeButton = this.renderRoot.querySelector(".close");
    }

    this.#applyDefaultA11y();

    this.renderRoot.querySelector(".backdrop").hidden = !this.open;
    this.renderRoot.querySelector(".panel").hidden = !this.open;
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "dialog";
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = "true";
    }
  }
}

define("rowan-drawer", RowanDrawer);
