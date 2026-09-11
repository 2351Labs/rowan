import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Individual node within a hierarchical tree.
 * @tag rowan-tree-item
 * @attr {string} value
 * @attr {boolean} expanded
 * @attr {boolean} selected
 * @attr {boolean} disabled
 * @attr {number} level
 * @slot - Item label
 * @slot prefix
 * @slot children - Nested rowan-tree-item nodes
 * @csspart item
 * @csspart toggle
 * @csspart label
 * @csspart children
 * @cssprop --rowan-tree-item-fg
 * @cssprop --rowan-tree-item-hover-bg
 * @cssprop --rowan-tree-item-selected-bg
 * @cssprop --rowan-tree-item-children-border
 */
export class RowanTreeItem extends BaseElement {
  static styleUrl = new URL("./tree-item.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["value", "expanded", "selected", "disabled", "level", "tabindex"];
  static upgradeProperties = ["value", "expanded", "selected", "disabled", "level"];

  #button = null;
  #toggle = null;
  #children = null;
  #childrenSlot = null;
  #rovingTabIndex = null;
  #rovingOwner = null;
  #positionOwner = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get expanded() {
    return this.readBoolean("expanded");
  }

  set expanded(value) {
    this.reflectBoolean("expanded", Boolean(value));
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

  get level() {
    const level = this.readNumber("level", this.#nestedLevel());
    return Math.max(1, Math.floor(level));
  }

  set level(value) {
    const level = Number(value);
    this.reflectNumber("level", Number.isFinite(level) ? Math.max(1, Math.floor(level)) : null);
  }

  get hasChildren() {
    return [...this.children].some(
      (child) =>
        child instanceof HTMLElement &&
        child.localName === "rowan-tree-item" &&
        child.slot === "children",
    );
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

    const next = isClearing ? null : Number(value) === 0 ? 0 : -1;
    const nextOwner = isClearing ? null : owner;
    if (this.#rovingTabIndex === next && this.#rovingOwner === nextOwner) return;

    this.#rovingTabIndex = next;
    this.#rovingOwner = nextOwner;
    if (this.#button) {
      this.#button.tabIndex = this.#resolvedTabIndex();
    }
    this.requestRender();
  }

  /** @internal */
  setTreePosition(position, setSize, owner = null) {
    const isClearing = position == null || setSize == null;
    if (isClearing && owner && this.#positionOwner !== owner) return;

    this.#positionOwner = isClearing ? null : owner;
    if (!this.internals) return;

    if (!this.hasAttribute("aria-posinset") && "ariaPosInSet" in this.internals) {
      this.internals.ariaPosInSet = isClearing ? null : String(position);
    }

    if (!this.hasAttribute("aria-setsize") && "ariaSetSize" in this.internals) {
      this.internals.ariaSetSize = isClearing ? null : String(setSize);
    }
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML = `
        <button class="item" part="item" type="button">
          <span class="toggle" part="toggle" data-tree-action="toggle" aria-hidden="true"></span>
          <span class="prefix"><slot name="prefix"></slot></span>
          <span class="label" part="label"><slot></slot></span>
        </button>
        <div class="children" part="children" role="group">
          <slot name="children"></slot>
        </div>
      `;
      this.#button = this.renderRoot.querySelector("button");
      this.#toggle = this.renderRoot.querySelector(".toggle");
      this.#children = this.renderRoot.querySelector(".children");
      this.#childrenSlot = this.renderRoot.querySelector('slot[name="children"]');
      this.listen(this.#childrenSlot, "slotchange", () => this.requestRender());
    }

    const hasChildren = this.hasChildren;
    const expanded = hasChildren && this.expanded;
    const selected = this.selected ? "true" : "false";

    this.#button.disabled = this.disabled;
    this.#button.tabIndex = this.#resolvedTabIndex();
    this.#button.setAttribute("aria-selected", selected);

    if (hasChildren) {
      this.#button.setAttribute("aria-expanded", expanded ? "true" : "false");
    } else {
      this.#button.removeAttribute("aria-expanded");
    }

    this.#toggle.hidden = !hasChildren;
    this.#children.hidden = !expanded;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "treeitem";
    }

    if (this.internals && !this.hasAttribute("aria-level") && "ariaLevel" in this.internals) {
      this.internals.ariaLevel = String(this.level);
    }

    if (this.internals && !this.hasAttribute("aria-selected") && "ariaSelected" in this.internals) {
      this.internals.ariaSelected = selected;
    }

    if (this.internals && !this.hasAttribute("aria-expanded") && "ariaExpanded" in this.internals) {
      this.internals.ariaExpanded = hasChildren ? String(expanded) : null;
    }

    if (this.internals && !this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }

  #nestedLevel() {
    let level = 1;
    let ancestor = this.parentElement?.closest("rowan-tree-item") ?? null;

    while (ancestor) {
      level += 1;
      ancestor = ancestor.parentElement?.closest("rowan-tree-item") ?? null;
    }

    return level;
  }

  #resolvedTabIndex() {
    return this.#rovingTabIndex ?? (this.hasAttribute("tabindex") ? this.tabIndex : 0);
  }
}

define("rowan-tree-item", RowanTreeItem);
