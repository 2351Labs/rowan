import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../button/button.js";
import "../dialog/dialog.js";

const CONFIRM_VARIANTS = new Set(["primary", "danger"]);

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * Focused dialog for confirming consequential actions.
 * @tag rowan-confirm-dialog
 * @attr {boolean} open
 * @attr {string} label
 * @attr {string} confirm-label
 * @attr {string} cancel-label
 * @attr {"primary"|"danger"} confirm-variant
 * @attr {boolean} confirm-disabled
 * @slot title
 * @slot - Supporting content
 * @slot actions - Additional actions placed before the default controls
 * @csspart dialog
 * @csspart actions
 * @csspart cancel
 * @csspart confirm
 * @cssprop --rowan-confirm-dialog-action-gap
 * @event rowan-confirm - Fired when the user confirms the action
 * @event rowan-cancel - Fired when the user cancels using the default control
 * @event rowan-close - Fired when the user passively dismisses the dialog
 */
export class RowanConfirmDialog extends BaseElement {
  static styleUrl = new URL("./confirm-dialog.css", import.meta.url).href;
  static observedAttributes = [
    "open",
    "label",
    "confirm-label",
    "cancel-label",
    "confirm-variant",
    "confirm-disabled",
  ];
  static upgradeProperties = [
    "open",
    "label",
    "confirmLabel",
    "cancelLabel",
    "confirmVariant",
    "confirmDisabled",
  ];
  static componentTokenPrefixes = ["--rowan-confirm-dialog-"];

  #dialog = null;
  #titleFallback = null;
  #cancelButton = null;
  #confirmButton = null;

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get label() {
    return this.readString("label", "Confirm action");
  }

  set label(value) {
    const nextLabel = normalizeText(value);
    this.reflectString("label", nextLabel && nextLabel !== "Confirm action" ? nextLabel : null);
  }

  get confirmLabel() {
    return this.readString("confirm-label", "Confirm");
  }

  set confirmLabel(value) {
    const nextLabel = normalizeText(value);
    this.reflectString("confirm-label", nextLabel && nextLabel !== "Confirm" ? nextLabel : null);
  }

  get cancelLabel() {
    return this.readString("cancel-label", "Cancel");
  }

  set cancelLabel(value) {
    const nextLabel = normalizeText(value);
    this.reflectString("cancel-label", nextLabel && nextLabel !== "Cancel" ? nextLabel : null);
  }

  /** @returns {"primary" | "danger"} */
  get confirmVariant() {
    const variant = this.readString("confirm-variant", "primary");
    return CONFIRM_VARIANTS.has(variant) ? variant : "primary";
  }

  /** @param {"primary" | "danger"} value */
  set confirmVariant(value) {
    const nextVariant = CONFIRM_VARIANTS.has(value) ? value : "primary";
    this.reflectString("confirm-variant", nextVariant === "primary" ? null : nextVariant);
  }

  get confirmDisabled() {
    return this.readBoolean("confirm-disabled");
  }

  set confirmDisabled(value) {
    this.reflectBoolean("confirm-disabled", Boolean(value));
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  render() {
    if (!this.#dialog) {
      this.renderRoot.innerHTML = `
        <rowan-dialog class="dialog" part="dialog">
          <div slot="title" class="title">
            <slot name="title"><span class="title-fallback"></span></slot>
          </div>
          <div class="body"><slot></slot></div>
          <div slot="actions" class="actions" part="actions">
            <slot name="actions"></slot>
            <rowan-button class="cancel" part="cancel" variant="secondary"></rowan-button>
            <rowan-button class="confirm" part="confirm"></rowan-button>
          </div>
        </rowan-dialog>
      `;

      this.#dialog = this.renderRoot.querySelector("rowan-dialog");
      this.#titleFallback = this.renderRoot.querySelector(".title-fallback");
      this.#cancelButton = this.renderRoot.querySelector(".cancel");
      this.#confirmButton = this.renderRoot.querySelector(".confirm");

      this.listen(this.#dialog, "rowan-close", (event) => {
        event.stopPropagation();
        this.#requestPassiveClose(event.detail?.reason ?? "close-button");
      });
      this.listen(this.#cancelButton, "rowan-click", () => this.#requestCancel());
      this.listen(this.#confirmButton, "rowan-click", () => this.#requestConfirm());
    }

    this.#syncDialog();
  }

  #syncDialog() {
    this.#dialog.alert = true;
    this.#dialog.open = this.open;
    this.#dialog.setAttribute("aria-label", this.label);
    this.#titleFallback.textContent = this.label;
    this.#cancelButton.textContent = this.cancelLabel;
    this.#confirmButton.textContent = this.confirmLabel;
    this.#confirmButton.variant = this.confirmVariant;
    this.#confirmButton.disabled = this.confirmDisabled;
  }

  #requestConfirm() {
    if (!this.open || this.confirmDisabled) return;

    this.open = false;
    emit(this, "rowan-confirm", { reason: "confirm-button" });
  }

  #requestCancel() {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-cancel", { reason: "cancel-button" });
  }

  #requestPassiveClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", { reason });
  }
}

define("rowan-confirm-dialog", RowanConfirmDialog);
