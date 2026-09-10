import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let numberFieldId = 0;

const NUMBER_VALUE_PATTERN = /^[+-]?(?:\d+|\d*\.\d+)$/;

function normalizeNumberString(value) {
  const next = String(value ?? "").trim();
  if (!next) return "";
  if (!NUMBER_VALUE_PATTERN.test(next)) return "";

  const numeric = Number(next);
  if (!Number.isFinite(numeric)) return "";

  return String(numeric);
}

function parseNumberString(value) {
  const normalized = normalizeNumberString(value);
  if (!normalized) return null;

  return Number(normalized);
}

function normalizeBound(value) {
  const next = String(value ?? "").trim();
  if (!next) return "";

  const numeric = Number(next);
  if (!Number.isFinite(numeric)) return "";

  return String(numeric);
}

function normalizeStep(value, fallback = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;

  return numeric;
}

/**
 * Numeric input with form association, range validation, and step controls.
 * @tag rowan-number-field
 * @attr {string} name
 * @attr {string} value
 * @attr {string} placeholder
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {number} step
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart control
 * @csspart input
 * @csspart decrement-button
 * @csspart increment-button
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanNumberField extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./number-field.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "value",
    "placeholder",
    "label",
    "min",
    "max",
    "step",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "placeholder",
    "label",
    "min",
    "max",
    "step",
    "disabled",
    "required",
    "invalid",
  ];

  #input = null;
  #fallbackLabel = null;
  #decrementButton = null;
  #incrementButton = null;
  #defaultValue = null;
  #inputId = "";
  #autoInvalid = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      numberFieldId += 1;
      this.id = `rowan-number-field-${numberFieldId}`;
    }

    this.#inputId = `${this.id}__input`;

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get value() {
    return normalizeNumberString(this.readString("value", ""));
  }

  set value(value) {
    const normalized = normalizeNumberString(value);
    this.reflectString("value", normalized || null);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get placeholder() {
    return this.readString("placeholder", "");
  }

  set placeholder(value) {
    this.reflectString("placeholder", value);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get min() {
    return normalizeBound(this.readString("min", ""));
  }

  set min(value) {
    const normalized = normalizeBound(value);
    this.reflectString("min", normalized || null);
    this.#syncValidity();
  }

  get max() {
    return normalizeBound(this.readString("max", ""));
  }

  set max(value) {
    const normalized = normalizeBound(value);
    this.reflectString("max", normalized || null);
    this.#syncValidity();
  }

  get step() {
    return normalizeStep(this.readNumber("step", 1), 1);
  }

  set step(value) {
    const normalized = normalizeStep(value, 1);
    this.reflectNumber("step", normalized === 1 ? null : normalized);
    this.#syncValidity();
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

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.#autoInvalid = false;
    this.reflectBoolean("invalid", Boolean(value));
  }

  setFormValue(value = this.value) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#input) {
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

    return this.#input ? this.#input.checkValidity() : true;
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return this.#input ? this.#input.reportValidity() : true;
  }

  render() {
    if (!this.#input) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <label class="sr-only" part="label"></label>
          <button
            class="step-button"
            part="decrement-button"
            type="button"
            data-action="decrement"
            aria-label="Decrease value"
          >
            -
          </button>
          <input class="input" part="input" type="number" inputmode="decimal" />
          <button
            class="step-button"
            part="increment-button"
            type="button"
            data-action="increment"
            aria-label="Increase value"
          >
            +
          </button>
        </div>
      `;

      this.#input = this.renderRoot.querySelector("input");
      this.#fallbackLabel = this.renderRoot.querySelector("label");
      this.#decrementButton = this.renderRoot.querySelector('[data-action="decrement"]');
      this.#incrementButton = this.renderRoot.querySelector('[data-action="increment"]');

      this.listen(this.#input, "input", () => {
        this.value = this.#input.value;
      });

      this.listen(this.#input, "change", () => {
        this.value = this.#input.value;

        emit(this, "rowan-change", {
          value: this.value,
        });
      });

      this.listen(this.#decrementButton, "click", () => {
        this.#nudge(-1);
      });

      this.listen(this.#incrementButton, "click", () => {
        this.#nudge(1);
      });
    }

    this.#input.id = this.#inputId;
    this.#input.name = this.name;
    this.#input.value = this.value;
    this.#input.placeholder = this.placeholder;
    this.#input.min = this.min;
    this.#input.max = this.max;
    this.#input.step = String(this.step);
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;

    this.#decrementButton.disabled = this.disabled;
    this.#incrementButton.disabled = this.disabled;

    const fallbackLabelText = this.label;
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;
    this.#fallbackLabel.htmlFor = this.#inputId;

    if (fallbackLabelText.length > 0) {
      this.#input.setAttribute("aria-label", fallbackLabelText);
    } else {
      this.#input.removeAttribute("aria-label");
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #valueNumber() {
    return parseNumberString(this.value);
  }

  #minNumber() {
    return parseNumberString(this.min);
  }

  #maxNumber() {
    return parseNumberString(this.max);
  }

  #nudge(direction) {
    if (this.disabled) return;

    const step = this.step;
    const min = this.#minNumber();
    const max = this.#maxNumber();

    let current = this.#valueNumber();
    if (current == null) {
      current = direction > 0 ? (min ?? 0) : (max ?? 0);
    }

    let next = current + direction * step;

    if (min != null) {
      next = Math.max(min, next);
    }

    if (max != null) {
      next = Math.min(max, next);
    }

    next = Number(next.toFixed(10));
    const nextValue = String(next);

    if (nextValue === this.value) return;

    this.value = nextValue;

    emit(this, "rowan-change", {
      value: this.value,
    });
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#input) return;

    if (this.required && this.value.length === 0) {
      this.setValidity({ valueMissing: true }, "Please enter a number.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    const valueNumber = this.#valueNumber();
    const minNumber = this.#minNumber();
    const maxNumber = this.#maxNumber();

    if (this.value.length > 0 && valueNumber == null) {
      this.setValidity({ badInput: true }, "Enter a valid number.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    if (valueNumber != null && minNumber != null && valueNumber < minNumber) {
      this.setValidity({ rangeUnderflow: true }, "Value is below minimum.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    if (valueNumber != null && maxNumber != null && valueNumber > maxNumber) {
      this.setValidity({ rangeOverflow: true }, "Value is above maximum.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    if (valueNumber != null && this.#hasStepMismatch(valueNumber, minNumber)) {
      this.setValidity({ stepMismatch: true }, "Value does not align to step.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    this.setValidity({}, "", this.#input);
    this.#setAutoInvalid(false);
  }

  #hasStepMismatch(valueNumber, minNumber) {
    const step = this.step;
    const base = minNumber ?? 0;
    const ratio = (valueNumber - base) / step;

    return Math.abs(Math.round(ratio) - ratio) > 1e-9;
  }

  #setAutoInvalid(nextValue) {
    if (nextValue) {
      if (!this.hasAttribute("invalid")) {
        this.#autoInvalid = true;
        this.setAttribute("invalid", "");
      }

      return;
    }

    if (this.#autoInvalid) {
      this.removeAttribute("invalid");
      this.#autoInvalid = false;
    }
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "spinbutton";
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = this.invalid ? "true" : "false";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const label = this.label.trim();
      this.internals.ariaLabel = label || null;
    }

    if (!this.hasAttribute("aria-valuemin") && "ariaValueMin" in this.internals) {
      this.internals.ariaValueMin = this.min || null;
    }

    if (!this.hasAttribute("aria-valuemax") && "ariaValueMax" in this.internals) {
      this.internals.ariaValueMax = this.max || null;
    }

    if (!this.hasAttribute("aria-valuenow") && "ariaValueNow" in this.internals) {
      this.internals.ariaValueNow = this.value || null;
    }
  }
}

define("rowan-number-field", RowanNumberField);