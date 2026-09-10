import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

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
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanIconButton extends BaseElement {
  static styleUrl = new URL("./icon-button.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["label", "variant", "size", "disabled", "type"];
  static upgradeProperties = ["label", "variant", "size", "disabled", "type"];

  #button = null;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get variant() {
    return this.readString("variant", "ghost");
  }

  set variant(value) {
    this.reflectString("variant", value === "ghost" ? null : value);
  }

  get size() {
    return this.readString("size", "md");
  }

  set size(value) {
    this.reflectString("size", value === "md" ? null : value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get type() {
    return this.readString("type", "button");
  }

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

        emit(this, "rowan-click", {
          nativeEvent: event,
        });
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
