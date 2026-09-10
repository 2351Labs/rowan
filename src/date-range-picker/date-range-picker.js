import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let dateRangePickerId = 0;

const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(number) {
  return String(number).padStart(2, "0");
}

function normalizeDateValue(value) {
  const next = String(value ?? "").trim();
  if (!DATE_VALUE_PATTERN.test(next)) return "";

  const [yearText, monthText, dayText] = next.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return "";
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}

function serializeRangeState(start, end) {
  return `${start}|${end}`;
}

function parseRangeState(state) {
  const text = String(state ?? "");
  if (!text.includes("|")) {
    return { start: "", end: "" };
  }

  const [startValue, endValue] = text.split("|", 2);
  return {
    start: normalizeDateValue(startValue),
    end: normalizeDateValue(endValue),
  };
}

/**
 * Date range input with form association and ordered range validation.
 * @tag rowan-date-range-picker
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {string} start
 * @attr {string} end
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart control
 * @csspart start-input
 * @csspart end-input
 * @csspart clear-button
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits or clears a date range
 */
export class RowanDateRangePicker extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./date-range-picker.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "name-start",
    "name-end",
    "start",
    "end",
    "label",
    "min",
    "max",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "nameStart",
    "nameEnd",
    "start",
    "end",
    "value",
    "label",
    "min",
    "max",
    "disabled",
    "required",
    "invalid",
  ];

  #startInput = null;
  #endInput = null;
  #fallbackLabel = null;
  #clearButton = null;
  #defaultStart = null;
  #defaultEnd = null;
  #startInputId = "";
  #endInputId = "";
  #autoInvalid = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultStart === null) {
      this.#defaultStart = this.start;
    }

    if (this.#defaultEnd === null) {
      this.#defaultEnd = this.end;
    }

    if (!this.id) {
      dateRangePickerId += 1;
      this.id = `rowan-date-range-picker-${dateRangePickerId}`;
    }

    this.#startInputId = `${this.id}__start`;
    this.#endInputId = `${this.id}__end`;

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get name() {
    return this.readString("name", "").trim();
  }

  set name(value) {
    const next = String(value ?? "").trim();
    this.reflectString("name", next || null);
    this.#syncFormValue();
  }

  get nameStart() {
    const configured = this.readString("name-start", "").trim();
    if (configured.length > 0) return configured;

    const base = this.name;
    return base ? `${base}-start` : "";
  }

  set nameStart(value) {
    const next = String(value ?? "").trim();
    this.reflectString("name-start", next || null);
    this.#syncFormValue();
  }

  get nameEnd() {
    const configured = this.readString("name-end", "").trim();
    if (configured.length > 0) return configured;

    const base = this.name;
    return base ? `${base}-end` : "";
  }

  set nameEnd(value) {
    const next = String(value ?? "").trim();
    this.reflectString("name-end", next || null);
    this.#syncFormValue();
  }

  get start() {
    return normalizeDateValue(this.readString("start", ""));
  }

  set start(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("start", normalized || null);
    this.#syncClearButtonState();
    this.#syncFormValue();
    this.#syncValidity();
  }

  get end() {
    return normalizeDateValue(this.readString("end", ""));
  }

  set end(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("end", normalized || null);
    this.#syncClearButtonState();
    this.#syncFormValue();
    this.#syncValidity();
  }

  get value() {
    return {
      start: this.start,
      end: this.end,
    };
  }

  set value(value) {
    const next = value && typeof value === "object" ? value : {};
    this.start = next.start ?? "";
    this.end = next.end ?? "";
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get min() {
    return normalizeDateValue(this.readString("min", ""));
  }

  set min(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("min", normalized || null);
    this.#syncValidity();
  }

  get max() {
    return normalizeDateValue(this.readString("max", ""));
  }

  set max(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("max", normalized || null);
    this.#syncValidity();
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
    this.#syncClearButtonState();
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

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.#autoInvalid = false;
    this.reflectBoolean("invalid", Boolean(value));
  }

  clear() {
    if (this.disabled) return;
    if (!this.start && !this.end) return;

    this.start = "";
    this.end = "";
    this.#emitChange("clear");
  }

  setFormValue() {
    if (!this.internals || typeof this.internals.setFormValue !== "function") {
      return;
    }

    if (this.disabled) {
      this.internals.setFormValue(null);
      return;
    }

    const startName = this.nameStart;
    const endName = this.nameEnd;
    const state = serializeRangeState(this.start, this.end);

    if (startName || endName) {
      const formData = new FormData();

      if (startName) {
        formData.append(startName, this.start);
      }

      if (endName) {
        formData.append(endName, this.end);
      }

      this.internals.setFormValue(formData, state);
      return;
    }

    this.internals.setFormValue(state);
  }

  setValidity(flags = {}, message = "", anchor = this.#startInput) {
    if (!this.internals || typeof this.internals.setValidity !== "function") {
      return;
    }

    if (anchor instanceof HTMLElement) {
      this.internals.setValidity(flags, message, anchor);
      return;
    }

    this.internals.setValidity(flags, message);
  }

  formResetCallback() {
    this.start = this.#defaultStart ?? "";
    this.end = this.#defaultEnd ?? "";
    this.requestRender();
  }

  formStateRestoreCallback(state) {
    const restored = parseRangeState(state);
    this.start = restored.start;
    this.end = restored.end;
    this.requestRender();
  }

  checkValidity() {
    if (this.internals && typeof this.internals.checkValidity === "function") {
      return this.internals.checkValidity();
    }

    return true;
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return true;
  }

  render() {
    if (!this.#startInput) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <label class="sr-only" part="label"></label>
          <input class="input" part="start-input" type="date" data-field="start" />
          <span class="separator" part="separator" aria-hidden="true">to</span>
          <input class="input" part="end-input" type="date" data-field="end" />
          <button class="clear-button" part="clear-button" type="button" data-action="clear">Clear</button>
        </div>
      `;

      this.#startInput = this.renderRoot.querySelector('[data-field="start"]');
      this.#endInput = this.renderRoot.querySelector('[data-field="end"]');
      this.#fallbackLabel = this.renderRoot.querySelector("label");
      this.#clearButton = this.renderRoot.querySelector('[data-action="clear"]');

      this.listen(this.#startInput, "input", () => {
        this.start = this.#startInput.value;
      });

      this.listen(this.#startInput, "change", () => {
        this.start = this.#startInput.value;
        this.#emitChange("start");
      });

      this.listen(this.#endInput, "input", () => {
        this.end = this.#endInput.value;
      });

      this.listen(this.#endInput, "change", () => {
        this.end = this.#endInput.value;
        this.#emitChange("end");
      });

      this.listen(this.#clearButton, "click", () => {
        this.clear();
      });
    }

    this.#startInput.id = this.#startInputId;
    this.#startInput.name = this.nameStart;
    this.#startInput.value = this.start;
    this.#startInput.min = this.min;
    this.#startInput.max = this.max;
    this.#startInput.disabled = this.disabled;
    this.#startInput.required = this.required;

    this.#endInput.id = this.#endInputId;
    this.#endInput.name = this.nameEnd;
    this.#endInput.value = this.end;
    this.#endInput.min = this.min;
    this.#endInput.max = this.max;
    this.#endInput.disabled = this.disabled;
    this.#endInput.required = this.required;

    this.#syncClearButtonState();

    const fallbackLabelText = this.label.trim();
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;
    this.#fallbackLabel.htmlFor = this.#startInputId;

    if (fallbackLabelText.length > 0) {
      this.#startInput.setAttribute("aria-label", `${fallbackLabelText} start`);
      this.#endInput.setAttribute("aria-label", `${fallbackLabelText} end`);
    } else {
      this.#startInput.removeAttribute("aria-label");
      this.#endInput.removeAttribute("aria-label");
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #emitChange(source) {
    emit(this, "rowan-change", {
      start: this.start,
      end: this.end,
      value: this.value,
      source,
    });
  }

  #syncClearButtonState() {
    if (!this.#clearButton) return;
    this.#clearButton.disabled = this.disabled || (!this.start && !this.end);
  }

  #syncFormValue() {
    this.setFormValue();
  }

  #syncValidity() {
    if (!this.#startInput || !this.#endInput) return;

    if (this.required && (!this.start || !this.end)) {
      const anchor = this.start ? this.#endInput : this.#startInput;
      this.setValidity({ valueMissing: true }, "Please select a start and end date.", anchor);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.start && this.min && this.start < this.min) {
      this.setValidity({ rangeUnderflow: true }, "Start date is before minimum.", this.#startInput);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.end && this.min && this.end < this.min) {
      this.setValidity({ rangeUnderflow: true }, "End date is before minimum.", this.#endInput);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.start && this.max && this.start > this.max) {
      this.setValidity({ rangeOverflow: true }, "Start date is after maximum.", this.#startInput);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.end && this.max && this.end > this.max) {
      this.setValidity({ rangeOverflow: true }, "End date is after maximum.", this.#endInput);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.start && this.end && this.start > this.end) {
      this.setValidity({ customError: true }, "End date must be on or after start date.", this.#endInput);
      this.#setAutoInvalid(true);
      return;
    }

    this.setValidity({}, "", this.#endInput);
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
      this.internals.role = "group";
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

define("rowan-date-range-picker", RowanDateRangePicker);