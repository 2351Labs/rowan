import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Modal dialog surface.
 * @tag rowan-dialog
 * @attr {boolean} open
 * @slot title
 * @slot - Content
 * @slot actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart close
 * @event rowan-close - Fired when the user dismisses the dialog
 */
export class RowanDialog extends BaseElement {
  static styleUrl = new URL("./dialog.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["open"];
  static upgradeProperties = ["open"];

  #overlay = null;
  #panel = null;
  #closeButton = null;
  #lastFocused = null;
  #isOpen = false;
  #handleDocumentFocusIn = (event) => {
    if (!this.open) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!this.#isNodeInDialog(target)) {
      this.#focusFirstElement();
    }
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("focusin", this.#handleDocumentFocusIn, true);
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <div class="overlay" part="overlay" hidden>
          <div class="backdrop" part="backdrop"></div>
          <section class="panel" part="panel" tabindex="-1">
            <header class="header" part="header">
              <div class="title" part="title"><slot name="title"></slot></div>
              <button class="close" part="close" type="button" aria-label="Close dialog">×</button>
            </header>
            <div class="body" part="body"><slot></slot></div>
            <footer class="actions" part="actions"><slot name="actions"></slot></footer>
          </section>
        </div>
      `;

      this.#overlay = this.renderRoot.querySelector(".overlay");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#closeButton = this.renderRoot.querySelector(".close");

      this.listen(this.#closeButton, "click", () => {
        this.#requestUserClose("close-button");
      });

      this.listen(this.#overlay, "click", (event) => {
        if (event.target === this.#overlay || event.target === this.#overlay.firstElementChild) {
          this.#requestUserClose("backdrop");
        }
      });

      this.listen(this.#panel, "keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          this.#requestUserClose("escape");
          return;
        }

        if (event.key === "Tab") {
          this.#trapTabFocus(event);
        }
      });
    }

    this.#applyDefaultA11y();
    this.#syncOpenState();
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

  #requestUserClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", { reason });
  }

  #syncOpenState() {
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
    this.#overlay.hidden = false;

    document.addEventListener("focusin", this.#handleDocumentFocusIn, true);
    queueMicrotask(() => {
      if (this.open) {
        this.#focusFirstElement();
      }
    });
  }

  #onClose() {
    this.#overlay.hidden = true;
    document.removeEventListener("focusin", this.#handleDocumentFocusIn, true);

    if (this.#lastFocused && typeof this.#lastFocused.focus === "function") {
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
    const focusableElements = this.#collectFocusableElements();
    const first = focusableElements[0] ?? this.#panel;
    first.focus();
  }

  #collectFocusableElements() {
    const seen = new Set();
    const elements = [];

    const addFocusable = (element) => {
      if (!(element instanceof HTMLElement)) return;
      if (seen.has(element)) return;
      if (!element.matches(FOCUSABLE_SELECTOR)) return;

      seen.add(element);
      elements.push(element);
    };

    this.#panel.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
      addFocusable(element);
    });

    this.#panel.querySelectorAll("slot").forEach((slot) => {
      slot.assignedElements({ flatten: true }).forEach((element) => {
        addFocusable(element);
        if (typeof element.querySelectorAll === "function") {
          element.querySelectorAll(FOCUSABLE_SELECTOR).forEach((nested) => {
            addFocusable(nested);
          });
        }
      });
    });

    return elements;
  }

  #isNodeInDialog(node) {
    if (node instanceof HTMLElement && this.contains(node)) {
      return true;
    }

    if (this.shadowRoot && this.shadowRoot.contains(node)) {
      return true;
    }

    return false;
  }
}

define("rowan-dialog", RowanDialog);
