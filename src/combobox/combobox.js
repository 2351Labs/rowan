import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { validityMessage } from "../lib/validity-messages.js";

import "../option/option.js";

let comboboxId = 0;

/** @typedef {string | { value: string, label?: string, disabled?: boolean }} RowanComboboxOption */

/**
 * Filterable text entry with a listbox of suggestions.
 * Focus stays in the input and the highlighted option is reported with
 * `aria-activedescendant`, matching the APG combobox pattern.
 * @tag rowan-combobox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {boolean} open
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {RowanComboboxOption[]} options - Available suggestions. Arrays are property-only.
 * @csspart control
 * @csspart label
 * @csspart input
 * @csspart panel
 * @csspart list
 * @csspart empty
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanCombobox extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./combobox.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "value",
    "label",
    "placeholder",
    "open",
    "disabled",
    "required",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "label",
    "placeholder",
    "open",
    "disabled",
    "required",
    "options",
  ];

  #input = null;
  #panel = null;
  #list = null;
  #empty = null;
  #fallbackLabel = null;
  #defaultValue = null;
  #inputId = "";
  #listId = "";
  #options = [];
  #autoInvalid = false;
  #activeValue = "";
  #filtering = false;
  #lastEmittedValue = null;
  #hasDocumentPointerListener = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (this.#lastEmittedValue === null) {
      this.#lastEmittedValue = this.value;
    }

    if (!this.id) {
      comboboxId += 1;
      this.id = `rowan-combobox-${comboboxId}`;
    }

    this.#inputId = `${this.id}__input`;
    this.#listId = `${this.id}__list`;

    if (!this.#hasDocumentPointerListener) {
      this.listen(document, "pointerdown", (event) => this.#handleDocumentPointerDown(event));
      this.#hasDocumentPointerListener = true;
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  /** @returns {RowanComboboxOption[]} */
  get options() {
    return this.#options;
  }

  /** @param {RowanComboboxOption[]} value */
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
        <div class="control" part="control">
          <label class="sr-only" part="label"></label>
          <input class="input" part="input" type="text" autocomplete="off" role="combobox" />
          <div class="panel" part="panel" hidden>
            <div class="list" part="list" role="listbox"></div>
            <div class="empty" part="empty" role="status" hidden>No matching options.</div>
          </div>
        </div>
      `;

      this.#input = this.renderRoot.querySelector("input");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#list = this.renderRoot.querySelector(".list");
      this.#empty = this.renderRoot.querySelector(".empty");
      this.#fallbackLabel = this.renderRoot.querySelector("label");

      this.listen(this.#input, "input", () => {
        this.#filtering = true;
        this.value = this.#input.value;
        this.open = !this.disabled;
        this.#activeValue = "";
      });

      this.listen(this.#input, "change", () => {
        this.#commitValue(this.#input.value);
      });

      this.listen(this.#input, "keydown", (event) => this.#handleInputKeydown(event));
      this.listen(this.#list, "click", (event) => this.#handleListClick(event));
    }

    this.#renderOptions();

    this.#input.id = this.#inputId;
    this.#input.name = this.name;
    this.#writeInputValue();
    this.#input.placeholder = this.placeholder;
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;

    this.#list.id = this.#listId;
    this.#input.setAttribute("aria-controls", this.#listId);
    this.#input.setAttribute("aria-autocomplete", "list");
    this.#input.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.#panel.hidden = !this.open;

    const fallbackLabelText = this.label || this.externalLabelText;
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
    const visible = this.#visibleOptions();
    this.#list.textContent = "";

    if (!visible.some((item) => item.value === this.#activeValue)) {
      this.#activeValue = visible.find((item) => !item.disabled)?.value ?? "";
    }

    let activeId = "";

    visible.forEach((item, index) => {
      const option = document.createElement("rowan-option");
      option.id = `${this.#listId}-option-${index}`;
      option.value = item.value;
      option.label = item.label;
      option.disabled = item.disabled;
      option.selected = item.value === this.value;

      const isActive = item.value === this.#activeValue && !item.disabled;
      option.setActiveDescendant(isActive, this);
      if (isActive) activeId = option.id;

      this.#list.append(option);
    });

    this.#empty.hidden = visible.length > 0;

    if (activeId && this.open) {
      this.#input.setAttribute("aria-activedescendant", activeId);
    } else {
      this.#input.removeAttribute("aria-activedescendant");
    }
  }

  #visibleOptions() {
    const options = this.#resolvedOptions();
    const query = this.#filtering ? this.#input.value.trim().toLocaleLowerCase() : "";
    if (query.length === 0) return options;

    return options.filter((item) =>
      `${item.label} ${item.value}`.toLocaleLowerCase().includes(query),
    );
  }

  #resolvedOptions() {
    return this.#options
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item, disabled: false };
        }

        if (item && typeof item === "object") {
          const value = "value" in item ? String(item.value) : "";
          const label = "label" in item ? String(item.label) : value;
          return { value, label, disabled: Boolean(item.disabled) };
        }

        return null;
      })
      .filter(Boolean);
  }

  #availableOptions() {
    return this.#visibleOptions().filter((item) => !item.disabled);
  }

  #moveActive(step) {
    const available = this.#availableOptions();
    if (available.length === 0) return;

    const currentIndex = available.findIndex((item) => item.value === this.#activeValue);
    const nextIndex = (currentIndex + step + available.length) % available.length;
    this.#activeValue = available[currentIndex === -1 ? 0 : nextIndex].value;
    this.requestRender();
  }

  #handleInputKeydown(event) {
    if (this.disabled) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      if (!this.open) {
        this.#filtering = false;
        this.open = true;
        this.requestRender();
        return;
      }

      this.#moveActive(1);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      if (!this.open) {
        this.#filtering = false;
        this.open = true;
        this.requestRender();
        return;
      }

      this.#moveActive(-1);
      return;
    }

    if (!this.open) return;

    if (event.key === keys.ENTER) {
      if (!this.#activeValue) return;

      event.preventDefault();
      this.#commitValue(this.#activeValue);
      return;
    }

    if (event.key === keys.ESCAPE) {
      event.preventDefault();
      this.open = false;
      return;
    }

    if (event.key === keys.TAB) {
      this.open = false;
    }
  }

  #handleListClick(event) {
    const target = event
      .composedPath()
      .find((node) => node instanceof HTMLElement && node.localName === "rowan-option");
    if (!target || target.disabled) return;

    event.preventDefault();
    this.#commitValue(target.value);
    this.#input.focus();
  }

  #handleDocumentPointerDown(event) {
    if (!this.open || !(event.target instanceof Node)) return;
    if (event.composedPath().includes(this)) return;

    this.open = false;
  }

  #commitValue(nextValue) {
    const next = String(nextValue ?? "");
    this.#filtering = false;
    this.open = false;
    this.value = next;
    this.#activeValue = next;

    if (next === this.#lastEmittedValue) return;

    this.#lastEmittedValue = next;
    emit(this, "rowan-change", { value: next });
  }

  // Never write back into the field while the user is typing in it.
  #writeInputValue() {
    if (document.activeElement === this && this.#input.value !== this.value && this.#filtering) {
      return;
    }

    if (this.#input.value === this.value) return;

    this.#input.value = this.value;
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#input) return;

    if (this.required && this.value.trim().length === 0) {
      this.setValidity({ valueMissing: true }, validityMessage("valueMissing"), this.#input);
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

    // The popup belongs to the native datalist, so the host cannot honestly report combobox
    // expansion state. The inner input carries the combobox semantics instead.

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
