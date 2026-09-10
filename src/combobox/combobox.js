import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let comboboxId = 0;

/**
 * Filterable text entry with suggestions.
 * @tag rowan-combobox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @csspart input
 * @csspart list
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the committed value changes
 */
export class RowanCombobox extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./combobox.css", import.meta.url).href;
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

  #input = null;
  #list = null;
  #fallbackLabel = null;
  #defaultValue = null;
  #inputId = "";
  #listId = "";
  #options = [];
  #autoInvalid = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      comboboxId += 1;
      this.id = `rowan-combobox-${comboboxId}`;
    }

    this.#inputId = `${this.id}__input`;
    this.#listId = `${this.id}__list`;

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
          <input class="input" part="input" type="text" autocomplete="off" />
          <datalist class="list" part="list"></datalist>
        </div>
      `;

      this.#input = this.renderRoot.querySelector("input");
      this.#list = this.renderRoot.querySelector("datalist");
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

    this.#renderOptions();

    this.#input.id = this.#inputId;
    this.#input.name = this.name;
    this.#input.value = this.value;
    this.#input.placeholder = this.placeholder;
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;
    this.#input.setAttribute("list", this.#listId);

    this.#list.id = this.#listId;

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

  #renderOptions() {
    const options = this.#resolvedOptions();
    this.#list.textContent = "";

    for (const item of options) {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      this.#list.append(option);
    }
  }

  #resolvedOptions() {
    return this.#options
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item };
        }

        if (item && typeof item === "object") {
          const value = "value" in item ? String(item.value) : "";
          const label = "label" in item ? String(item.label) : value;
          return { value, label };
        }

        return null;
      })
      .filter(Boolean);
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#input) return;

    if (this.required && this.value.trim().length === 0) {
      this.setValidity({ valueMissing: true }, "Please fill out this field.", this.#input);
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

    const invalidState = this.required && this.value.trim().length === 0 ? "true" : "false";

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "combobox";
    }

    if (!this.hasAttribute("aria-autocomplete") && "ariaAutoComplete" in this.internals) {
      this.internals.ariaAutoComplete = "list";
    }

    if (!this.hasAttribute("aria-expanded") && "ariaExpanded" in this.internals) {
      this.internals.ariaExpanded = "false";
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

define("rowan-combobox", RowanCombobox);
