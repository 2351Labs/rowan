import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanMenuItem } from "../menu-item/menu-item.js";

function isMenuItem(value) {
  return value instanceof RowanMenuItem;
}

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
  #slot = null;
  #focusItem = null;
  #itemObserver = null;
  #managedItems = new Set();
  #removeClickListener = null;
  #removeKeydownListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#removeClickListener) {
      this.#removeClickListener = this.listen(this, "click", (event) => this.#handleClick(event));
    }

    if (!this.#removeKeydownListener) {
      this.#removeKeydownListener = this.listen(this, "keydown", (event) =>
        this.#handleKeydown(event),
      );
    }

    if (!this.#itemObserver && typeof MutationObserver !== "undefined") {
      this.#itemObserver = new MutationObserver(() => this.requestRender());
      this.observe(this.#itemObserver, () => this.#observeItems());
    }

    this.#observeItems();
  }

  disconnectedCallback() {
    this.#clearManagedItems();
    super.disconnectedCallback();
  }

  render() {
    if (!this.#menu) {
      this.renderRoot.innerHTML = `
        <div class="menu" part="menu" role="menu">
          <slot></slot>
        </div>
      `;
      this.#menu = this.renderRoot.querySelector(".menu");
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "menu";
    }

    this.#syncRovingTabIndex(this.#items());
  }

  #observeItems() {
    this.#itemObserver?.observe(this, {
      attributes: true,
      attributeFilter: ["disabled", "hidden", "slot"],
      childList: true,
      subtree: true,
    });
  }

  #items() {
    const directItems = [...this.querySelectorAll("rowan-menu-item")].filter(
      (item) => isMenuItem(item) && item.closest("rowan-menu") === this,
    );
    const slottedItems = this.#slot?.assignedElements({ flatten: true }).filter(isMenuItem) ?? [];
    return [...new Set([...directItems, ...slottedItems])];
  }

  #availableItems(items = this.#items()) {
    return items.filter((item) => !item.disabled && !item.hidden);
  }

  #syncRovingTabIndex(items) {
    const managedItems = new Set(items);
    const available = this.#availableItems(items);

    for (const item of this.#managedItems) {
      if (!managedItems.has(item)) item.setRovingTabIndex(null, this);
    }

    if (!available.includes(this.#focusItem)) {
      this.#focusItem = available[0] ?? null;
    }

    for (const item of items) {
      item.setRovingTabIndex(item === this.#focusItem ? 0 : -1, this);
    }

    this.#managedItems = managedItems;
  }

  #clearManagedItems() {
    for (const item of this.#managedItems) {
      item.setRovingTabIndex(null, this);
    }

    this.#managedItems.clear();
    this.#focusItem = null;
  }

  #handleClick(event) {
    const item = this.#itemFromEvent(event);
    if (!item || item.disabled || item.hidden) return;

    this.#setFocusItem(item);
    emit(this, "rowan-change", {
      value: item.value || item.getAttribute("value") || "",
      item,
    });
  }

  #handleKeydown(event) {
    const items = this.#availableItems();
    const item = this.#itemFromEvent(event) ?? this.#focusItem;
    const index = items.indexOf(item);
    if (index === -1) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      event.stopPropagation();
      this.#setFocusItem(items[(index + 1) % items.length]);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      event.stopPropagation();
      this.#setFocusItem(items[(index - 1 + items.length) % items.length]);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      event.stopPropagation();
      this.#setFocusItem(items[0]);
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      event.stopPropagation();
      this.#setFocusItem(items.at(-1));
      return;
    }

    if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      event.stopPropagation();
      item.activate();
    }
  }

  #setFocusItem(item) {
    if (!item) return;

    this.#focusItem = item;
    this.#syncRovingTabIndex(this.#items());
    item.focus({ preventScroll: true });
  }

  #itemFromEvent(event) {
    const items = this.#items();
    return (
      event.composedPath().find((node) => node instanceof RowanMenuItem && items.includes(node)) ??
      null
    );
  }
}

define("rowan-menu", RowanMenu);
