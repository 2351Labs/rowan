import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Menu container for action lists.
 * @tag rowan-menu
 * @slot - Menu items
 * @csspart menu
 * @event rowan-change - Fired when a menu item is selected
 */
export class RowanMenu extends BaseElement {
  static styleUrl = new URL("./menu.css", import.meta.url).href;
  static useElementInternals = true;

  #menu = null;
  #removeClickListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#removeClickListener) return;

    this.#removeClickListener = this.listen(this, "click", (event) => {
      const path = event.composedPath();
      const selected = path.find(
        (node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-menu-item",
      );

      if (!selected) return;

      emit(this, "rowan-change", {
        value: selected.value || selected.getAttribute("value") || "",
        item: selected,
      });
    });
  }

  render() {
    if (!this.#menu) {
      this.renderRoot.innerHTML = `
        <div class="menu" part="menu">
          <slot></slot>
        </div>
      `;

      this.#menu = this.renderRoot.querySelector(".menu");
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "menu";
    }
  }
}

define("rowan-menu", RowanMenu);
