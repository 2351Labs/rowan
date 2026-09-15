import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let textFieldId = 0;

const validityFlags = [
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing",
];

function validityStateToFlags(validity) {
  return Object.fromEntries(
    validityFlags.filter((flag) => validity[flag]).map((flag) => [flag, true]),
  );
}

/**
 * Single-line text input with form association.
 * @tag rowan-text-field
 * @attr {string} name
 * @attr {string} value - Not reflected when type is "password", so the secret never enters the DOM.
 * @attr {string} placeholder
 * @attr {string} label
 * @attr {"text"|"email"|"password"|"search"|"url"|"tel"} type
 * @attr {string} pattern
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart input
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanTextField extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./text-field.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "value",
    "placeholder",
    "label",
    "type",
    "pattern",
    "disabled",
    "required",
    "invalid",
    "autocomplete",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "placeholder",
    "label",
    "type",
    "pattern",
    "disabled",
    "required",
    "invalid",
    "autocomplete",
  ];

  #input = null;
  #fallbackLabel = null;
  #defaultValue = null;
  #inputId = "";
  #autoInvalid = false;
  #value = null;

  connectedCallback() {
    super.connectedCallback();

    this.#evictSecretAttribute();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      textFieldId += 1;
      this.id = `rowan-text-field-${textFieldId}`;
    }

    this.#inputId = `${this.id}__input`;

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (name === "value" && !this.#isSecret()) {
      this.#value = newValue ?? "";
      this.#syncFormValue();
      this.#syncValidity();
    }

    if (name === "type") {
      this.#evictSecretAttribute();
    }
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get value() {
    return this.#value ?? this.readString("value", "");
  }

  set value(value) {
    const next = String(value ?? "");
    this.#value = next;

    if (this.#isSecret()) {
      this.removeAttribute("value");
    } else {
      this.reflectString("value", next);
    }

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

  /** @returns {"text" | "email" | "password" | "search" | "url" | "tel"} */
  get type() {
    return this.readString("type", "text");
  }

  /** @param {"text" | "email" | "password" | "search" | "url" | "tel"} value */
  set type(value) {
    this.reflectString("type", value);
    this.#evictSecretAttribute();
    this.#syncValidity();
  }

  get pattern() {
    return this.readString("pattern", "");
  }

  set pattern(value) {
    this.reflectString("pattern", value);
    this.#syncValidity();
  }

  get autocomplete() {
    return this.readString("autocomplete", "");
  }

  set autocomplete(value) {
    this.reflectString("autocomplete", value);
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
      this.applyValidity(flags, message, anchor);
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
        <div class="control">
          <label class="sr-only" part="label"></label>
          <input class="input" part="input" type="text" />
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
    this.#input.placeholder = this.placeholder;
    this.#input.type = this.#normalizedType(this.type);
    this.#syncPattern();
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;
    this.#input.autocomplete = this.autocomplete;

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

  #isSecret() {
    return this.type === "password";
  }

  #evictSecretAttribute() {
    if (!this.#isSecret() || !this.hasAttribute("value")) return;

    this.#value = this.getAttribute("value") ?? "";
    this.removeAttribute("value");
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#input) return;

    this.#input.type = this.#normalizedType(this.type);
    this.#syncPattern();
    this.#input.required = this.required;
    this.#input.disabled = this.disabled;
    this.#input.value = this.value;

    if (!this.#input.validity.valid) {
      this.setValidity(
        validityStateToFlags(this.#input.validity),
        this.#input.validationMessage || "Please enter a valid value.",
        this.#input,
      );
      this.#setAutoInvalid(true);
      return;
    }

    this.setValidity({}, "", this.#input);
    this.#setAutoInvalid(false);
  }

  #syncPattern() {
    const pattern = this.pattern;
    if (pattern) {
      this.#input.pattern = pattern;
    } else {
      this.#input.removeAttribute("pattern");
    }
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
      this.internals.role = "textbox";
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

  #normalizedType(type) {
    if (
      type === "text" ||
      type === "email" ||
      type === "password" ||
      type === "search" ||
      type === "url" ||
      type === "tel"
    ) {
      return type;
    }

    return "text";
  }
}

define("rowan-text-field", RowanTextField);
