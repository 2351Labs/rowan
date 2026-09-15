import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { collectFocusableElements } from "../lib/focus.js";
import { pushOverlay, removeOverlay } from "../lib/overlay-stack.js";

/**
 * Modal dialog surface.
 * @tag rowan-dialog
 * @attr {boolean} open
 * @slot title
 * @slot - Content
 * @slot actions
 * @csspart overlay
 * @csspart panel
 * @csspart close
 * @cssprop --rowan-dialog-bg
 * @cssprop --rowan-overlay-backdrop
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
  #titleSlot = null;
  #lastFocused = null;
  #isOpen = false;

  disconnectedCallback() {
    if (this.#isOpen) {
      removeOverlay(this);
      this.#isOpen = false;
    }

    // A modal removed while open would stay in the top layer and block the page.
    if (this.#overlay?.open) {
      this.#overlay.close();
    }

    super.disconnectedCallback();
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
        <dialog class="overlay" part="overlay">
          <section class="panel" part="panel" tabindex="-1">
            <div class="header" part="header">
              <div class="title" part="title"><slot name="title"></slot></div>
              <button class="close" part="close" type="button" aria-label="Close dialog">×</button>
            </div>
            <div class="body" part="body"><slot></slot></div>
            <div class="actions" part="actions"><slot name="actions"></slot></div>
          </section>
        </dialog>
      `;

      this.#overlay = this.renderRoot.querySelector("dialog");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#closeButton = this.renderRoot.querySelector(".close");
      this.#titleSlot = this.renderRoot.querySelector('[part="title"] slot');

      this.listen(this.#titleSlot, "slotchange", () => this.requestRender());

      this.listen(this.#closeButton, "click", () => {
        this.#requestUserClose("close-button");
      });

      this.listen(this.#overlay, "click", (event) => {
        if (event.target === this.#overlay) {
          this.#requestUserClose("backdrop");
        }
      });

      this.listen(this.#overlay, "cancel", (event) => {
        event.preventDefault();
        this.#requestUserClose("escape");
      });
    }

    this.#applyDefaultA11y();
    this.#syncOpenState();
  }

  #applyDefaultA11y() {
    this.#panel.setAttribute("role", "dialog");
    this.#panel.setAttribute("aria-modal", "true");
    this.#panel.setAttribute("aria-label", this.#titleText() || "Dialog");

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
      this.internals.ariaLabel = this.open ? this.#titleText() || "Dialog" : null;
    }
  }

  #requestUserClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", { reason });
  }

  #syncOpenState() {
    this.inert = !this.open;

    // showModal() moves focus, so capture the restore target before reconciling.
    if (this.open && !this.#isOpen) {
      this.#lastFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    this.#reconcileNativeOpen();

    if (this.open === this.#isOpen) return;

    this.#isOpen = this.open;

    if (this.open) {
      this.#onOpen();
      return;
    }

    this.#onClose();
  }

  /** Keeps the native dialog in sync even when `open` did not change, e.g. after reconnecting. */
  #reconcileNativeOpen() {
    if (!this.#overlay) return;

    if (this.open && this.isConnected && !this.#overlay.open) {
      this.#overlay.showModal();
      return;
    }

    if (!this.open && this.#overlay.open) {
      this.#overlay.close();
    }
  }

  #onOpen() {
    pushOverlay(this);
    queueMicrotask(() => {
      if (this.open) {
        this.#focusFirstElement();
      }
    });
  }

  #onClose() {
    removeOverlay(this);

    if (this.#lastFocused && typeof this.#lastFocused.focus === "function") {
      this.#lastFocused.focus();
    }

    this.#lastFocused = null;
  }

  #titleText() {
    return this.#titleSlot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join(" ")
      .trim();
  }

  #focusFirstElement() {
    const focusableElements = this.#collectFocusableElements();
    const first = focusableElements[0] ?? this.#panel;
    first.focus();
  }

  #collectFocusableElements() {
    return collectFocusableElements(this.#panel);
  }
}

define("rowan-dialog", RowanDialog);
