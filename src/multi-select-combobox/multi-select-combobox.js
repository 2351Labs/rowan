import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import "../listbox/listbox.js";

let multiSelectComboboxId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeSelected(value) {
  if (!Array.isArray(value)) return [];

  const selected = new Set();
  for (const item of value) {
    const next = String(item ?? "");
    if (next) selected.add(next);
  }
  return [...selected];
}

function parseRestoredSelection(state) {
  if (state == null) return [];

  try {
    const parsed = JSON.parse(String(state));
    if (Array.isArray(parsed)) return normalizeSelected(parsed);
  } catch {
    return normalizeSelected([state]);
  }

  return normalizeSelected([state]);
}

/**
 * Filterable multi-select control with removable selected values.
 * @tag rowan-multi-select-combobox
 * @attr {string} name
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} query
 * @attr {boolean} open
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {Array<string | { value: string, label?: string, disabled?: boolean }>} options - Available options. Arrays are property-only.
 * @property {string[]} selected - Selected option values. Arrays are property-only.
 * @csspart control
 * @csspart chips
 * @csspart chip
 * @csspart input
 * @csspart listbox
 * @csspart empty
 * @cssprop --rowan-multi-select-combobox-bg
 * @cssprop --rowan-multi-select-combobox-border
 * @event rowan-change - Fired when a user adds or removes a selected value
 */
export class RowanMultiSelectCombobox extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./multi-select-combobox.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-multi-select-combobox-"];
  static observedAttributes = [
    "name",
    "label",
    "placeholder",
    "query",
    "open",
    "disabled",
    "required",
  ];
  static upgradeProperties = [
    "name",
    "label",
    "placeholder",
    "query",
    "open",
    "disabled",
    "required",
    "options",
    "selected",
  ];

  #control = null;
  #chips = null;
  #input = null;
  #panel = null;
  #listbox = null;
  #empty = null;
  #fallbackLabel = null;
  #inputId = "";
  #listboxId = "";
  #options = [];
  #selected = [];
  #defaultSelected = null;
  #hasDocumentPointerListener = false;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#inputId) {
      multiSelectComboboxId += 1;
      const prefix = this.id || `rowan-multi-select-combobox-${multiSelectComboboxId}`;
      this.#inputId = `${prefix}__input`;
      this.#listboxId = `${prefix}__listbox`;
    }

    if (this.#defaultSelected === null) {
      this.#defaultSelected = [...this.selected];
    }

    if (!this.#hasDocumentPointerListener) {
      this.listen(document, "pointerdown", (event) => this.#handleDocumentPointerDown(event));
      this.#hasDocumentPointerListener = true;
    }
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

  get selected() {
    return [...this.#selected];
  }

  set selected(value) {
    this.#selected = normalizeSelected(value);
    this.requestRender();
    this.#syncFormValue();
    this.#syncValidity();
  }

  get selectedOptions() {
    const selected = new Set(this.selected);
    return this.#resolvedOptions().filter((option) => selected.has(option.value));
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
    this.#syncFormValue();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get placeholder() {
    return this.readString("placeholder", "Search options");
  }

  set placeholder(value) {
    const next = normalizeText(value);
    this.reflectString("placeholder", next && next !== "Search options" ? next : null);
  }

  get query() {
    return this.readString("query", "");
  }

  set query(value) {
    this.reflectString("query", value);
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
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

  setFormValue(value = null, state = undefined) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#input) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      if (anchor instanceof HTMLElement) {
        this.internals.setValidity(flags, message, anchor);
      } else {
        this.internals.setValidity(flags, message);
      }
    }
  }

  formResetCallback() {
    this.selected = this.#defaultSelected ?? [];
    this.query = "";
    this.open = false;
  }

  formStateRestoreCallback(state) {
    this.selected = parseRestoredSelection(state);
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
          <label class="sr-only" part="label"></label>
          <div class="chips" part="chips"></div>
          <input class="input" part="input" type="text" autocomplete="off" />
        </div>
        <div class="panel" part="panel" hidden>
          <rowan-listbox class="listbox" part="listbox" selection="multiple"></rowan-listbox>
          <div class="empty" part="empty" role="status" hidden>No matching options.</div>
        </div>
      `;
      this.#control = this.renderRoot.querySelector(".control");
      this.#chips = this.renderRoot.querySelector(".chips");
      this.#input = this.renderRoot.querySelector(".input");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#listbox = this.renderRoot.querySelector("rowan-listbox");
      this.#empty = this.renderRoot.querySelector(".empty");
      this.#fallbackLabel = this.renderRoot.querySelector("label");

      this.listen(this.#input, "focus", () => {
        if (!this.disabled) this.open = true;
      });
      this.listen(this.#input, "input", () => {
        this.query = this.#input.value;
        if (!this.disabled) this.open = true;
      });
      this.listen(this.#input, "keydown", (event) => this.#handleInputKeydown(event));
      this.listen(this.#chips, "click", (event) => this.#handleChipClick(event));
      this.listen(this.#listbox, "rowan-change", (event) => this.#handleListboxChange(event));
    }

    this.#renderChips();
    this.#renderOptions();

    this.#input.id = this.#inputId;
    this.#input.value = this.query;
    this.#input.placeholder = this.placeholder;
    this.#input.disabled = this.disabled;
    this.#input.setAttribute("role", "combobox");
    this.#input.setAttribute("aria-autocomplete", "list");
    this.#input.setAttribute("aria-controls", this.#listboxId);
    this.#input.setAttribute("aria-expanded", this.open ? "true" : "false");

    this.#fallbackLabel.textContent = this.label;
    this.#fallbackLabel.hidden = this.label.length === 0;
    this.#fallbackLabel.htmlFor = this.#inputId;
    if (this.label) {
      this.#input.setAttribute("aria-label", this.label);
    } else {
      this.#input.removeAttribute("aria-label");
    }

    this.#panel.hidden = !this.open;
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #resolvedOptions() {
    const values = new Set();
    const options = [];

    for (const item of this.#options) {
      const isString = typeof item === "string";
      const isObject = item && typeof item === "object";
      if (!isString && !isObject) continue;

      const value = normalizeText(isString ? item : item.value);
      if (!value || values.has(value)) continue;

      values.add(value);
      options.push({
        value,
        label: normalizeText(isString ? item : item.label) || value,
        disabled: Boolean(isObject && item.disabled),
      });
    }

    return options;
  }

  #filteredOptions() {
    const terms = normalizeText(this.query).toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return this.#resolvedOptions();

    return this.#resolvedOptions().filter((option) => {
      const searchText = `${option.label} ${option.value}`.toLocaleLowerCase();
      return terms.every((term) => searchText.includes(term));
    });
  }

  #renderChips() {
    this.#chips.textContent = "";
    const options = new Map(this.#resolvedOptions().map((option) => [option.value, option]));

    for (const value of this.selected) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.part.add("chip");

      const label = document.createElement("span");
      label.textContent = options.get(value)?.label ?? value;

      const remove = document.createElement("button");
      remove.className = "remove";
      remove.type = "button";
      remove.dataset.removeValue = value;
      remove.setAttribute("aria-label", `Remove ${label.textContent}`);
      remove.textContent = "×";

      chip.append(label, remove);
      this.#chips.append(chip);
    }
  }

  #renderOptions() {
    const options = this.#filteredOptions();
    this.#listbox.textContent = "";
    this.#listbox.id = this.#listboxId;
    this.#listbox.label = this.label ? `${this.label} options` : "Options";
    this.#listbox.disabled = this.disabled;

    for (const item of options) {
      const option = document.createElement("rowan-option");
      option.value = item.value;
      option.label = item.label;
      option.disabled = item.disabled;
      this.#listbox.append(option);
    }

    this.#listbox.selected = this.selected;
    this.#listbox.hidden = options.length === 0;
    this.#empty.hidden = options.length > 0;
  }

  #syncFormValue() {
    const selected = this.selected;
    const state = JSON.stringify(selected);
    if (this.disabled || !this.name || selected.length === 0) {
      this.setFormValue(null, state);
      return;
    }

    const formData = new FormData();
    for (const value of selected) {
      formData.append(this.name, value);
    }
    this.setFormValue(formData, state);
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity({ valueMissing: true }, "Please select at least one option.");
      return;
    }

    this.setValidity({});
  }

  #isValueMissing() {
    return this.required && !this.disabled && this.selected.length === 0;
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "combobox";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
    }

    if (!this.hasAttribute("aria-autocomplete") && "ariaAutoComplete" in this.internals) {
      this.internals.ariaAutoComplete = "list";
    }

    if (!this.hasAttribute("aria-expanded") && "ariaExpanded" in this.internals) {
      this.internals.ariaExpanded = this.open ? "true" : "false";
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

  #handleListboxChange(event) {
    event.stopPropagation();
    if (this.disabled) return;

    const visibleValues = new Set(this.#filteredOptions().map((option) => option.value));
    const selected = new Set(this.selected);
    const visibleSelected = new Set(event.detail.selected);

    for (const value of visibleValues) {
      if (visibleSelected.has(value)) {
        selected.add(value);
      } else {
        selected.delete(value);
      }
    }

    const next = normalizeSelected([...selected]);
    if (
      next.length === this.selected.length &&
      next.every((value, index) => value === this.selected[index])
    ) {
      return;
    }

    this.#selected = next;
    this.query = "";
    this.#syncFormValue();
    this.#syncValidity();
    this.requestRender();
    this.#emitChange(event.detail.value);
  }

  #handleChipClick(event) {
    const button = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.removeValue);
    if (!button || this.disabled) return;

    this.#removeValue(button.dataset.removeValue);
    this.#input.focus();
  }

  #handleInputKeydown(event) {
    if (this.disabled) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      this.open = true;
      setTimeout(() => this.#focusFirstOption());
      return;
    }

    if (event.key === keys.ENTER && this.open) {
      const option = this.#firstAvailableOption();
      if (!option) return;
      event.preventDefault();
      option.click();
      return;
    }

    if (event.key === keys.ESCAPE && this.open) {
      event.preventDefault();
      this.open = false;
      return;
    }

    if (event.key === "Backspace" && this.query.length === 0) {
      const value = this.selected.at(-1);
      if (!value) return;
      event.preventDefault();
      this.#removeValue(value);
    }
  }

  #handleDocumentPointerDown(event) {
    if (!this.open || !(event.target instanceof Node)) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
  }

  #firstAvailableOption() {
    return [...this.#listbox.querySelectorAll("rowan-option")].find(
      (option) => !option.disabled && !option.hidden,
    );
  }

  #focusFirstOption(attempt = 0) {
    const option = this.#firstAvailableOption();
    if (!option || option.tabIndex !== 0) {
      if (attempt < 3) setTimeout(() => this.#focusFirstOption(attempt + 1));
      return;
    }

    option.focus({ preventScroll: true });
  }

  #removeValue(value) {
    const selected = this.selected.filter((item) => item !== value);
    if (selected.length === this.selected.length) return;

    this.#selected = selected;
    this.#syncFormValue();
    this.#syncValidity();
    this.requestRender();
    this.#emitChange(value);
  }

  #emitChange(value) {
    const selected = this.selected;
    const option = this.#resolvedOptions().find((item) => item.value === value) ?? null;
    emit(this, "rowan-change", {
      value,
      selected,
      option,
      selectedOptions: this.selectedOptions,
    });
  }
}

define("rowan-multi-select-combobox", RowanMultiSelectCombobox);
