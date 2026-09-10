import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

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
 * @cssprop --rowan-button-bg
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanButton extends BaseElement {
  static styleUrl = new URL("./button.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["variant", "size", "disabled", "loading", "type"];
  static upgradeProperties = ["variant", "size", "disabled", "loading", "type"];

  #button = null;

  constructor() {
    super();
  }

  get variant() {
    return this.readString("variant", "primary");
  }

  set variant(value) {
    this.reflectString("variant", value === "primary" ? null : value);
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

  get loading() {
    return this.readBoolean("loading");
  }

  set loading(value) {
    this.reflectBoolean("loading", Boolean(value));
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
        <button part="button" type="button">
          <span class="spinner" aria-hidden="true"></span>
          <span class="prefix"><slot name="prefix"></slot></span>
          <slot></slot>
          <span class="suffix"><slot name="suffix"></slot></span>
        </button>
      `;

      this.#button = this.renderRoot.querySelector("button");
      this.listen(this.#button, "click", (event) => {
        if (this.disabled || this.loading) {
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
    this.#button.disabled = this.disabled || this.loading;
  }

  #normalizedType(type) {
    if (type === "submit" || type === "reset") return type;
    return "button";
  }
}

define("rowan-button", RowanButton);
