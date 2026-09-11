import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanCommandItem } from "../command-item/command-item.js";

let commandPaletteId = 0;

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function normalizeText(value) {
  return String(value ?? "").trim();
}

function queryTerms(value) {
  return normalizeText(value).toLocaleLowerCase().split(/\s+/).filter(Boolean);
}

function isMacPlatform() {
  const platform = navigator.userAgentData?.platform ?? navigator.platform ?? "";
  return /mac/i.test(platform);
}

function matchesHotkey(event, hotkey) {
  const tokens = normalizeText(hotkey)
    .toLocaleLowerCase()
    .replace(/\s+/g, "")
    .split("+")
    .filter(Boolean);

  if (tokens.length === 0) return false;

  const key = tokens.pop();
  const modifiers = new Set(tokens);
  const allowedModifiers = new Set([
    "alt",
    "control",
    "ctrl",
    "meta",
    "cmd",
    "command",
    "mod",
    "shift",
  ]);
  if (!key || [...modifiers].some((modifier) => !allowedModifiers.has(modifier))) return false;

  const expectsMod = modifiers.has("mod");
  const expectsMeta =
    modifiers.has("meta") ||
    modifiers.has("cmd") ||
    modifiers.has("command") ||
    (expectsMod && isMacPlatform());
  const expectsControl =
    modifiers.has("control") || modifiers.has("ctrl") || (expectsMod && !isMacPlatform());
  const expectsAlt = modifiers.has("alt");
  const expectsShift = modifiers.has("shift");

  return (
    event.metaKey === expectsMeta &&
    event.ctrlKey === expectsControl &&
    event.altKey === expectsAlt &&
    event.shiftKey === expectsShift &&
    event.key.toLocaleLowerCase() === key
  );
}

function isCommandItem(value) {
  return value instanceof RowanCommandItem;
}

/**
 * Keyboard-first command surface for filtering and activating command items.
 * @tag rowan-command-palette
 * @attr {boolean} open
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} empty-label
 * @attr {string} hotkey
 * @attr {string} query
 * @slot - rowan-command-item nodes
 * @slot empty
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart input
 * @csspart list
 * @csspart empty
 * @csspart close
 * @cssprop --rowan-command-palette-bg
 * @cssprop --rowan-command-palette-width
 * @event rowan-command - Fired when a user activates a command
 * @event rowan-close - Fired when a user dismisses the palette
 */
export class RowanCommandPalette extends BaseElement {
  static styleUrl = new URL("./command-palette.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["open", "label", "placeholder", "empty-label", "hotkey", "query"];
  static upgradeProperties = ["open", "label", "placeholder", "emptyLabel", "hotkey", "query"];

  #overlay = null;
  #panel = null;
  #title = null;
  #input = null;
  #list = null;
  #empty = null;
  #emptyFallback = null;
  #closeButton = null;
  #activeItem = null;
  #itemObserver = null;
  #managedItems = new Set();
  #lastFocused = null;
  #isOpen = false;
  #listId = "";
  #titleId = "";
  #removeDocumentFocusListener = null;
  #removeDocumentHotkeyListener = null;
  #handleDocumentFocusIn = (event) => {
    if (!this.isConnected || !this.open || !(event.target instanceof Node)) {
      return;
    }

    if (!this.#isNodeInPalette(event.target)) this.#focusFirstElement();
  };

  connectedCallback() {
    super.connectedCallback();

    if (!this.#listId) {
      commandPaletteId += 1;
      this.#listId = `rowan-command-palette-${commandPaletteId}-list`;
      this.#titleId = `rowan-command-palette-${commandPaletteId}-title`;
    }

    if (!this.#itemObserver) {
      this.#itemObserver = new MutationObserver(() => this.requestRender());
      this.observe(this.#itemObserver, () => this.#observeItems());
    }

    this.#observeItems();
  }

  disconnectedCallback() {
    this.#removeDocumentFocusListener?.();
    this.#removeDocumentFocusListener = null;
    this.#removeDocumentHotkeyListener?.();
    this.#removeDocumentHotkeyListener = null;
    this.#clearManagedItems();
    super.disconnectedCallback();
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get label() {
    return this.readString("label", "Command palette");
  }

  set label(value) {
    const next = normalizeText(value);
    this.reflectString("label", next && next !== "Command palette" ? next : null);
  }

  get placeholder() {
    return this.readString("placeholder", "Search commands");
  }

  set placeholder(value) {
    const next = normalizeText(value);
    this.reflectString("placeholder", next && next !== "Search commands" ? next : null);
  }

  get emptyLabel() {
    return this.readString("empty-label", "No commands found.");
  }

  set emptyLabel(value) {
    const next = normalizeText(value);
    this.reflectString("empty-label", next && next !== "No commands found." ? next : null);
  }

  get hotkey() {
    return this.readString("hotkey", "");
  }

  set hotkey(value) {
    this.reflectString("hotkey", normalizeText(value) || null);
  }

  get query() {
    return this.readString("query", "");
  }

  set query(value) {
    this.reflectString("query", value);
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
  }

  focusSearch() {
    if (this.open && this.#input) this.#input.focus();
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <div class="overlay" part="overlay" hidden>
          <div class="backdrop" part="backdrop"></div>
          <section class="panel" part="panel" tabindex="-1">
            <header class="header">
              <h2 class="title"></h2>
              <button class="close" part="close" type="button" aria-label="Close command palette">×</button>
            </header>
            <input class="input" part="input" type="search" autocomplete="off" role="combobox" />
            <div class="list" part="list" role="listbox"><slot></slot></div>
            <div class="empty" part="empty" role="status" hidden>
              <slot name="empty"><span class="empty-fallback"></span></slot>
            </div>
          </section>
        </div>
      `;
      this.#overlay = this.renderRoot.querySelector(".overlay");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#title = this.renderRoot.querySelector(".title");
      this.#input = this.renderRoot.querySelector(".input");
      this.#list = this.renderRoot.querySelector(".list");
      this.#empty = this.renderRoot.querySelector(".empty");
      this.#emptyFallback = this.renderRoot.querySelector(".empty-fallback");
      this.#closeButton = this.renderRoot.querySelector(".close");

      this.listen(this.#closeButton, "click", () => this.#requestUserClose("close-button"));
      this.listen(this.#overlay, "click", (event) => this.#handleOverlayClick(event));
      this.listen(this.#panel, "keydown", (event) => this.#handlePanelKeydown(event));
      this.listen(this.#input, "input", () => {
        this.query = this.#input.value;
        this.#syncCommandState();
      });
      this.listen(this.#input, "keydown", (event) => this.#handleInputKeydown(event));
      this.listen(this.#list.querySelector("slot"), "slotchange", () => this.requestRender());
    }

    this.#title.id = this.#titleId;
    this.#title.textContent = this.label;
    this.#input.value = this.query;
    this.#input.placeholder = this.placeholder;
    this.#input.setAttribute("aria-controls", this.#listId);
    this.#input.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.#input.setAttribute("aria-labelledby", this.#titleId);
    this.#list.id = this.#listId;
    this.#list.setAttribute("aria-label", this.label);
    this.#emptyFallback.textContent = this.emptyLabel;

    this.#applyDefaultA11y();
    this.#syncHotkeyListener();
    this.#syncCommandState();
    this.#syncOpenState();
  }

  #observeItems() {
    this.#itemObserver?.observe(this, {
      attributes: true,
      attributeFilter: [
        "value",
        "label",
        "description",
        "keywords",
        "group",
        "shortcut",
        "disabled",
        "hidden",
      ],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  #items() {
    return [...this.querySelectorAll("rowan-command-item")].filter(
      (item) => isCommandItem(item) && item.closest("rowan-command-palette") === this,
    );
  }

  #matchingItems(items = this.#items()) {
    const terms = queryTerms(this.query);

    return items.filter((item) => {
      if (item.hidden) return false;

      const text = item.searchText.toLocaleLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }

  #syncCommandState() {
    if (!this.#input) return;

    const items = this.#items();
    const managedItems = new Set(items);
    const matchingItems = this.#matchingItems(items);
    const enabledItems = matchingItems.filter((item) => !item.disabled);

    if (!enabledItems.includes(this.#activeItem)) {
      this.#activeItem = enabledItems[0] ?? null;
    }

    for (const item of this.#managedItems) {
      if (!managedItems.has(item)) item.clearCommandPaletteState(this);
    }

    let activeId = "";
    for (const item of items) {
      const itemId = item.setCommandPaletteState(
        {
          active: item === this.#activeItem,
          visible: matchingItems.includes(item),
        },
        this,
      );
      if (item === this.#activeItem) activeId = itemId;
    }

    this.#managedItems = managedItems;
    this.#empty.hidden = matchingItems.length > 0;

    if (activeId) {
      this.#input.setAttribute("aria-activedescendant", activeId);
    } else {
      this.#input.removeAttribute("aria-activedescendant");
    }
  }

  #clearManagedItems() {
    for (const item of this.#managedItems) {
      item.clearCommandPaletteState(this);
    }

    this.#managedItems.clear();
    this.#activeItem = null;
  }

  #handleOverlayClick(event) {
    if (event.target === this.#overlay || event.target === this.#overlay.firstElementChild) {
      this.#requestUserClose("backdrop");
      return;
    }

    const item = event
      .composedPath()
      .find((node) => isCommandItem(node) && node.closest("rowan-command-palette") === this);
    if (item) this.#activateItem(item);
  }

  #handlePanelKeydown(event) {
    if (event.key === keys.ESCAPE) {
      event.preventDefault();
      this.#requestUserClose("escape");
      return;
    }

    if (event.key === keys.TAB) this.#trapTabFocus(event);
  }

  #handleInputKeydown(event) {
    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      this.#moveActiveItem(1);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      this.#moveActiveItem(-1);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      this.#moveActiveItemToBoundary("start");
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      this.#moveActiveItemToBoundary("end");
      return;
    }

    if (event.key === keys.ENTER) {
      event.preventDefault();
      if (this.#activeItem) this.#activateItem(this.#activeItem);
    }
  }

  #moveActiveItem(direction) {
    const enabledItems = this.#matchingItems().filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;

    const index = enabledItems.indexOf(this.#activeItem);
    const nextIndex =
      index === -1 ? 0 : (index + direction + enabledItems.length) % enabledItems.length;
    this.#activeItem = enabledItems[nextIndex];
    this.#syncCommandState();
  }

  #moveActiveItemToBoundary(boundary) {
    const enabledItems = this.#matchingItems().filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;

    this.#activeItem = boundary === "end" ? enabledItems[enabledItems.length - 1] : enabledItems[0];
    this.#syncCommandState();
  }

  #activateItem(item) {
    if (item.disabled || !this.#matchingItems().includes(item)) return;

    this.#activeItem = item;
    this.#syncCommandState();
    emit(this, "rowan-command", {
      value: item.value,
      item,
      query: this.query,
    });
    this.#requestUserClose("command");
  }

  #requestUserClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", { reason });
  }

  #syncHotkeyListener() {
    if (!this.hotkey) {
      this.#removeDocumentHotkeyListener?.();
      this.#removeDocumentHotkeyListener = null;
      return;
    }

    if (this.#removeDocumentHotkeyListener) return;

    this.#removeDocumentHotkeyListener = this.listen(document, "keydown", (event) => {
      if (event.defaultPrevented || !matchesHotkey(event, this.hotkey)) return;

      event.preventDefault();
      if (this.open) {
        this.focusSearch();
      } else {
        this.show();
      }
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "dialog";
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = this.open ? "true" : null;
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
    }
  }

  #syncOpenState() {
    if (this.open === this.#isOpen) {
      if (this.open) this.#installFocusContainment();
      return;
    }

    this.#isOpen = this.open;
    if (this.open) {
      this.#onOpen();
    } else {
      this.#onClose();
    }
  }

  #onOpen() {
    this.#lastFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.#overlay.hidden = false;
    this.#installFocusContainment();

    queueMicrotask(() => {
      if (this.open) this.#focusFirstElement();
    });
  }

  #onClose() {
    this.#overlay.hidden = true;
    this.#removeDocumentFocusListener?.();
    this.#removeDocumentFocusListener = null;

    if (this.#lastFocused?.isConnected && typeof this.#lastFocused.focus === "function") {
      this.#lastFocused.focus();
    }

    this.#lastFocused = null;
  }

  #installFocusContainment() {
    if (this.#removeDocumentFocusListener) return;

    this.#removeDocumentFocusListener = this.listen(
      document,
      "focusin",
      this.#handleDocumentFocusIn,
      true,
    );
  }

  #trapTabFocus(event) {
    const focusableElements = this.#collectFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      this.#panel.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = this.shadowRoot.activeElement || document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === this.#panel) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  #focusFirstElement() {
    if (!this.isConnected) return;

    const first = this.#input ?? this.#collectFocusableElements()[0] ?? this.#panel;
    first.focus();
  }

  #collectFocusableElements() {
    return [...this.#panel.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      (element) => element instanceof HTMLElement && !element.hidden,
    );
  }

  #isNodeInPalette(node) {
    return (node instanceof HTMLElement && this.contains(node)) || this.shadowRoot?.contains(node);
  }
}

define("rowan-command-palette", RowanCommandPalette);
