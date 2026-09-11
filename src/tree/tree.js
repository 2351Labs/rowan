import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanTreeItem } from "../tree-item/tree-item.js";

const SELECTION_MODES = new Set(["none", "single", "multiple"]);

/** @typedef {"none" | "single" | "multiple"} RowanTreeSelection */

function isTreeItem(value) {
  return value instanceof RowanTreeItem;
}

/**
 * Hierarchical navigation controller for rowan-tree-item nodes.
 * @tag rowan-tree
 * @attr {string} label
 * @attr {"none"|"single"|"multiple"} selection
 * @property {string[]} selected - Selected item values. Arrays are property-only.
 * @slot - Direct rowan-tree-item nodes
 * @csspart tree
 * @cssprop --rowan-tree-fg
 * @event rowan-change - Fired when a user changes the selection
 * @event rowan-toggle - Fired when a user expands or collapses an item
 */
export class RowanTree extends BaseElement {
  static styleUrl = new URL("./tree.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["label", "selection"];
  static upgradeProperties = ["label", "selection", "selected"];

  #tree = null;
  #slot = null;
  #selected = null;
  #activeItem = null;
  #itemObserver = null;
  #removeClickListener = null;
  #removeKeydownListener = null;
  #managedItems = new Set();

  connectedCallback() {
    super.connectedCallback();

    if (!this.#removeClickListener) {
      this.#removeClickListener = this.listen(this, "click", (event) => {
        this.#handleClick(event);
      });
    }

    if (!this.#removeKeydownListener) {
      this.#removeKeydownListener = this.listen(this, "keydown", (event) => {
        this.#handleKeydown(event);
      });
    }

    if (!this.#itemObserver) {
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

  /** @returns {RowanTreeSelection} */
  get selection() {
    const selection = this.readString("selection", "single");
    return SELECTION_MODES.has(selection) ? selection : "single";
  }

  /** @param {RowanTreeSelection} value */
  set selection(value) {
    const selection = SELECTION_MODES.has(value) ? value : "single";
    this.reflectString("selection", selection === "single" ? null : selection);
  }

  /** @returns {string[]} */
  get selected() {
    return [...this.#selectionValues(this.#items())];
  }

  /** @param {string[]} value */
  set selected(value) {
    this.#selected = new Set(Array.isArray(value) ? value.map((item) => String(item)) : []);
    this.requestRender();
  }

  /** @returns {HTMLElement[]} */
  get selectedItems() {
    const selected = this.#selectionValues(this.#items());
    return this.#items().filter((item) => selected.has(item.value));
  }

  clearSelection() {
    if (this.#selected?.size === 0 && this.#selectionValues(this.#items()).size === 0) return;

    this.#selected = new Set();
    this.requestRender();
  }

  render() {
    if (!this.#tree) {
      this.renderRoot.innerHTML = '<div class="tree" part="tree"><slot></slot></div>';
      this.#tree = this.renderRoot.querySelector(".tree");
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tree";
    }

    if (this.internals && !this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
    }

    if (
      this.internals &&
      !this.hasAttribute("aria-multiselectable") &&
      "ariaMultiSelectable" in this.internals
    ) {
      this.internals.ariaMultiSelectable = this.selection === "multiple" ? "true" : "false";
    }

    const items = this.#items();
    this.#syncSelection(items);
    this.#syncRovingTabIndex(items);
    this.#syncTreeItemPositions(items);
  }

  #observeItems() {
    this.#itemObserver?.observe(this, {
      attributes: true,
      attributeFilter: ["disabled", "expanded", "hidden", "selected", "slot", "value"],
      childList: true,
      subtree: true,
    });
  }

  #items() {
    return [...this.querySelectorAll("rowan-tree-item")].filter(
      (item) => isTreeItem(item) && item.closest("rowan-tree") === this,
    );
  }

  #selectionValues(items) {
    if (this.selection === "none") return new Set();

    const requested =
      this.#selected ?? new Set(items.filter((item) => item.selected).map((item) => item.value));
    const selected = new Set(
      items.map((item) => item.value).filter((value) => requested.has(value)),
    );

    if (this.selection !== "single" || selected.size < 2) return selected;

    const first = items.find((item) => selected.has(item.value));
    return first ? new Set([first.value]) : new Set();
  }

  #syncSelection(items) {
    const selected = this.#selectionValues(items);

    for (const item of items) {
      const isSelected = selected.has(item.value);
      if (item.selected !== isSelected) item.selected = isSelected;
    }
  }

  #visibleItems(items) {
    return items.filter((item) => {
      if (item.hidden) return false;

      let parent = this.#parentItem(item);
      while (parent) {
        if (parent.hidden || !parent.expanded) return false;
        parent = this.#parentItem(parent);
      }

      return true;
    });
  }

  #syncRovingTabIndex(items) {
    const managedItems = new Set(items);
    const visibleItems = this.#visibleItems(items);
    if (!visibleItems.includes(this.#activeItem) || this.#activeItem?.disabled) {
      this.#activeItem =
        visibleItems.find((item) => item.selected && !item.disabled) ??
        visibleItems.find((item) => !item.disabled) ??
        null;
    }

    for (const item of this.#managedItems) {
      if (!managedItems.has(item)) {
        item.setRovingTabIndex(null, this);
        item.setTreePosition(null, null, this);
      }
    }

    for (const item of items) {
      item.setRovingTabIndex(item === this.#activeItem ? 0 : -1, this);
    }

    this.#managedItems = managedItems;
  }

  #syncTreeItemPositions(items) {
    const rootItems = items.filter((item) => !this.#parentItem(item) && !item.hidden);

    for (const item of items) {
      if (item.hidden) {
        item.setTreePosition(null, null, this);
        continue;
      }

      const parent = this.#parentItem(item);
      const siblings = parent
        ? this.#childItems(parent).filter((candidate) => !candidate.hidden)
        : rootItems;
      const position = siblings.indexOf(item);

      item.setTreePosition(position === -1 ? null : position + 1, siblings.length || null, this);
    }
  }

  #clearManagedItems() {
    for (const item of this.#managedItems) {
      item.setRovingTabIndex(null, this);
      item.setTreePosition(null, null, this);
    }

    this.#managedItems.clear();
  }

  #handleClick(event) {
    const item = this.#itemFromEvent(event);
    if (!item || item.disabled) return;

    this.#activeItem = item;
    this.#syncRovingTabIndex(this.#items());

    if (this.#hasAction(event, "toggle")) {
      this.#setExpanded(item, !item.expanded);
      return;
    }

    this.#selectItem(item);
  }

  #handleKeydown(event) {
    const item = this.#itemFromEvent(event);
    if (!item || item.disabled) return;

    const items = this.#items();
    const visibleItems = this.#visibleItems(items);
    const index = visibleItems.indexOf(item);
    if (index === -1) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      const next = this.#nextEnabledItem(visibleItems, index, 1);
      if (!next) return;
      this.#focusItem(next, items);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      const previous = this.#nextEnabledItem(visibleItems, index, -1);
      if (!previous) return;
      this.#focusItem(previous, items);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      const first = visibleItems.find((candidate) => !candidate.disabled);
      if (!first || first === item) return;
      this.#focusItem(first, items);
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      const last = [...visibleItems].reverse().find((candidate) => !candidate.disabled);
      if (!last || last === item) return;
      this.#focusItem(last, items);
      return;
    }

    if (event.key === keys.ARROW_RIGHT) {
      event.preventDefault();
      if (item.hasChildren && !item.expanded) {
        this.#setExpanded(item, true);
        return;
      }

      const child = this.#childItems(item).find((candidate) => !candidate.disabled);
      if (!child || !item.expanded) return;
      this.#focusItem(child, items);
      return;
    }

    if (event.key === keys.ARROW_LEFT) {
      event.preventDefault();
      if (item.hasChildren && item.expanded) {
        this.#setExpanded(item, false);
        return;
      }

      const parent = this.#parentItem(item);
      if (!parent) return;
      this.#focusItem(parent, items);
      return;
    }

    if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      this.#selectItem(item);
    }
  }

  #selectItem(item) {
    if (this.selection === "none") return;

    const items = this.#items();
    const current = this.#selectionValues(items);
    let selected;

    if (this.selection === "single") {
      if (current.size === 1 && current.has(item.value)) return;
      selected = new Set([item.value]);
    } else {
      selected = new Set(current);
      if (selected.has(item.value)) {
        selected.delete(item.value);
      } else {
        selected.add(item.value);
      }
    }

    this.#selected = selected;
    this.#syncSelection(items);
    this.#syncRovingTabIndex(items);
    emit(this, "rowan-change", {
      value: item.value,
      selected: this.selected,
      item,
      selectedItems: this.selectedItems,
    });
  }

  #setExpanded(item, expanded) {
    if (!item.hasChildren || item.expanded === expanded) return;

    item.expanded = expanded;
    if (!expanded && this.#activeItem && this.#isDescendant(this.#activeItem, item)) {
      this.#activeItem = item;
    }

    this.requestRender();
    emit(this, "rowan-toggle", {
      value: item.value,
      expanded,
      item,
    });
  }

  #focusItem(item, items) {
    this.#activeItem = item;
    this.#syncRovingTabIndex(items);
    item.focus({ preventScroll: true });
  }

  #nextEnabledItem(items, index, direction) {
    for (
      let candidateIndex = index + direction;
      candidateIndex >= 0 && candidateIndex < items.length;
      candidateIndex += direction
    ) {
      if (!items[candidateIndex].disabled) return items[candidateIndex];
    }

    return null;
  }

  #childItems(item) {
    return [...item.children].filter(
      (child) =>
        isTreeItem(child) && child.slot === "children" && child.closest("rowan-tree") === this,
    );
  }

  #parentItem(item) {
    let parent = item.parentElement;

    while (parent && parent !== this) {
      if (isTreeItem(parent) && parent.closest("rowan-tree") === this) {
        return parent;
      }
      parent = parent.parentElement;
    }

    return null;
  }

  #isDescendant(item, ancestor) {
    let parent = this.#parentItem(item);

    while (parent) {
      if (parent === ancestor) return true;
      parent = this.#parentItem(parent);
    }

    return false;
  }

  #itemFromEvent(event) {
    return event
      .composedPath()
      .find((node) => isTreeItem(node) && node.closest("rowan-tree") === this);
  }

  #hasAction(event, action) {
    return event
      .composedPath()
      .some((node) => node instanceof HTMLElement && node.dataset.treeAction === action);
  }
}

define("rowan-tree", RowanTree);
