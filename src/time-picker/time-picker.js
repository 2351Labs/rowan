import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let timePickerId = 0;

const TIME_VALUE_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function normalizeTimeValue(value) {
  const next = String(value ?? "").trim();
  return TIME_VALUE_PATTERN.test(next) ? next : "";
}

function parseTimeToSeconds(value) {
  const normalized = normalizeTimeValue(value);
  if (!normalized) return null;

  const [hoursText, minutesText, secondsText = "0"] = normalized.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Time input with form association and range validation.
 * @tag rowan-time-picker
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {number} step
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart input
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed time value
 */
export class RowanTimePicker extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./time-picker.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "value",
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
  #defaultValue = null;
  #inputId = "";
  #autoInvalid = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      timePickerId += 1;
      this.id = `rowan-time-picker-${timePickerId}`;
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
    return normalizeTimeValue(this.readString("value", ""));
  }

  set value(value) {
    const normalized = normalizeTimeValue(value);
    this.reflectString("value", normalized || null);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get min() {
    return normalizeTimeValue(this.readString("min", ""));
  }

  set min(value) {
    const normalized = normalizeTimeValue(value);
    this.reflectString("min", normalized || null);
    this.#syncValidity();
  }

  get max() {
    return normalizeTimeValue(this.readString("max", ""));
  }

  set max(value) {
    const normalized = normalizeTimeValue(value);
    this.reflectString("max", normalized || null);
    this.#syncValidity();
  }

  get step() {
    const numeric = Number(this.readNumber("step", 60));
    return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 60;
  }

  set step(value) {
    const numeric = Number(value);
    const nextStep = Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 60;
    this.reflectNumber("step", nextStep === 60 ? null : nextStep);
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
          <input class="input" part="input" type="time" />
        </div>
      `;

      this.#input = this.renderRoot.querySelector("input");
      this.#fallbackLabel = this.renderRoot.querySelector("label");

      this.listen(this.#input, "input", () => {
        this.value = this.#input.value;
      });

      this.listen(this.#input, "change", () => {
        this.value = this.#input.value;

        emit(this, "rowan-change", {
          value: this.value,
        });
      });
    }

    this.#input.id = this.#inputId;
    this.#input.name = this.name;
    this.#input.value = this.value;
    this.#input.min = this.min;
    this.#input.max = this.max;
    this.#input.step = String(this.step);
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;

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

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#input) return;

    if (this.required && this.value.length === 0) {
      this.setValidity({ valueMissing: true }, "Please select a time.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    const valueSeconds = parseTimeToSeconds(this.value);
    const minSeconds = parseTimeToSeconds(this.min);
    const maxSeconds = parseTimeToSeconds(this.max);

    if (valueSeconds != null && minSeconds != null && valueSeconds < minSeconds) {
      this.setValidity({ rangeUnderflow: true }, "Time is before minimum.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    if (valueSeconds != null && maxSeconds != null && valueSeconds > maxSeconds) {
      this.setValidity({ rangeOverflow: true }, "Time is after maximum.", this.#input);
      this.#setAutoInvalid(true);
      return;
    }

    this.setValidity({}, "", this.#input);
    this.#setAutoInvalid(false);
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
      this.internals.role = "combobox";
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
  }
}

define("rowan-time-picker", RowanTimePicker);