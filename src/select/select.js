import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let selectId = 0;

/**
 * Select control with form association.
 * @tag rowan-select
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @csspart select
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the selected value changes
 */
export class RowanSelect extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./select.css", import.meta.url).href;
  static observedAttributes = ["name", "value", "label", "placeholder", "disabled", "required"];
  static upgradeProperties = [
    "name",
    "value",
    "label",
    "placeholder",
    "disabled",
    "required",
    "options",
  ];

  #select = null;
  #fallbackLabel = null;
  #defaultValue = null;
  #selectId = "";
  #options = [];

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      selectId += 1;
      this.id = `rowan-select-${selectId}`;
    }

    this.#selectId = `${this.id}__select`;

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get options() {
    return this.#options;
  }

  set options(value) {
    this.#options = Array.isArray(value) ? value : [];
    this.requestRender();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get placeholder() {
    return this.readString("placeholder", "");
  }

  set placeholder(value) {
    this.reflectString("placeholder", value);
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
    this.#syncValidity();
  }

  setFormValue(value = this.value) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#select) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      this.internals.setValidity(flags, message, anchor);
    }
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? "";
    this.requestRender();
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? "" : String(state);
    this.requestRender();
  }

  checkValidity() {
    if (this.internals && typeof this.internals.checkValidity === "function") {
      return this.internals.checkValidity();
    }

    return this.#select ? this.#select.checkValidity() : true;
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return this.#select ? this.#select.reportValidity() : true;
  }

  render() {
    if (!this.#select) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <label class="sr-only" part="label"></label>
          <select class="select" part="select"></select>
        </div>
      `;

      this.#select = this.renderRoot.querySelector("select");
      this.#fallbackLabel = this.renderRoot.querySelector("label");

      this.listen(this.#select, "change", () => {
        this.value = this.#select.value;

        emit(this, "rowan-change", {
          value: this.value,
        });
      });
    }

    this.#renderOptions();

    this.#select.id = this.#selectId;
    this.#select.name = this.name;
    this.#select.disabled = this.disabled;
    this.#select.required = this.required;
    this.#select.value = this.value;

    const fallbackLabelText = this.label;
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;
    this.#fallbackLabel.htmlFor = this.#selectId;

    if (fallbackLabelText.length > 0) {
      this.#select.setAttribute("aria-label", fallbackLabelText);
    } else {
      this.#select.removeAttribute("aria-label");
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #renderOptions() {
    const options = this.#resolvedOptions();

    this.#select.textContent = "";

    const placeholder = this.placeholder;
    if (placeholder.length > 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = placeholder;
      option.disabled = this.required;
      option.selected = this.value.length === 0;
      this.#select.append(option);
    }

    for (const item of options) {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      option.disabled = item.disabled;
      this.#select.append(option);
    }

    const values = new Set(options.map((item) => item.value));
    if (this.value && !values.has(this.value)) {
      this.value = "";
    }
  }

  #resolvedOptions() {
    const source = this.#options.length > 0 ? this.#options : this.#readLightDomOptions();
    return source
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item, disabled: false };
        }

        if (item && typeof item === "object") {
          const value = "value" in item ? String(item.value) : "";
          const label = "label" in item ? String(item.label) : value;
          const disabled = Boolean(item.disabled);
          return { value, label, disabled };
        }

        return null;
      })
      .filter(Boolean);
  }

  #readLightDomOptions() {
    return Array.from(this.querySelectorAll("option")).map((option) => ({
      value: option.value,
      label: option.textContent ?? option.value,
      disabled: option.disabled,
    }));
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#select) return;

    if (this.required && this.value.length === 0) {
      this.setValidity({ valueMissing: true }, "Please select an option.", this.#select);
      return;
    }

    this.setValidity({}, "", this.#select);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    const invalidState = this.required && this.value.length === 0 ? "true" : "false";

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "combobox";
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = invalidState;
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const label = this.label.trim();
      this.internals.ariaLabel = label || null;
    }
  }
}

define("rowan-select", RowanSelect);
