import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { VirtualCollection } from "../lib/virtual-collection.js";

const DEFAULT_ITEM_SIZE = 40;
const DEFAULT_OVERSCAN = 3;

function positiveNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function nonNegativeInteger(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.trunc(numeric) : fallback;
}

/**
 * Virtualized, keyed collection for large property-driven item sets.
 * @tag rowan-virtual-list
 * @attr {number} item-size
 * @attr {number} overscan
 * @property {Array<unknown>} items - Property-only item data.
 * @property {string | ((item: unknown, index: number) => string | number)} itemKey - Stable item key accessor.
 * @property {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} renderItem - Renders a visible item.
 * @csspart viewport
 * @csspart content
 * @csspart items
 * @csspart item
 * @cssprop --rowan-virtual-list-height
 * @cssprop --rowan-virtual-list-bg
 * @cssprop --rowan-virtual-list-border-color
 * @cssprop --rowan-virtual-list-radius
 * @cssprop --rowan-virtual-list-fg
 */
export class RowanVirtualList extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./virtual-list.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-virtual-list-"];
  static observedAttributes = ["item-size", "overscan"];
  static upgradeProperties = ["items", "itemKey", "renderItem", "itemSize", "overscan"];

  #collection = new VirtualCollection();
  #renderItem = null;
  #renderVersion = 0;
  #root = null;
  #viewport = null;
  #content = null;
  #itemsElement = null;
  #renderedItems = new Map();
  #viewportHeight = 0;
  #resizeObserver = null;
  #observingViewport = false;
  #observedElements = new Set();
  #warnedDuplicateKeys = new Set();
  #resizeRenderQueued = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.internals) this.internals.role = "list";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (name === "item-size") {
      this.#collection.estimatedItemSize = this.itemSize;
    }
  }

  /** @returns {unknown[]} */
  get items() {
    return this.#collection.items;
  }

  /** @param {unknown[]} value */
  set items(value) {
    this.#collection.items = value;
    this.requestRender();
  }

  /** @returns {string | ((item: unknown, index: number) => string | number) | null} */
  get itemKey() {
    return this.#collection.itemKey;
  }

  /** @param {string | ((item: unknown, index: number) => string | number) | null} value */
  set itemKey(value) {
    this.#collection.itemKey = value;
    this.requestRender();
  }

  /** @returns {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} */
  get renderItem() {
    return this.#renderItem;
  }

  /** @param {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} value */
  set renderItem(value) {
    this.#renderItem = typeof value === "function" ? value : null;
    this.#renderVersion += 1;
    this.requestRender();
  }

  /** @returns {number} */
  get itemSize() {
    return positiveNumber(this.readNumber("item-size", DEFAULT_ITEM_SIZE), DEFAULT_ITEM_SIZE);
  }

  /** @param {number} value */
  set itemSize(value) {
    this.reflectNumber("item-size", positiveNumber(value, DEFAULT_ITEM_SIZE));
  }

  /** @returns {number} */
  get overscan() {
    return nonNegativeInteger(this.readNumber("overscan", DEFAULT_OVERSCAN), DEFAULT_OVERSCAN);
  }

  /** @param {number} value */
  set overscan(value) {
    this.reflectNumber("overscan", nonNegativeInteger(value, DEFAULT_OVERSCAN));
  }

  /**
   * Scrolls an item into the list's rendered window.
   * @param {number} index
   * @param {{ align?: "auto" | "start" | "center" | "end" }} [options]
   */
  scrollToIndex(index, options = {}) {
    if (!this.#viewport) return;

    const entry = this.#collection.entryAt(Math.trunc(Number(index)));
    if (!entry) return;

    const viewportSize = this.#readViewportHeight();
    const currentOffset = this.#viewport.scrollTop;
    const align = ["auto", "start", "center", "end"].includes(options.align)
      ? options.align
      : "auto";
    const isVisible =
      entry.offset >= currentOffset && entry.offset + entry.size <= currentOffset + viewportSize;

    let nextOffset = currentOffset;
    if (align === "start" || (align === "auto" && !isVisible)) {
      nextOffset = entry.offset;
    } else if (align === "center") {
      nextOffset = entry.offset - (viewportSize - entry.size) / 2;
    } else if (align === "end") {
      nextOffset = entry.offset - viewportSize + entry.size;
    }

    const maximumOffset = Math.max(0, this.#collection.totalSize - viewportSize);
    this.#viewport.scrollTop = Math.min(maximumOffset, Math.max(0, nextOffset));
    this.requestRender();
  }

  render() {
    if (!this.#root) {
      this.renderRoot.innerHTML = `
        <div class="viewport" part="viewport">
          <div class="content" part="content">
            <div class="items" part="items"></div>
          </div>
        </div>
      `;

      this.#root = this.renderRoot.firstElementChild;
      this.#viewport = this.renderRoot.querySelector(".viewport");
      this.#content = this.renderRoot.querySelector(".content");
      this.#itemsElement = this.renderRoot.querySelector(".items");

      this.listen(this.#viewport, "scroll", () => this.requestRender(), { passive: true });
    }

    this.#collection.estimatedItemSize = this.itemSize;
    const viewportSize = this.#readViewportHeight();
    const range = this.#collection.range(this.#viewport.scrollTop, viewportSize, this.overscan);

    this.#content.style.height = `${range.totalSize}px`;
    this.#renderRange(range.entries, this.#collection.entries.length);
    this.#warnForDuplicateKeys();
    this.#syncResizeObserver();
  }

  #readViewportHeight() {
    if (!this.#viewport) return this.itemSize;

    const measured = this.#viewport.clientHeight || this.#viewport.getBoundingClientRect().height;
    if (measured > 0) this.#viewportHeight = measured;

    return this.#viewportHeight || this.itemSize;
  }

  #renderRange(entries, itemCount) {
    const stale = new Set(this.#renderedItems.values());
    const next = new Map();

    entries.forEach((entry, position) => {
      let rendered = this.#renderedItems.get(entry.key);
      const needsContent =
        !rendered ||
        rendered.item !== entry.item ||
        rendered.index !== entry.index ||
        rendered.renderVersion !== this.#renderVersion;

      if (!rendered) {
        const element = document.createElement("div");
        element.className = "item";
        element.part = "item";
        element.setAttribute("role", "listitem");
        rendered = { element, item: null, index: -1, renderVersion: -1 };
      }

      if (needsContent) {
        rendered.element.replaceChildren();
        const output = this.#renderItem
          ? this.#renderItem(entry.item, entry.index, rendered.element)
          : entry.item;

        if (output instanceof Node) {
          rendered.element.append(output);
        } else if (output != null) {
          rendered.element.textContent = String(output);
        }
      }

      rendered.item = entry.item;
      rendered.index = entry.index;
      rendered.renderVersion = this.#renderVersion;
      rendered.element.dataset.virtualListKey = entry.key;
      rendered.element.dataset.index = String(entry.index);
      rendered.element.style.transform = `translateY(${entry.offset}px)`;
      rendered.element.setAttribute("aria-posinset", String(entry.index + 1));
      rendered.element.setAttribute("aria-setsize", String(itemCount));

      stale.delete(rendered);
      next.set(entry.key, rendered);

      const reference = this.#itemsElement.children[position];
      if (rendered.element !== reference) {
        this.#itemsElement.insertBefore(rendered.element, reference ?? null);
      }
    });

    for (const rendered of stale) {
      rendered.element.remove();
    }

    this.#renderedItems = next;
  }

  #warnForDuplicateKeys() {
    for (const key of this.#collection.duplicateKeys) {
      if (this.#warnedDuplicateKeys.has(key)) continue;

      this.#warnedDuplicateKeys.add(key);
      console.warn(`rowan-virtual-list received a duplicate item key: ${key}`);
    }
  }

  #syncResizeObserver() {
    if (typeof ResizeObserver === "undefined" || !this.#viewport) return;

    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver((entries) => {
        let changed = false;

        for (const entry of entries) {
          if (entry.target === this.#viewport) {
            const height = entry.contentRect.height;
            if (height > 0 && height !== this.#viewportHeight) {
              this.#viewportHeight = height;
              changed = true;
            }
            continue;
          }

          const key = entry.target.dataset.virtualListKey;
          const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
          if (key && this.#collection.setMeasuredSize(key, height)) {
            changed = true;
          }
        }

        if (changed) this.#queueResizeRender();
      });

      this.observe(this.#resizeObserver, () => this.#restoreResizeObserver());
    }

    this.#observeActiveElements();
  }

  #restoreResizeObserver() {
    if (!this.#resizeObserver || !this.#viewport) return;

    this.#resizeObserver.disconnect();
    this.#observingViewport = false;
    this.#observedElements.clear();

    this.#observeActiveElements();
  }

  #observeActiveElements() {
    if (!this.#resizeObserver || !this.#viewport) return;

    if (!this.#observingViewport) {
      this.#resizeObserver.observe(this.#viewport);
      this.#observingViewport = true;
    }

    const activeElements = new Set(
      [...this.#renderedItems.values()].map((rendered) => rendered.element),
    );

    for (const element of this.#observedElements) {
      if (!activeElements.has(element)) {
        this.#resizeObserver.unobserve(element);
        this.#observedElements.delete(element);
      }
    }

    for (const rendered of this.#renderedItems.values()) {
      if (this.#observedElements.has(rendered.element)) continue;

      this.#resizeObserver.observe(rendered.element);
      this.#observedElements.add(rendered.element);
    }
  }

  #queueResizeRender() {
    if (this.#resizeRenderQueued) return;

    this.#resizeRenderQueued = true;
    setTimeout(() => {
      this.#resizeRenderQueued = false;
      if (this.isConnected) this.requestRender();
    });
  }
}

define("rowan-virtual-list", RowanVirtualList);
