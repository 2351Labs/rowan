import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { triggerAssociatedFormAction } from "../lib/form.js";

/**
 * Icon-only action control.
 * @tag rowan-icon-button
 * @attr {string} label
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {"button"|"submit"|"reset"} type
 * @slot - Icon glyph
 * @csspart button
 * @cssprop --rowan-button-bg
 * @cssprop --rowan-button-border-width
 * @cssprop --rowan-button-ghost-bg
 * @cssprop --rowan-button-focus-ring
 * @cssprop --rowan-button-radius
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanIconButton extends BaseElement {
  static styleUrl = new URL("./icon-button.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["label", "variant", "size", "disabled", "type"];
  static upgradeProperties = ["label", "variant", "size", "disabled", "type"];
  static componentTokenPrefixes = ["--rowan-button-"];

  #button = null;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  /** @returns {"primary" | "secondary" | "ghost" | "danger"} */
  get variant() {
    return this.readString("variant", "ghost");
  }

  /** @param {"primary" | "secondary" | "ghost" | "danger"} value */
  set variant(value) {
    this.reflectString("variant", value === "ghost" ? null : value);
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return this.readString("size", "md");
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    this.reflectString("size", value === "md" ? null : value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  /** @returns {"button" | "submit" | "reset"} */
  get type() {
    return this.readString("type", "button");
  }

  /** @param {"button" | "submit" | "reset"} value */
  set type(value) {
    this.reflectString("type", value);
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML = `
        <button class="button" part="button" type="button">
          <slot>•</slot>
        </button>
      `;

      this.#button = this.renderRoot.querySelector("button");
      this.listen(this.#button, "click", (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        const type = this.#normalizedType(this.type);
        if (type !== "button") event.preventDefault();

        emit(this, "rowan-click", {
          nativeEvent: event,
        });
        triggerAssociatedFormAction(this, type);
      });
    }

    this.#button.type = this.#normalizedType(this.type);
    this.#button.disabled = this.disabled;
    this.#button.setAttribute("aria-label", this.label.trim() || "Icon button");
  }

  #normalizedType(type) {
    if (type === "submit" || type === "reset") return type;
    return "button";
  }
}

define("rowan-icon-button", RowanIconButton);
