import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanOption } from "../option/option.js";

const SELECTION_MODES = new Set(["single", "multiple"]);

function isOption(value) {
  return value instanceof RowanOption;
}

function selectionStateEquals(first, second) {
  if (first.size !== second.size) return false;
  return [...first].every((value) => second.has(value));
}

function parseRestoredSelection(state) {
  if (state == null) return [];

  try {
    const parsed = JSON.parse(String(state));
    if (Array.isArray(parsed)) return parsed.map((value) => String(value));
  } catch {
    // Older form state may contain a single unencoded value.
  }

  return [String(state)];
}

/**
 * Accessible single- or multi-selection list control.
 * @tag rowan-listbox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {"single"|"multiple"} selection
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {string[]} selected - Selected option values. Arrays are property-only.
 * @slot - rowan-option children
 * @csspart listbox
 * @cssprop --rowan-listbox-bg
 * @cssprop --rowan-listbox-border
 * @event rowan-change - Fired when user interaction changes selection
 */
export class RowanListbox extends BaseElement {
  static formAssociated = true;
  static styleUrl = new URL("./listbox.css", import.meta.url).href;
  static useElementInternals = true;
  static componentTokenPrefixes = ["--rowan-listbox-"];
  static observedAttributes = ["name", "value", "label", "selection", "disabled", "required"];
  static upgradeProperties = [
    "name",
    "value",
    "label",
    "selection",
    "disabled",
    "required",
    "selected",
  ];

  #listbox = null;
  #slot = null;
  #selected = null;
  #defaultSelected = null;
  #activeOption = null;
  #anchorOption = null;
  #optionObserver = null;
  #managedOptions = new Set();
  #syncingValue = false;

  connectedCallback() {
    super.connectedCallback();
    this.#observeOptions();

    if (this.#defaultSelected === null) {
      this.#defaultSelected = [...this.selected];
    }

    this.#syncFormValue();
    this.#syncValidity();
  }

  disconnectedCallback() {
    this.#clearManagedOptions();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || name !== "value" || this.#syncingValue) return;

    this.#selected = newValue ? new Set([newValue]) : new Set();
    this.#syncFormValue();
    this.#syncValidity();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
    this.#syncFormValue();
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    const next = String(value ?? "");
    this.#selected = next ? new Set([next]) : new Set();
    this.reflectString("value", next || null);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get selection() {
    const selection = this.readString("selection", "single").trim().toLowerCase();
    return SELECTION_MODES.has(selection) ? selection : "single";
  }

  set selection(value) {
    const next = String(value ?? "")
      .trim()
      .toLowerCase();
    this.reflectString("selection", next === "multiple" ? next : null);
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

  /** @returns {string[]} */
  get selected() {
    return [...this.#selectionValues(this.#options())];
  }

  /** @param {string[]} value */
  set selected(value) {
    this.#selected = new Set(Array.isArray(value) ? value.map((item) => String(item)) : []);
    this.requestRender();
    this.#syncFormValue();
    this.#syncValidity();
  }

  /** @returns {RowanOption[]} */
  get selectedOptions() {
    const selected = this.#selectionValues(this.#options());
    return this.#options().filter((option) => selected.has(option.value));
  }

  setFormValue(value = null, state = undefined) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#listbox) {
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

  clearSelection() {
    if (this.selected.length === 0) return;

    this.#selected = new Set();
    this.requestRender();
    this.#syncFormValue();
    this.#syncValidity();
  }

  render() {
    if (!this.#listbox) {
      this.renderRoot.innerHTML = '<div class="listbox" part="listbox"><slot></slot></div>';
      this.#listbox = this.renderRoot.querySelector(".listbox");
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
      this.listen(this, "click", (event) => this.#handleClick(event));
      this.listen(this, "focusin", (event) => this.#handleFocusIn(event));
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
    }

    const options = this.#options();
    this.#syncSelection(options);
    this.#syncRovingTabIndex(options);
    this.#syncValueFromSelection(options);
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #observeOptions() {
    if (!this.#optionObserver && typeof MutationObserver !== "undefined") {
      this.#optionObserver = new MutationObserver(() => this.requestRender());
      this.observe(this.#optionObserver, () => this.#observeOptions());
    }

    this.#optionObserver?.observe(this, {
      attributes: true,
      attributeFilter: ["disabled", "hidden", "selected", "slot", "value"],
      childList: true,
      subtree: true,
    });
  }

  #options() {
    return [...this.querySelectorAll("rowan-option")].filter(
      (option) => isOption(option) && option.closest("rowan-listbox") === this,
    );
  }

  #availableOptions(options = this.#options()) {
    return options.filter((option) => !option.disabled && !option.hidden);
  }

  #selectionValues(options) {
    if (this.#selected === null) {
      const value = this.value;
      const initial = value
        ? new Set([value])
        : new Set(options.filter((option) => option.selected).map((option) => option.value));
      return this.#normalizeSelection(initial, options);
    }

    return this.#normalizeSelection(this.#selected, options);
  }

  #normalizeSelection(requested, options) {
    const seen = new Set();
    const selected = new Set();

    for (const option of options) {
      if (option.disabled || seen.has(option.value) || !requested.has(option.value)) continue;
      seen.add(option.value);
      selected.add(option.value);
      if (this.selection === "single") break;
    }

    return selected;
  }

  #syncSelection(options) {
    const selected = this.#selectionValues(options);
    if (this.#selected === null) {
      this.#selected = new Set(selected);
    }

    for (const option of options) {
      const isSelected = selected.has(option.value);
      if (option.selected !== isSelected) option.selected = isSelected;
    }
  }

  #syncRovingTabIndex(options) {
    const managedOptions = new Set(options);
    const available = this.#availableOptions(options);

    for (const option of this.#managedOptions) {
      if (!managedOptions.has(option)) {
        option.setRovingTabIndex(null, this);
        option.setListboxDisabled(false, this);
      }
    }

    if (this.disabled) {
      this.#activeOption = null;
      for (const option of options) {
        option.setRovingTabIndex(-1, this);
        option.setListboxDisabled(true, this);
      }
      this.#managedOptions = managedOptions;
      return;
    }

    if (!available.includes(this.#activeOption)) {
      const selected = this.#selectionValues(options);
      this.#activeOption =
        available.find((option) => selected.has(option.value)) ?? available.at(0) ?? null;
    }

    for (const option of options) {
      option.setRovingTabIndex(option === this.#activeOption ? 0 : -1, this);
      option.setListboxDisabled(false, this);
    }

    this.#managedOptions = managedOptions;
  }

  #syncValueFromSelection(options) {
    const selected = this.#selectionValues(options);
    const next = [...selected][0] ?? "";
    if (this.value === next) return;

    this.#syncingValue = true;
    this.reflectString("value", next || null);
    this.#syncingValue = false;
  }

  #syncFormValue() {
    const selected = this.selected;
    const state = JSON.stringify(selected);
    if (this.disabled || !this.name || selected.length === 0) {
      this.setFormValue(null, state);
      return;
    }

    if (this.selection === "multiple") {
      const formData = new FormData();
      for (const value of selected) {
        formData.append(this.name, value);
      }
      this.setFormValue(formData, state);
      return;
    }

    this.setFormValue(selected[0], state);
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity({ valueMissing: true }, "Please select an option.");
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
      this.internals.role = "listbox";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
    }

    if (!this.hasAttribute("aria-multiselectable") && "ariaMultiSelectable" in this.internals) {
      this.internals.ariaMultiSelectable = this.selection === "multiple" ? "true" : "false";
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

  #clearManagedOptions() {
    for (const option of this.#managedOptions) {
      option.setRovingTabIndex(null, this);
      option.setListboxDisabled(false, this);
    }

    this.#managedOptions.clear();
    this.#activeOption = null;
    this.#anchorOption = null;
  }

  #handleClick(event) {
    const option = this.#optionFromEvent(event);
    if (!option || this.disabled || option.disabled) return;

    this.#focusOption(option);
    this.#selectOption(option, event);
  }

  #handleFocusIn(event) {
    const option = this.#optionFromEvent(event);
    if (!option || this.disabled || option.disabled) return;

    this.#activeOption = option;
    this.#syncRovingTabIndex(this.#options());
  }

  #handleKeydown(event) {
    if (this.disabled) return;

    const options = this.#options();
    const available = this.#availableOptions(options);
    const option = this.#optionFromEvent(event) ?? this.#activeOption;
    if (!option || option.disabled) return;

    const index = available.indexOf(option);
    if (index === -1) return;

    if (event.key === keys.ARROW_DOWN) {
      event.preventDefault();
      const next = available[index + 1];
      if (!next) return;
      this.#focusOption(next);
      if (event.shiftKey && this.selection === "multiple") this.#selectOption(next, event);
      return;
    }

    if (event.key === keys.ARROW_UP) {
      event.preventDefault();
      const previous = available[index - 1];
      if (!previous) return;
      this.#focusOption(previous);
      if (event.shiftKey && this.selection === "multiple") this.#selectOption(previous, event);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      const first = available.at(0);
      if (!first) return;
      this.#focusOption(first);
      if (event.shiftKey && this.selection === "multiple") this.#selectOption(first, event);
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      const last = available.at(-1);
      if (!last) return;
      this.#focusOption(last);
      if (event.shiftKey && this.selection === "multiple") this.#selectOption(last, event);
      return;
    }

    if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      this.#selectOption(option, event);
    }
  }

  #selectOption(option, event) {
    if (this.selection === "single") {
      this.#commitSelection(new Set([option.value]), option);
      return;
    }

    const options = this.#availableOptions();
    const selected = this.#selectionValues(this.#options());
    if (event.shiftKey && this.#anchorOption && options.includes(this.#anchorOption)) {
      const start = options.indexOf(this.#anchorOption);
      const end = options.indexOf(option);
      const first = Math.min(start, end);
      const last = Math.max(start, end);
      for (const item of options.slice(first, last + 1)) {
        selected.add(item.value);
      }
    } else if (selected.has(option.value)) {
      selected.delete(option.value);
    } else {
      selected.add(option.value);
    }

    this.#anchorOption = option;
    this.#commitSelection(selected, option);
  }

  #commitSelection(next, option) {
    const options = this.#options();
    const selected = this.#selectionValues(options);
    const normalized = this.#normalizeSelection(next, options);
    if (selectionStateEquals(selected, normalized)) return;

    this.#selected = normalized;
    this.#syncSelection(options);
    this.#syncValueFromSelection(options);
    this.#syncFormValue();
    this.#syncValidity();
    this.requestRender();

    emit(this, "rowan-change", {
      value: option.value,
      selected: this.selected,
      option,
      selectedOptions: this.selectedOptions,
    });
  }

  #focusOption(option) {
    this.#activeOption = option;
    this.#syncRovingTabIndex(this.#options());
    option.focus({ preventScroll: true });
  }

  #optionFromEvent(event) {
    return event
      .composedPath()
      .find((node) => isOption(node) && node.closest("rowan-listbox") === this);
  }
}

define("rowan-listbox", RowanListbox);
