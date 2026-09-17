import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { collectFocusableElements } from "../lib/focus.js";
import { pushOverlay, removeOverlay } from "../lib/overlay-stack.js";

const SIDES = new Set(["start", "end"]);

/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @slot - Drawer content
 * @slot title
 * @csspart overlay
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

  /** @returns {"start" | "end"} */
  get side() {
    return normalizeEnum(this.readString("side", "start"), SIDES, "start");
  }

  /** @param {"start" | "end"} value */
  set side(value) {
    reflectEnum(this, "side", value, SIDES, "start");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "side" && rewriteEnumAttribute(this, name, newValue, SIDES, "start")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <dialog class="overlay" part="overlay">
          <section class="panel" part="panel" tabindex="-1">
            <div class="header">
              <div class="title" part="title"><slot name="title"></slot></div>
              <button type="button" class="close" part="close" aria-label="Close drawer">Close</button>
            </div>
            <div class="content"><slot></slot></div>
          </section>
        </dialog>
      `;

      this.#overlay = this.renderRoot.querySelector("dialog");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#closeButton = this.renderRoot.querySelector(".close");
      this.#titleSlot = this.renderRoot.querySelector('[part="title"] slot');

      this.listen(this.#closeButton, "click", () => this.#requestUserClose());
      this.listen(this.#overlay, "click", (event) => {
        if (event.target === this.#overlay) this.#requestUserClose();
      });
      this.listen(this.#overlay, "cancel", (event) => {
        event.preventDefault();
        this.#requestUserClose();
      });
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

  #applyDefaultA11y() {
    this.#panel.removeAttribute("role");
    this.#panel.removeAttribute("aria-modal");
    this.#panel.removeAttribute("aria-label");

    const title = this.#titleText() || "Drawer";
    if (this.open) {
      this.#overlay.setAttribute("aria-label", title);
    } else {
      this.#overlay.removeAttribute("aria-label");
    }

    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = null;
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = null;
    }

    if (!this.hasAttribute("aria-hidden") && "ariaHidden" in this.internals) {
      this.internals.ariaHidden = this.open ? "false" : "true";
    }

    if (
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      "ariaLabel" in this.internals
    ) {
      this.internals.ariaLabel = null;
    }
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
      queueMicrotask(() => {
        if (this.open) this.#focusFirstElement();
      });
      return;
    }

    if (!this.open && this.#overlay.open) {
      this.#overlay.close();
    }
  }

  #onOpen() {
    pushOverlay(this);
  }

  #onClose() {
    removeOverlay(this);
    if (this.#lastFocused?.isConnected && typeof this.#lastFocused.focus === "function") {
      this.#lastFocused.focus();
    }

    this.#lastFocused = null;
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
}

define("rowan-drawer", RowanDrawer);
