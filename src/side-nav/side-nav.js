import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanSideNavItem } from "../side-nav-item/side-nav-item.js";

function isSideNavItem(value) {
  return value instanceof RowanSideNavItem;
}

/**
 * Application navigation controller for rowan-side-nav-item children.
 * @tag rowan-side-nav
 * @attr {string} label
 * @attr {string} value
 * @slot - rowan-side-nav-item nodes
 * @csspart nav
 * @cssprop --rowan-side-nav-gap
 * @event rowan-change - Fired when a user activates a different navigation item.
 */
export class RowanSideNav extends BaseElement {
  static styleUrl = new URL("./side-nav.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-side-nav-"];
  static observedAttributes = ["label", "value"];
  static upgradeProperties = ["label", "value"];

  #nav = null;
  #slot = null;
  #activeItem = null;
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

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  /** @returns {RowanSideNavItem | null} */
  get activeItem() {
    return this.#activeItem;
  }

  render() {
    if (!this.#nav) {
      this.renderRoot.innerHTML = '<nav class="nav" part="nav"><slot></slot></nav>';
      this.#nav = this.renderRoot.querySelector("nav");
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
    }

    this.#nav.setAttribute("aria-label", this.label || "Navigation");

    const items = this.#items();
    this.#syncActiveItem(items);
    this.#syncRovingTabIndex(items);
  }

  #observeItems() {
    this.#itemObserver?.observe(this, {
      attributes: true,
      attributeFilter: ["active", "disabled", "hidden", "slot", "value"],
      childList: true,
      subtree: true,
    });
  }

  #items() {
    return [...this.querySelectorAll("rowan-side-nav-item")].filter(
      (item) => isSideNavItem(item) && item.closest("rowan-side-nav") === this,
    );
  }

  #syncActiveItem(items) {
    const requested = this.value;
    const requestedItem = requested ? items.find((item) => item.value === requested) : null;
    const declaredItem = items.find((item) => item.active) ?? null;
    const next = requestedItem ?? (requested ? null : declaredItem);

    this.#activeItem = next;

    for (const item of items) {
      const active = item === next;
      if (item.active !== active) item.active = active;
    }

    if (!requested && next?.value) this.reflectString("value", next.value);
  }

  #syncRovingTabIndex(items) {
    const managedItems = new Set(items);
    const available = items.filter((item) => !item.disabled && !item.hidden);

    if (!available.includes(this.#focusItem)) {
      this.#focusItem =
        available.find((item) => item === this.#activeItem) ?? available.at(0) ?? null;
    }

    for (const item of this.#managedItems) {
      if (!managedItems.has(item)) item.setRovingTabIndex(null, this);
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
    if (!item) return;

    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.#activateItem(item);
  }

  #handleKeydown(event) {
    const item = this.#itemFromEvent(event);
    if (!item || item.disabled) return;

    const items = this.#items().filter((candidate) => !candidate.disabled && !candidate.hidden);
    const index = items.indexOf(item);
    if (index === -1) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      this.#focusItemAt(items, index, 1);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      this.#focusItemAt(items, index, -1);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      this.#setFocusItem(items.at(0));
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      this.#setFocusItem(items.at(-1));
      return;
    }

    if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      item.activate();
    }
  }

  #itemFromEvent(event) {
    const item = event
      .composedPath()
      .find((node) => node instanceof RowanSideNavItem && node.closest("rowan-side-nav") === this);
    return item ?? null;
  }

  #activateItem(item) {
    const previousValue = this.value;
    const changed = this.#activeItem !== item || previousValue !== item.value;

    this.#activeItem = item;
    this.#focusItem = item;
    this.reflectString("value", item.value || null);
    this.#syncActiveItem(this.#items());
    this.#syncRovingTabIndex(this.#items());

    if (!changed) return;

    emit(this, "rowan-change", {
      value: item.value,
      previousValue,
      item,
    });
  }

  #focusItemAt(items, index, direction) {
    const next = items[index + direction];
    if (next) this.#setFocusItem(next);
  }

  #setFocusItem(item) {
    if (!item) return;

    if (item !== this.#focusItem) {
      this.#focusItem = item;
      this.#syncRovingTabIndex(this.#items());
    }
    item.focus({ preventScroll: true });
  }
}

define("rowan-side-nav", RowanSideNav);
