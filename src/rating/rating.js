import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

let ratingId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeInteger(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : fallback;
}

function normalizeStep(value) {
  return Math.max(1, normalizeInteger(value, 1));
}

function normalizeValue(value, min, max, step) {
  const text = normalizeText(value);
  if (!text) return "";

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) return "";

  const clamped = Math.min(max, Math.max(min, Math.round(numeric)));
  const stepped = min + Math.round((clamped - min) / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

/**
 * Bounded form-associated rating input.
 * @tag rowan-rating
 * @attr {string} name
 * @attr {number} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart rating
 * @csspart star
 * @csspart clear
 * @csspart value
 * @cssprop --rowan-rating-active
 * @cssprop --rowan-rating-inactive
 * @cssprop --rowan-rating-focus-ring
 * @event rowan-change - Fired when a user changes or clears the rating.
 */
export class RowanRating extends BaseElement {
  static formAssociated = true;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./rating.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-rating-"];
  static observedAttributes = [
    "name",
    "value",
    "min",
    "max",
    "step",
    "label",
    "description",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "min",
    "max",
    "step",
    "label",
    "description",
    "disabled",
    "required",
    "invalid",
  ];

  #control = null;
  #labelFallback = null;
  #descriptionFallback = null;
  #rating = null;
  #clearButton = null;
  #valueOutput = null;
  #defaultValue = undefined;
  #pendingFocusValue = null;

  connectedCallback() {
    super.connectedCallback();

    this.#normalizeCurrentValue();

    if (this.#defaultValue === undefined) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      ratingId += 1;
      this.id = `rowan-rating-${ratingId}`;
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (["min", "max", "step"].includes(name)) {
      this.#normalizeCurrentValue();
    }

    if (["name", "value", "min", "max", "step", "disabled"].includes(name)) {
      this.#syncFormValue();
    }

    if (["value", "min", "max", "step", "disabled", "required"].includes(name)) {
      this.#syncValidity();
    }

    if (["label", "description", "disabled", "required", "invalid", "value"].includes(name)) {
      this.#applyDefaultA11y();
    }
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", normalizeText(value) || null);
    this.#syncFormValue();
  }

  /** @returns {number} */
  get min() {
    return normalizeInteger(this.readString("min", "1"), 1);
  }

  /** @param {number | string} value */
  set min(value) {
    this.reflectNumber("min", normalizeInteger(value, 1));
    this.#syncFormValue();
    this.#syncValidity();
  }

  /** @returns {number} */
  get max() {
    return Math.max(this.min, normalizeInteger(this.readString("max", "5"), 5));
  }

  /** @param {number | string} value */
  set max(value) {
    this.reflectNumber("max", Math.max(this.min, normalizeInteger(value, 5)));
    this.#syncFormValue();
    this.#syncValidity();
  }

  /** @returns {number} */
  get step() {
    return normalizeStep(this.readString("step", "1"));
  }

  /** @param {number | string} value */
  set step(value) {
    this.reflectNumber("step", normalizeStep(value));
    this.#syncFormValue();
    this.#syncValidity();
  }

  /** @returns {number | ""} */
  get value() {
    return normalizeValue(this.readString("value", ""), this.min, this.max, this.step);
  }

  /** @param {number | string | null | undefined} value */
  set value(value) {
    const normalized = normalizeValue(value, this.min, this.max, this.step);
    this.reflectNumber("value", normalized);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", normalizeText(value) || null);
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

  clear() {
    this.value = "";
  }

  setFormValue(
    value = this.disabled || this.value === "" ? null : String(this.value),
    state = this.value === "" ? null : String(this.value),
  ) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#rating) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      if (anchor instanceof HTMLElement) {
        this.internals.setValidity(flags, message, anchor);
      } else {
        this.internals.setValidity(flags, message);
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
    if (!this.#control) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <div class="heading">
            <div class="rating-label" part="label"><slot name="label"><span class="label-fallback"></span></slot></div>
            <div class="description" part="description"><slot name="description"><span class="description-fallback"></span></slot></div>
          </div>
          <div class="actions">
            <div class="rating" part="rating" role="radiogroup"></div>
            <button class="clear" part="clear" type="button" aria-label="Clear rating" title="Clear rating"><span aria-hidden="true">x</span></button>
          </div>
          <output class="value" part="value"></output>
        </div>
      `;

      this.#control = this.renderRoot.querySelector(".control");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#descriptionFallback = this.renderRoot.querySelector(".description-fallback");
      this.#rating = this.renderRoot.querySelector(".rating");
      this.#clearButton = this.renderRoot.querySelector(".clear");
      this.#valueOutput = this.renderRoot.querySelector(".value");

      this.listen(this.#rating, "click", (event) => this.#handleRatingClick(event));
      this.listen(this.#rating, "keydown", (event) => this.#handleRatingKeydown(event));
      this.listen(this.#clearButton, "click", () => this.#clearUserValue());
    }

    const label = this.label;
    const description = this.description;
    this.#labelFallback.textContent = label;
    this.#labelFallback.hidden = label.length === 0;
    this.#descriptionFallback.textContent = description;
    this.#descriptionFallback.hidden = description.length === 0;
    this.#rating.setAttribute("aria-label", label || "Rating");
    this.#clearButton.disabled = this.disabled;
    this.#clearButton.hidden = this.value === "";
    this.#valueOutput.textContent = this.#valueText();

    this.#renderRatingButtons();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();

    if (this.#pendingFocusValue !== null) {
      const button = this.#buttonForValue(this.#pendingFocusValue);
      this.#pendingFocusValue = null;
      button?.focus({ preventScroll: true });
    }
  }

  #ratingValues() {
    const values = [];
    const { min, max, step } = this;

    for (let value = min; value <= max; value += step) {
      values.push(value);
    }

    if (values.at(-1) !== max) {
      values.push(max);
    }

    return values;
  }

  #renderRatingButtons() {
    const values = this.#ratingValues();
    const selectedValue = this.value;
    const focusValue = selectedValue === "" ? (values.at(0) ?? null) : selectedValue;
    const fragment = document.createDocumentFragment();

    for (const value of values) {
      const button = document.createElement("button");
      const star = document.createElement("span");
      const isFilled = selectedValue !== "" && value <= selectedValue;

      button.className = "star";
      button.classList.toggle("is-filled", isFilled);
      button.part.add("star");
      button.type = "button";
      button.dataset.value = String(value);
      button.disabled = this.disabled;
      button.tabIndex = !button.disabled && value === focusValue ? 0 : -1;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", value === selectedValue ? "true" : "false");
      button.setAttribute("aria-label", this.#ratingButtonLabel(value));
      button.setAttribute("aria-posinset", String(values.indexOf(value) + 1));
      button.setAttribute("aria-setsize", String(values.length));

      star.className = "star-icon";
      star.setAttribute("aria-hidden", "true");
      star.textContent = isFilled ? "★" : "☆";
      button.append(star);
      fragment.append(button);
    }

    this.#rating.textContent = "";
    this.#rating.append(fragment);
  }

  #normalizeCurrentValue() {
    if (!this.hasAttribute("value")) return;

    const normalized = this.value;
    this.reflectNumber("value", normalized === "" ? null : normalized);
  }

  #syncFormValue() {
    this.setFormValue();
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity({ valueMissing: true }, "Please choose a rating.", this.#rating);
      return;
    }

    this.setValidity({}, "", this.#rating);
  }

  #isValueMissing() {
    return this.required && !this.disabled && this.value === "";
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || "Rating";
    }

    if (!this.hasAttribute("aria-description") && "ariaDescription" in this.internals) {
      this.internals.ariaDescription = this.description || null;
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = this.invalid || this.#isValueMissing() ? "true" : "false";
    }
  }

  #handleRatingClick(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    this.#commitUserValue(Number(button.dataset.value));
  }

  #handleRatingKeydown(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    const buttons = [...this.#rating.querySelectorAll("button:not(:disabled)")];
    const index = buttons.indexOf(button);
    if (index === -1) return;

    let target = null;
    if (event.key === keys.ARROW_RIGHT || event.key === keys.ARROW_UP) {
      target = buttons[index + 1] ?? buttons.at(0);
    } else if (event.key === keys.ARROW_LEFT || event.key === keys.ARROW_DOWN) {
      target = buttons[index - 1] ?? buttons.at(-1);
    } else if (event.key === keys.HOME) {
      target = buttons.at(0);
    } else if (event.key === keys.END) {
      target = buttons.at(-1);
    } else if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      this.#commitUserValue(Number(button.dataset.value));
      return;
    }

    if (!target) return;
    event.preventDefault();
    this.#pendingFocusValue = Number(target.dataset.value);
    this.#commitUserValue(Number(target.dataset.value));
  }

  #clearUserValue() {
    if (this.disabled || this.value === "") return;

    this.value = "";
    emit(this, "rowan-change", { value: "" });
  }

  #commitUserValue(value) {
    if (this.disabled) return;

    const previous = this.value;
    this.value = value;
    if (previous === this.value) return;

    emit(this, "rowan-change", { value: this.value });
  }

  #valueText() {
    const value = this.value;
    if (value === "") return "No rating selected";

    return `${value} of ${this.max}`;
  }

  #ratingButtonLabel(value) {
    return `${value} of ${this.max} stars`;
  }

  #buttonFromEvent(event) {
    return event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.value);
  }

  #buttonForValue(value) {
    return [...this.#rating.querySelectorAll("button")].find(
      (button) => Number(button.dataset.value) === value,
    );
  }
}

define("rowan-rating", RowanRating);
