import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { triggerAssociatedFormAction } from "../lib/form.js";

const VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);
const SIZES = new Set(["sm", "md", "lg"]);
const TYPES = new Set(["button", "submit", "reset"]);

/**
 * Primary action control.
 * @tag rowan-button
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {boolean} loading
 * @attr {"button"|"submit"|"reset"} type
 * @slot - Label
 * @slot prefix
 * @slot suffix
 * @csspart button
 * @csspart prefix
 * @csspart suffix
 * @csspart spinner
 * @cssprop --rowan-button-bg
 * @cssprop --rowan-button-border-width
 * @cssprop --rowan-button-hover-bg
 * @cssprop --rowan-button-active-bg
 * @cssprop --rowan-button-secondary-bg
 * @cssprop --rowan-button-ghost-bg
 * @cssprop --rowan-button-danger-bg
 * @cssprop --rowan-button-focus-ring
 * @cssprop --rowan-button-radius
 * @cssprop --rowan-button-padding-inline
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanButton extends BaseElement {
  static styleUrl = new URL("./button.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = [
    "variant",
    "size",
    "disabled",
    "loading",
    "type",
    "aria-expanded",
    "aria-haspopup",
  ];
  static upgradeProperties = ["variant", "size", "disabled", "loading", "type"];
  static componentTokenPrefixes = ["--rowan-button-"];

  #button = null;
  constructor() {
    super();
  }

  /** @returns {"primary" | "secondary" | "ghost" | "danger"} */
  get variant() {
    return normalizeEnum(this.readString("variant", "primary"), VARIANTS, "primary");
  }

  /** @param {"primary" | "secondary" | "ghost" | "danger"} value */
  set variant(value) {
    reflectEnum(this, "variant", value, VARIANTS, "primary");
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeEnum(this.readString("size", "md"), SIZES, "md");
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    reflectEnum(this, "size", value, SIZES, "md");
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get loading() {
    return this.readBoolean("loading");
  }

  set loading(value) {
    this.reflectBoolean("loading", Boolean(value));
  }

  /** @returns {"button" | "submit" | "reset"} */
  get type() {
    return normalizeEnum(this.readString("type", "button"), TYPES, "button");
  }

  /** @param {"button" | "submit" | "reset"} value */
  set type(value) {
    reflectEnum(this, "type", value, TYPES, "button");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "variant" && rewriteEnumAttribute(this, name, newValue, VARIANTS, "primary")) {
      return;
    }

    if (name === "size" && rewriteEnumAttribute(this, name, newValue, SIZES, "md")) {
      return;
    }

    if (name === "type" && rewriteEnumAttribute(this, name, newValue, TYPES, "button")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML = `
        <button class="button" part="button" type="button">
          <span class="spinner" part="spinner" aria-hidden="true"></span>
          <span class="prefix" part="prefix"><slot name="prefix"></slot></span>
          <slot></slot>
          <span class="suffix" part="suffix"><slot name="suffix"></slot></span>
        </button>
      `;

      this.#button = this.renderRoot.querySelector("button");
      this.listen(this.#button, "click", (event) => {
        if (this.disabled || this.loading) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        const type = this.type;
        if (type !== "button") event.preventDefault();

        emit(this, "rowan-click", {
          nativeEvent: event,
        });
        triggerAssociatedFormAction(this, type);
      });
    }

    this.#button.type = this.type;
    this.#button.disabled = this.disabled || this.loading;
    this.#button.setAttribute("aria-busy", this.loading ? "true" : "false");
    this.#syncPopupState();
  }

  #syncPopupState() {
    for (const attribute of ["aria-expanded", "aria-haspopup"]) {
      const value = this.getAttribute(attribute);
      if (value === null) {
        this.#button.removeAttribute(attribute);
      } else {
        this.#button.setAttribute(attribute, value);
      }
    }
  }
}

define("rowan-button", RowanButton);
