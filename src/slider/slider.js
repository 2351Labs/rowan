import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let sliderId = 0;

function finiteNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function precisionFor(value) {
  const text = String(value).toLowerCase();
  if (!text.includes("e")) {
    return Math.min(10, (text.split(".")[1] ?? "").length);
  }

  const [coefficient, exponentText] = text.split("e");
  const exponent = Number(exponentText);
  const decimals = (coefficient.split(".")[1] ?? "").length;
  return Math.min(10, Math.max(0, decimals - exponent));
}

function formatNumber(value) {
  return String(Number(value.toFixed(10)));
}

function normalizeStep(value) {
  const numeric = finiteNumber(value, 1);
  return numeric > 0 ? numeric : 1;
}

function normalizeValue(value, min, max, step, fallback) {
  const numeric = finiteNumber(value, fallback);
  const clamped = Math.min(max, Math.max(min, numeric));

  if (clamped === min || clamped === max) return clamped;

  const stepped = min + Math.round((clamped - min) / step) * step;
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(precisionFor(step)));
}

function parseRangeState(state) {
  const [start, end] = String(state ?? "").split("|", 2);
  return { start, end };
}

/**
 * Numeric slider with single-value and ordered range modes.
 * @tag rowan-slider
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {number} value
 * @attr {number} start
 * @attr {number} end
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label
 * @attr {boolean} range
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart slider
 * @csspart track
 * @csspart range
 * @csspart input
 * @csspart start-input
 * @csspart end-input
 * @csspart value
 * @cssprop --rowan-slider-track-bg
 * @cssprop --rowan-slider-range-bg
 * @cssprop --rowan-slider-thumb-bg
 * @event rowan-change - Fired when a user changes a slider value
 */
export class RowanSlider extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./slider.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-slider-"];
  static observedAttributes = [
    "name",
    "name-start",
    "name-end",
    "value",
    "start",
    "end",
    "min",
    "max",
    "step",
    "label",
    "range",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "nameStart",
    "nameEnd",
    "value",
    "start",
    "end",
    "min",
    "max",
    "step",
    "label",
    "range",
    "disabled",
    "required",
    "invalid",
    "formatValue",
  ];

  #control = null;
  #fallbackLabel = null;
  #singleInput = null;
  #startInput = null;
  #endInput = null;
  #valueOutput = null;
  #defaultValue = null;
  #defaultStart = null;
  #defaultEnd = null;
  #formatValue = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.#singleValue();
      const { start, end } = this.#rangeValues();
      this.#defaultStart = start;
      this.#defaultEnd = end;
    }

    if (!this.id) {
      sliderId += 1;
      this.id = `rowan-slider-${sliderId}`;
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (["value", "start", "end", "min", "max", "step", "range", "disabled"].includes(name)) {
      this.#syncFormValue();
      this.#syncValidity();
    }

    if (["label", "range", "disabled", "required", "invalid"].includes(name)) {
      this.#applyDefaultA11y();
    }
  }

  get name() {
    return this.readString("name", "").trim();
  }

  set name(value) {
    this.reflectString("name", String(value ?? "").trim() || null);
    this.#syncFormValue();
  }

  get nameStart() {
    const configured = this.readString("name-start", "").trim();
    return configured || (this.name ? `${this.name}-start` : "");
  }

  set nameStart(value) {
    this.reflectString("name-start", String(value ?? "").trim() || null);
    this.#syncFormValue();
  }

  get nameEnd() {
    const configured = this.readString("name-end", "").trim();
    return configured || (this.name ? `${this.name}-end` : "");
  }

  set nameEnd(value) {
    this.reflectString("name-end", String(value ?? "").trim() || null);
    this.#syncFormValue();
  }

  get min() {
    return finiteNumber(this.readString("min", "0"), 0);
  }

  set min(value) {
    const next = finiteNumber(value, 0);
    this.reflectNumber("min", next);
    this.#normalizeValues();
  }

  get max() {
    return Math.max(this.min, finiteNumber(this.readString("max", "100"), 100));
  }

  set max(value) {
    const next = Math.max(this.min, finiteNumber(value, 100));
    this.reflectNumber("max", next);
    this.#normalizeValues();
  }

  get step() {
    return normalizeStep(this.readString("step", "1"));
  }

  set step(value) {
    this.reflectNumber("step", normalizeStep(value));
    this.#normalizeValues();
  }

  get range() {
    return this.readBoolean("range");
  }

  set range(value) {
    this.reflectBoolean("range", Boolean(value));
    this.#syncFormValue();
    this.#syncValidity();
  }

  get value() {
    return this.range ? { ...this.#rangeValues() } : this.#singleValue();
  }

  set value(value) {
    if (this.range) {
      if (value && typeof value === "object") {
        this.#setRangeValues(value.start, value.end);
      } else {
        this.start = value;
      }
      return;
    }

    this.#setSingleValue(value);
  }

  get start() {
    return this.#rangeValues().start;
  }

  set start(value) {
    const current = this.#rangeValues();
    const next = this.#normalize(value, current.start);
    this.#setRangeValues(next, Math.max(next, current.end));
  }

  get end() {
    return this.#rangeValues().end;
  }

  set end(value) {
    const current = this.#rangeValues();
    const next = this.#normalize(value, current.end);
    this.#setRangeValues(Math.min(current.start, next), next);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
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

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.reflectBoolean("invalid", Boolean(value));
  }

  get formatValue() {
    return this.#formatValue;
  }

  set formatValue(value) {
    this.#formatValue = typeof value === "function" ? value : null;
    this.requestRender();
  }

  setFormValue() {
    if (!this.internals || typeof this.internals.setFormValue !== "function") return;

    if (this.disabled) {
      this.internals.setFormValue(null);
      return;
    }

    if (!this.range) {
      const value = formatNumber(this.#singleValue());
      this.internals.setFormValue(value, value);
      return;
    }

    const { start, end } = this.#rangeValues();
    const state = `${formatNumber(start)}|${formatNumber(end)}`;
    const startName = this.nameStart;
    const endName = this.nameEnd;

    if (startName || endName) {
      const formData = new FormData();
      if (startName) formData.append(startName, formatNumber(start));
      if (endName) formData.append(endName, formatNumber(end));
      this.internals.setFormValue(formData, state);
      return;
    }

    this.internals.setFormValue(state, state);
  }

  setValidity(flags = {}, message = "", anchor = this.#singleInput) {
    if (!this.internals || typeof this.internals.setValidity !== "function") return;

    if (anchor instanceof HTMLElement) {
      this.internals.setValidity(flags, message, anchor);
      return;
    }

    this.internals.setValidity(flags, message);
  }

  formResetCallback() {
    if (this.range) {
      this.#setRangeValues(this.#defaultStart, this.#defaultEnd);
    } else {
      this.#setSingleValue(this.#defaultValue);
    }
    this.requestRender();
  }

  formStateRestoreCallback(state) {
    if (this.range) {
      const { start, end } = parseRangeState(state);
      this.#setRangeValues(start, end);
    } else {
      this.#setSingleValue(state);
    }
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
    if (!this.#control) {
      this.renderRoot.innerHTML = `
        <div class="control" part="slider">
          <label class="sr-only" part="label"></label>
          <div class="rail">
            <div class="track" part="track"><span class="selected-range" part="range"></span></div>
            <input class="input single-input" part="input" type="range" data-endpoint="value" />
            <input class="input range-input start-input" part="start-input" type="range" data-endpoint="start" hidden />
            <input class="input range-input end-input" part="end-input" type="range" data-endpoint="end" hidden />
          </div>
          <output class="value" part="value"></output>
        </div>
      `;

      this.#control = this.renderRoot.querySelector(".control");
      this.#fallbackLabel = this.renderRoot.querySelector("label");
      this.#singleInput = this.renderRoot.querySelector(".single-input");
      this.#startInput = this.renderRoot.querySelector(".start-input");
      this.#endInput = this.renderRoot.querySelector(".end-input");
      this.#valueOutput = this.renderRoot.querySelector("output");

      [this.#singleInput, this.#startInput, this.#endInput].forEach((input) => {
        this.listen(input, "input", () => this.#commitUserInput(input));
        this.listen(input, "change", () => this.#commitUserInput(input));
        this.listen(input, "keydown", (event) => this.#handleKeydown(event, input));
      });
    }

    const { start, end } = this.#rangeValues();
    const singleValue = this.#singleValue();
    const isRange = this.range;
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const percentage = (value) => (max === min ? 0 : ((value - min) / (max - min)) * 100);
    const selectedStart = isRange ? start : min;
    const selectedEnd = isRange ? end : singleValue;

    this.#control.style.setProperty("--slider-start", `${percentage(selectedStart)}%`);
    this.#control.style.setProperty("--slider-end", `${percentage(selectedEnd)}%`);
    this.#control.classList.toggle("is-range", isRange);

    this.#syncInput(this.#singleInput, singleValue, min, max, step, !isRange, "value");
    this.#syncInput(this.#startInput, start, min, max, step, isRange, "start");
    this.#syncInput(this.#endInput, end, min, max, step, isRange, "end");

    const fallbackLabelText = this.label.trim();
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;
    this.#valueOutput.textContent = this.#formattedValue();

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #singleValue() {
    return this.#normalize(this.readString("value", ""), this.min);
  }

  #rangeValues() {
    const start = this.#normalize(this.readString("start", ""), this.min);
    const end = this.#normalize(this.readString("end", ""), this.max);
    return start <= end ? { start, end } : { start: end, end: start };
  }

  #normalize(value, fallback) {
    return normalizeValue(value, this.min, this.max, this.step, fallback);
  }

  #setSingleValue(value) {
    const next = this.#normalize(value, this.min);
    this.reflectNumber("value", next);
    this.#syncFormValue();
    this.#syncValidity();
  }

  #setRangeValues(start, end) {
    const normalizedStart = this.#normalize(start, this.min);
    const normalizedEnd = this.#normalize(end, this.max);
    const first = Math.min(normalizedStart, normalizedEnd);
    const last = Math.max(normalizedStart, normalizedEnd);

    this.reflectNumber("start", first);
    this.reflectNumber("end", last);
    this.#syncFormValue();
    this.#syncValidity();
  }

  #normalizeValues() {
    this.#setSingleValue(this.#singleValue());
    const { start, end } = this.#rangeValues();
    this.#setRangeValues(start, end);
  }

  #syncInput(input, value, min, max, step, visible, endpoint) {
    input.min = formatNumber(min);
    input.max = formatNumber(max);
    input.step = formatNumber(step);
    input.value = formatNumber(value);
    input.hidden = !visible;
    input.disabled = this.disabled;

    const label = this.label.trim() || "Value";
    input.setAttribute("aria-label", this.range ? `${label} ${endpoint}` : label);
    input.setAttribute("aria-valuetext", formatNumber(value));
  }

  #commitUserInput(input) {
    if (this.disabled) return;

    const endpoint = input.dataset.endpoint;
    const previous = this.#serializedValue();

    if (endpoint === "value") {
      this.#setSingleValue(input.value);
    } else if (endpoint === "start") {
      const { end } = this.#rangeValues();
      this.#setRangeValues(Math.min(this.#normalize(input.value, end), end), end);
    } else if (endpoint === "end") {
      const { start } = this.#rangeValues();
      this.#setRangeValues(start, Math.max(this.#normalize(input.value, start), start));
    }

    if (previous === this.#serializedValue()) return;
    this.#emitChange(endpoint);
  }

  #handleKeydown(event, input) {
    if (this.disabled) return;

    const endpoint = input.dataset.endpoint;
    const current = Number(input.value);
    const pageStep = this.step * 10;
    let next = null;

    if (["ArrowDown", "ArrowLeft"].includes(event.key)) next = current - this.step;
    if (["ArrowUp", "ArrowRight"].includes(event.key)) next = current + this.step;
    if (event.key === "PageDown") next = current - pageStep;
    if (event.key === "PageUp") next = current + pageStep;
    if (event.key === "Home") next = this.min;
    if (event.key === "End") next = this.max;
    if (next === null) return;

    event.preventDefault();
    input.value = formatNumber(this.#normalize(next, current));
    this.#commitUserInput(input);
  }

  #serializedValue() {
    if (!this.range) return formatNumber(this.#singleValue());
    const { start, end } = this.#rangeValues();
    return `${formatNumber(start)}|${formatNumber(end)}`;
  }

  #formattedValue() {
    const value = this.value;
    const fallback = this.range
      ? `${formatNumber(value.start)} - ${formatNumber(value.end)}`
      : formatNumber(value);

    if (!this.#formatValue) return fallback;

    try {
      const formatted = this.#formatValue(value, {
        min: this.min,
        max: this.max,
        step: this.step,
        range: this.range,
      });
      return formatted == null ? fallback : String(formatted);
    } catch {
      return fallback;
    }
  }

  #emitChange(source) {
    emit(this, "rowan-change", {
      value: this.value,
      start: this.start,
      end: this.end,
      source,
    });
  }

  #syncFormValue() {
    this.setFormValue();
  }

  #syncValidity() {
    const anchor = this.range ? this.#startInput : this.#singleInput;
    this.setValidity({}, "", anchor);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = this.range ? "group" : "slider";
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
      this.internals.ariaLabel = this.label.trim() || null;
    }
  }
}

define("rowan-slider", RowanSlider);