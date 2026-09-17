import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { triggerAssociatedFormAction } from "../lib/form.js";

const VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);
const SIZES = new Set(["sm", "md", "lg"]);
const TYPES = new Set(["button", "submit", "reset"]);

/**
 * Icon-only action control.
 * @tag rowan-icon-button
 * @attr {string} label
 * @attr {string} icon - Name registered by an `@rowan-ui/icons/elements/*` import.
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {"button"|"submit"|"reset"} type
 * @slot - Icon glyph
 * @csspart button
 * @csspart icon
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
  static observedAttributes = ["label", "icon", "variant", "size", "disabled", "type"];
  static upgradeProperties = ["label", "icon", "variant", "size", "disabled", "type"];
  static componentTokenPrefixes = ["--rowan-button-"];

  #button = null;
  #iconSlot = null;
  #configuredIcon = null;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get icon() {
    return this.readString("icon", "");
  }

  set icon(value) {
    this.reflectString("icon", value);
  }

  /** @returns {"primary" | "secondary" | "ghost" | "danger"} */
  get variant() {
    return normalizeEnum(this.readString("variant", "ghost"), VARIANTS, "ghost");
  }

  /** @param {"primary" | "secondary" | "ghost" | "danger"} value */
  set variant(value) {
    reflectEnum(this, "variant", value, VARIANTS, "ghost");
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

    if (name === "variant" && rewriteEnumAttribute(this, name, newValue, VARIANTS, "ghost")) {
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
          <slot>•</slot>
          <rowan-icon part="icon" hidden></rowan-icon>
        </button>
      `;

      this.#button = this.renderRoot.querySelector("button");
      this.#iconSlot = this.renderRoot.querySelector("slot");
      this.#configuredIcon = this.renderRoot.querySelector("rowan-icon");
      this.listen(this.#button, "click", (event) => {
        if (this.disabled) {
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
    this.#button.disabled = this.disabled;
    this.#button.setAttribute("aria-label", this.label.trim() || "Icon button");

    const iconName = this.icon;
    this.#iconSlot.hidden = Boolean(iconName);
    this.#configuredIcon.hidden = !iconName;
    if (iconName) {
      this.#configuredIcon.setAttribute("name", iconName);
    } else {
      this.#configuredIcon.removeAttribute("name");
    }
  }
}

define("rowan-icon-button", RowanIconButton);
