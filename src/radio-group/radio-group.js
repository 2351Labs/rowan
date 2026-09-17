import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { validityMessage } from "../lib/validity-messages.js";

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
  static formAssociated = true;
  static styleUrl = new URL("./radio-group.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value", "name", "disabled", "required"];
  static upgradeProperties = ["value", "name", "disabled", "required"];

  #slot = null;
  #radioChangeListeners = new Map();
  #defaultValue = undefined;

  connectedCallback() {
    super.connectedCallback();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
    this.#syncFormValue();
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
    this.#syncFormValue();
    this.#syncValidity();
  }

  get required() {
    return this.readBoolean("required");
  }

  set required(value) {
    this.reflectBoolean("required", Boolean(value));
    this.#syncValidity();
  }

  /** @param {string | null} [value] */
  setFormValue(value = this.value ? this.value : null) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value);
    }
  }

  setValidity(flags = {}, message = "", anchor = undefined) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      if (anchor instanceof HTMLElement) {
        this.applyValidity(flags, message, anchor);
      } else {
        this.applyValidity(flags, message);
      }
    }
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? "";
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? "" : String(state);
  }

  checkValidity() {
    if (this.internals && typeof this.internals.checkValidity === "function") {
      return this.internals.checkValidity();
    }

    return !this.#isValueMissing();
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return this.checkValidity();
  }

  render() {
    if (!this.#slot) {
      this.renderRoot.innerHTML = '<div class="group" part="group"><slot></slot></div>';
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
    }

    const radios = this.#radios();
    this.#syncRadioChangeListeners(radios);

    const selectedByChild = radios.find((radio) => radio.checked)?.value ?? "";
    const selectedValue = this.value || selectedByChild;

    if (!this.value && selectedByChild) {
      this.value = selectedByChild;
    }

    if (this.#defaultValue === undefined) {
      this.#defaultValue = this.value;
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

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #radios() {
    return this.#slot
      .assignedElements({ flatten: true })
      .filter(
        (node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-radio",
      );
  }

  #syncRadioChangeListeners(radios) {
    const nextRadios = new Set(radios);

    for (const [radio, removeListener] of this.#radioChangeListeners) {
      if (nextRadios.has(radio)) continue;
      removeListener();
      this.#radioChangeListeners.delete(radio);
    }

    for (const radio of radios) {
      if (this.#radioChangeListeners.has(radio)) continue;

      const removeListener = this.listen(radio, "rowan-change", (event) => {
        this.#handleRadioChange(event, radio);
      });
      this.#radioChangeListeners.set(radio, removeListener);
    }
  }

  #handleRadioChange(event, source) {
    if (event.target !== source) return;
    if (source.closest("rowan-radio-group") !== this || !source.checked) return;

    event.stopPropagation();

    const nextValue = source.value;
    if (this.value === nextValue) return;

    this.value = nextValue;

    emit(this, "rowan-change", {
      value: this.value,
      radio: source,
    });
  }

  #isValueMissing() {
    return this.required && !this.value;
  }

  #syncFormValue() {
    this.setFormValue(this.value ? this.value : null);
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity({ valueMissing: true }, validityMessage("valueMissing.option"));
      return;
    }

    this.setValidity({});
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "radiogroup";
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = this.#isValueMissing() ? "true" : "false";
    }
  }
}

define("rowan-radio-group", RowanRadioGroup);
