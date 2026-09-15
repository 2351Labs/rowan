import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { collectFocusableElements } from "../lib/focus.js";
import { isTopmostOverlay, pushOverlay, removeOverlay } from "../lib/overlay-stack.js";

/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @slot - Drawer content
 * @slot title
 * @csspart backdrop
 * @csspart panel
 * @csspart title
 * @csspart close
 * @event rowan-change - Fired when the user closes the drawer
 */
export class RowanDrawer extends BaseElement {
  static styleUrl = new URL("./drawer.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["open", "side"];
  static upgradeProperties = ["open", "side"];

  #backdrop = null;
  #panel = null;
  #closeButton = null;
  #titleSlot = null;
  #lastFocused = null;
  #removeDocumentFocusListener = null;
  #isOpen = false;
  #handleDocumentFocusIn = (event) => {
    if (!this.open || !(event.target instanceof Node)) return;
    if (!isTopmostOverlay(this)) return;
    if (!this.#isNodeInDrawer(event.target)) this.#focusFirstElement();
  };

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  /** @returns {"start" | "end"} */
  get side() {
    return this.readString("side", "start");
  }

  /** @param {"start" | "end"} value */
  set side(value) {
    const next = value === "end" ? "end" : "start";
    this.reflectString("side", next);
  }

  render() {
    if (!this.#backdrop) {
      this.renderRoot.innerHTML = `
        <div class="backdrop" part="backdrop" aria-hidden="true"></div>
        <section class="panel" part="panel" tabindex="-1">
          <div class="header">
            <div class="title" part="title"><slot name="title"></slot></div>
            <button type="button" class="close" part="close" aria-label="Close drawer">Close</button>
          </div>
          <div class="content"><slot></slot></div>
        </section>
      `;

      this.#backdrop = this.renderRoot.querySelector(".backdrop");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#closeButton = this.renderRoot.querySelector(".close");
      this.#titleSlot = this.renderRoot.querySelector('[part="title"] slot');

      this.listen(this.#closeButton, "click", () => this.#requestUserClose());
      this.listen(this.#backdrop, "click", () => this.#requestUserClose());
      this.listen(this.#panel, "keydown", (event) => this.#handlePanelKeydown(event));
      this.listen(this.#titleSlot, "slotchange", () => this.requestRender());
    }

    this.#applyDefaultA11y();
    this.#syncOpenState();
  }

  #requestUserClose() {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-change", { open: false });
  }

  #handlePanelKeydown(event) {
    if (event.key === keys.ESCAPE) {
      event.preventDefault();
      this.#requestUserClose();
      return;
    }

    if (event.key === keys.TAB) this.#trapTabFocus(event);
  }

  #applyDefaultA11y() {
    this.#panel.setAttribute("role", "dialog");
    this.#panel.setAttribute("aria-modal", "true");
    this.#panel.setAttribute("aria-label", this.#titleText() || "Drawer");

    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = this.open ? "dialog" : null;
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = this.open ? "true" : null;
    }

    if (!this.hasAttribute("aria-hidden") && "ariaHidden" in this.internals) {
      this.internals.ariaHidden = this.open ? "false" : "true";
    }

    if (
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      "ariaLabel" in this.internals
    ) {
      this.internals.ariaLabel = this.open ? this.#titleText() || "Drawer" : null;
    }
  }

  #syncOpenState() {
    this.#backdrop.hidden = !this.open;
    this.#panel.hidden = !this.open;
    this.inert = !this.open;

    if (this.open === this.#isOpen) return;

    this.#isOpen = this.open;
    if (this.open) {
      this.#onOpen();
      return;
    }

    this.#onClose();
  }

  #onOpen() {
    this.#lastFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    pushOverlay(this);
    this.#removeDocumentFocusListener = this.listen(
      document,
      "focusin",
      this.#handleDocumentFocusIn,
      true,
    );

    queueMicrotask(() => {
      if (this.open) this.#focusFirstElement();
    });
  }

  #onClose() {
    removeOverlay(this);
    this.#removeDocumentFocusListener?.();
    this.#removeDocumentFocusListener = null;

    if (this.#lastFocused?.isConnected && typeof this.#lastFocused.focus === "function") {
      this.#lastFocused.focus();
    }

    this.#lastFocused = null;
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
    const active =
      event.composedPath().find((node) => focusableElements.includes(node)) ||
      this.shadowRoot.activeElement ||
      document.activeElement;

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
    const first = this.#collectFocusableElements()[0] ?? this.#panel;
    first.focus();
  }

  #collectFocusableElements() {
    return collectFocusableElements(this.#panel);
  }

  #titleText() {
    return this.#titleSlot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join(" ")
      .trim();
  }

  #isNodeInDrawer(node) {
    return (node instanceof HTMLElement && this.contains(node)) || this.shadowRoot?.contains(node);
  }
}

define("rowan-drawer", RowanDrawer);
