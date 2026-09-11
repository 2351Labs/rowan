import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../radio/radio.js";

/**
 * Group controller for radio options.
 * @tag rowan-radio-group
 * @attr {string} value
 * @attr {string} name
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @slot - rowan-radio children
 * @csspart group
 * @event rowan-change - Fired when selected value changes
 */
export class RowanRadioGroup extends BaseElement {
  static styleUrl = new URL("./radio-group.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "name", "disabled", "required"];
  static upgradeProperties = ["value", "name", "disabled", "required"];

  #slot = null;
  #removeChangeListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#removeChangeListener) return;

    this.#removeChangeListener = this.listen(this, "rowan-change", (event) => {
      const source = event.target;
      if (!(source instanceof HTMLElement)) return;
      if (source.tagName.toLowerCase() !== "rowan-radio") return;
      if (!source.checked) return;

      const nextValue = source.value;
      if (this.value === nextValue) return;

      this.value = nextValue;

      emit(this, "rowan-change", {
        value: this.value,
        radio: source,
      });
    });
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get required() {
    return this.readBoolean("required");
  }

  set required(value) {
    this.reflectBoolean("required", Boolean(value));
  }

  render() {
    if (!this.#slot) {
      this.renderRoot.innerHTML = '<div class="group" part="group"><slot></slot></div>';
      this.#slot = this.renderRoot.querySelector("slot");
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "radiogroup";
    }

    const radios = this.#slot
      .assignedElements({ flatten: true })
      .filter(
        (node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-radio",
      );

    const selectedByChild = radios.find((radio) => radio.checked)?.value ?? "";
    const selectedValue = this.value || selectedByChild;

    if (!this.value && selectedByChild) {
      this.value = selectedByChild;
    }

    radios.forEach((radio, index) => {
      if (!radio.hasAttribute("data-rowan-local-disabled")) {
        radio.setAttribute("data-rowan-local-disabled", radio.disabled ? "true" : "false");
      }

      if (!radio.hasAttribute("data-rowan-local-required")) {
        radio.setAttribute("data-rowan-local-required", radio.required ? "true" : "false");
      }

      if (this.name) {
        radio.name = this.name;
      }

      const localDisabled = radio.getAttribute("data-rowan-local-disabled") === "true";
      const localRequired = radio.getAttribute("data-rowan-local-required") === "true";

      radio.disabled = this.disabled || localDisabled;
      radio.required = localRequired || (this.required && index === 0);
      radio.checked = radio.value === selectedValue;
    });
  }
}

define("rowan-radio-group", RowanRadioGroup);
