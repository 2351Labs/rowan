import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { RowanMenuItem } from "../menu-item/menu-item.js";

import "../menu/menu.js";

let contextMenuId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function isElement(value) {
  return value instanceof HTMLElement;
}

function isKeyboardInvocation(event) {
  return (
    event.key === "ContextMenu" ||
    (event.key === "F10" && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey)
  );
}

/**
 * Contextual action menu bound to an element by property or identifier.
 * @tag rowan-context-menu
 * @attr {boolean} open
 * @attr {string} for
 * @attr {string} label
 * @slot - rowan-menu-item actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart menu
 * @cssprop --rowan-context-menu-z-index
 * @cssprop --rowan-context-menu-offset
 * @event rowan-change - Fired when the user selects a contextual action
 * @event rowan-close - Fired when the user dismisses the menu
 */
export class RowanContextMenu extends BaseElement {
  static styleUrl = new URL("./context-menu.css", import.meta.url).href;
  static observedAttributes = ["open", "for", "label"];
  static upgradeProperties = ["open", "forTarget", "target", "label"];
  static componentTokenPrefixes = ["--rowan-context-menu-"];

  #targetOverride = null;
  #boundTarget = null;
  #targetCleanup = null;
  #overlay = null;
  #backdrop = null;
  #panel = null;
  #menu = null;
  #itemsSlot = null;
  #managedItems = new Set();
  #focusItem = null;
  #lastFocused = null;
  #isOpen = false;
  #position = null;
  #menuId = "";

  #handleTargetContextMenu = (event) => {
    event.preventDefault();
    this.#rememberFocus(event.target);
    this.#showAt(event.clientX, event.clientY);
  };

  #handleTargetKeydown = (event) => {
    if (!isKeyboardInvocation(event)) return;

    event.preventDefault();
    this.#rememberFocus(event.currentTarget);
    const bounds = this.#boundTarget?.getBoundingClientRect();
    this.#showAt(bounds?.left ?? 0, bounds?.bottom ?? 0);
  };

  connectedCallback() {
    super.connectedCallback();

    if (!this.#menuId) {
      contextMenuId += 1;
      this.#menuId = `rowan-context-menu-${contextMenuId}`;
    }

    this.#syncTarget();
  }

  disconnectedCallback() {
    this.#unbindTarget();
    this.#releaseManagedItems();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "for" && oldValue !== newValue) this.#syncTarget();
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get forTarget() {
    return this.readString("for", "");
  }

  set forTarget(value) {
    this.reflectString("for", normalizeText(value) || null);
  }

  get target() {
    return this.#targetOverride ?? this.#boundTarget;
  }

  set target(value) {
    this.#targetOverride = isElement(value) ? value : null;
    this.#syncTarget();
  }

  get label() {
    return this.readString("label", "Context menu");
  }

  set label(value) {
    const nextLabel = normalizeText(value);
    this.reflectString("label", nextLabel && nextLabel !== "Context menu" ? nextLabel : null);
  }

  showAt(x, y) {
    this.#position = this.#normalizedPosition(x, y);
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  refresh() {
    this.#syncTarget();
    this.requestRender();
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <div class="overlay" part="overlay" hidden>
          <div class="backdrop" part="backdrop"></div>
          <section class="panel" part="panel">
            <rowan-menu class="menu" part="menu"><slot></slot></rowan-menu>
          </section>
        </div>
      `;

      this.#overlay = this.renderRoot.querySelector(".overlay");
      this.#backdrop = this.renderRoot.querySelector(".backdrop");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#menu = this.renderRoot.querySelector("rowan-menu");
      this.#itemsSlot = this.renderRoot.querySelector("slot");

      this.listen(this.#overlay, "click", (event) => this.#handleOverlayClick(event));
      this.listen(this.#overlay, "keydown", (event) => this.#handleMenuKeydown(event));
      this.listen(this.#menu, "rowan-change", (event) => this.#handleMenuChange(event));
      this.listen(this.#itemsSlot, "slotchange", () => this.#syncMenuItems());
    }

    this.#syncTarget();
    this.#menu.id = this.#menuId;
    this.#menu.setAttribute("aria-label", this.label);
    this.#syncOpenState();
  }

  #syncTarget() {
    if (!this.isConnected) return;

    const nextTarget = this.#targetOverride ?? this.#resolveForTarget();
    if (nextTarget === this.#boundTarget) return;

    this.#unbindTarget();
    this.#boundTarget = nextTarget;

    if (!this.#boundTarget) return;

    const controller = new AbortController();
    this.#targetCleanup = () => controller.abort();
    this.#boundTarget.addEventListener("contextmenu", this.#handleTargetContextMenu, {
      signal: controller.signal,
    });
    this.#boundTarget.addEventListener("keydown", this.#handleTargetKeydown, {
      signal: controller.signal,
    });
  }

  #resolveForTarget() {
    const targetId = this.forTarget;
    if (!targetId) return null;

    return this.ownerDocument?.getElementById(targetId) ?? null;
  }

  #unbindTarget() {
    this.#targetCleanup?.();
    this.#targetCleanup = null;
    this.#boundTarget = null;
  }

  #showAt(x, y) {
    this.#position = this.#normalizedPosition(x, y);
    this.open = true;
  }

  #normalizedPosition(x, y) {
    return {
      x: Number.isFinite(Number(x)) ? Number(x) : 0,
      y: Number.isFinite(Number(y)) ? Number(y) : 0,
    };
  }

  #syncOpenState() {
    if (this.open === this.#isOpen) return;

    this.#isOpen = this.open;
    this.#overlay.hidden = !this.open;

    if (this.open) {
      if (!this.#position) {
        const bounds = this.#boundTarget?.getBoundingClientRect();
        this.#position = this.#normalizedPosition(bounds?.left ?? 0, bounds?.bottom ?? 0);
      }

      queueMicrotask(() => {
        if (!this.open) return;
        this.#positionPanel();
        this.#syncMenuItems();
        this.#setFocusItem(this.#focusItem ?? this.#availableItems()[0]);
      });
      return;
    }

    this.#releaseManagedItems();
    this.#restoreFocus();
  }

  #positionPanel() {
    const offset = this.#readOffset();
    const bounds = this.#panel.getBoundingClientRect();
    const isPositioned = getComputedStyle(this.#panel).position === "fixed";
    const canClampHorizontally = isPositioned && window.innerWidth > 0 && bounds.width > 0;
    const canClampVertically = isPositioned && window.innerHeight > 0 && bounds.height > 0;
    const maxLeft = Math.max(offset, window.innerWidth - bounds.width - offset);
    const maxTop = Math.max(offset, window.innerHeight - bounds.height - offset);
    const left = canClampHorizontally
      ? Math.min(Math.max(offset, this.#position.x), maxLeft)
      : this.#position.x;
    const top = canClampVertically
      ? Math.min(Math.max(offset, this.#position.y), maxTop)
      : this.#position.y;

    this.#panel.style.setProperty("--rowan-context-menu-x", `${left}px`);
    this.#panel.style.setProperty("--rowan-context-menu-y", `${top}px`);
  }

  #readOffset() {
    const value = Number.parseFloat(
      getComputedStyle(this).getPropertyValue("--rowan-context-menu-offset"),
    );
    return Number.isFinite(value) ? value : 8;
  }

  #handleOverlayClick(event) {
    if (event.composedPath().includes(this.#panel)) return;
    this.#requestUserClose("outside-click");
  }

  #handleMenuKeydown(event) {
    const items = this.#availableItems();
    const currentItem = this.#itemFromEvent(event) ?? this.#focusItem;
    const currentIndex = items.indexOf(currentItem);

    if (event.key === "Escape") {
      event.preventDefault();
      this.#requestUserClose("escape");
      return;
    }

    if (items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.#setFocusItem(items[(currentIndex + 1 + items.length) % items.length]);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.#setFocusItem(items[(currentIndex - 1 + items.length) % items.length]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      this.#setFocusItem(items[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      this.#setFocusItem(items.at(-1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      currentItem?.activate();
    }
  }

  #handleMenuChange(event) {
    const { item, value = "" } = event.detail ?? {};
    if (!(item instanceof RowanMenuItem) || item.closest("rowan-context-menu") !== this) return;

    event.stopPropagation();
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-change", { value, item });
  }

  #requestUserClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", { reason });
  }

  #availableItems() {
    return [...this.querySelectorAll("rowan-menu-item")].filter(
      (item) =>
        item instanceof RowanMenuItem &&
        item.closest("rowan-context-menu") === this &&
        !item.hidden &&
        !item.disabled,
    );
  }

  #syncMenuItems() {
    if (!this.open) return;

    const items = this.#availableItems();
    const nextItems = new Set(items);
    for (const item of this.#managedItems) {
      if (!nextItems.has(item)) item.setRovingTabIndex(null, this);
    }

    if (!items.includes(this.#focusItem)) this.#focusItem = items[0] ?? null;
    for (const item of items) {
      item.setRovingTabIndex(item === this.#focusItem ? 0 : -1, this);
    }

    this.#managedItems = nextItems;
  }

  #releaseManagedItems() {
    for (const item of this.#managedItems) {
      item.setRovingTabIndex(null, this);
    }

    this.#managedItems.clear();
    this.#focusItem = null;
  }

  #setFocusItem(item) {
    if (!item) return;

    this.#focusItem = item;
    this.#syncMenuItems();
    item.focus({ preventScroll: true });
  }

  #itemFromEvent(event) {
    return (
      event
        .composedPath()
        .find(
          (node) => node instanceof RowanMenuItem && node.closest("rowan-context-menu") === this,
        ) ?? null
    );
  }

  #rememberFocus(target) {
    const activeElement = this.ownerDocument?.activeElement;
    this.#lastFocused =
      isElement(activeElement) && activeElement !== this.ownerDocument.body
        ? activeElement
        : isElement(target)
          ? target
          : this.#boundTarget;
  }

  #restoreFocus() {
    if (this.#lastFocused?.isConnected) {
      this.#lastFocused.focus({ preventScroll: true });
    }

    this.#lastFocused = null;
  }
}

define("rowan-context-menu", RowanContextMenu);
