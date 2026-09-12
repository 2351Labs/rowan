import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

const SIZES = new Set(["sm", "md", "lg"]);

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * Compact mutually exclusive mode control.
 * @tag rowan-segmented-control
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {Array<string | { value: string, label?: string, disabled?: boolean }>} options - Available modes. Arrays are property-only.
 * @csspart control
 * @csspart button
 * @csspart label
 * @cssprop --rowan-segmented-control-bg
 * @cssprop --rowan-segmented-control-active-bg
 * @event rowan-change - Fired when a user chooses a different mode
 */
export class RowanSegmentedControl extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./segmented-control.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-segmented-control-"];
  static observedAttributes = ["name", "value", "label", "size", "disabled", "required"];
  static upgradeProperties = ["name", "value", "label", "size", "disabled", "required", "options"];

  #control = null;
  #fallbackLabel = null;
  #options = [];
  #defaultValue = null;
  #pendingFocusValue = "";

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
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
    this.reflectString("value", normalizeText(value) || null);
    this.#syncFormValue();
    this.#syncValidity();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get size() {
    const size = this.readString("size", "md").trim().toLowerCase();
    return SIZES.has(size) ? size : "md";
  }

  set size(value) {
    const next = String(value ?? "")
      .trim()
      .toLowerCase();
    this.reflectString("size", next === "md" || !SIZES.has(next) ? null : next);
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

  get selectedOption() {
    return this.#resolvedOptions().find((option) => option.value === this.value) ?? null;
  }

  setFormValue(value = null, state = undefined) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#control) {
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
        <span class="label sr-only" part="label"></span>
        <div class="control" part="control"></div>
      `;
      this.#control = this.renderRoot.querySelector(".control");
      this.#fallbackLabel = this.renderRoot.querySelector(".label");
      this.listen(this.#control, "click", (event) => this.#handleClick(event));
      this.listen(this.#control, "keydown", (event) => this.#handleKeydown(event));
    }

    this.#fallbackLabel.textContent = this.label;
    this.#fallbackLabel.hidden = this.label.length === 0;
    this.#renderOptions();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();

    if (this.#pendingFocusValue) {
      const button = this.#buttonForValue(this.#pendingFocusValue);
      this.#pendingFocusValue = "";
      button?.focus({ preventScroll: true });
    }
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

  #renderOptions() {
    const options = this.#resolvedOptions();
    const selected = this.selectedOption;
    const focusValue = selected?.disabled ? "" : (selected?.value ?? "");
    const fallbackFocusValue = options.find((option) => !option.disabled)?.value ?? "";

    this.#control.textContent = "";
    const fragment = document.createDocumentFragment();
    for (const option of options) {
      const button = document.createElement("button");
      button.className = "button";
      button.part.add("button");
      button.type = "button";
      button.dataset.value = option.value;
      button.disabled = this.disabled || option.disabled;
      button.tabIndex =
        !button.disabled && option.value === (focusValue || fallbackFocusValue) ? 0 : -1;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", option.value === this.value ? "true" : "false");
      button.textContent = option.label;
      fragment.append(button);
    }

    this.#control.append(fragment);
  }

  #syncFormValue() {
    const selected = this.selectedOption;
    if (this.disabled || !this.name || !selected || selected.disabled) {
      this.setFormValue(null, this.value || null);
      return;
    }

    this.setFormValue(selected.value, selected.value);
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity({ valueMissing: true }, "Please choose a mode.");
      return;
    }

    this.setValidity({});
  }

  #isValueMissing() {
    return (
      this.required && !this.disabled && (!this.selectedOption || this.selectedOption.disabled)
    );
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "radiogroup";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || null;
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

  #handleClick(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    this.#activate(button.dataset.value, true);
  }

  #handleKeydown(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    const buttons = [...this.#control.querySelectorAll("button:not(:disabled)")];
    const index = buttons.indexOf(button);
    if (index === -1) return;

    let target = null;
    if (event.key === keys.ARROW_RIGHT || event.key === keys.ARROW_DOWN) {
      target = buttons[index + 1] ?? buttons.at(0);
    } else if (event.key === keys.ARROW_LEFT || event.key === keys.ARROW_UP) {
      target = buttons[index - 1] ?? buttons.at(-1);
    } else if (event.key === keys.HOME) {
      target = buttons.at(0);
    } else if (event.key === keys.END) {
      target = buttons.at(-1);
    } else if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      this.#activate(button.dataset.value, true);
      return;
    }

    if (!target) return;
    event.preventDefault();
    this.#activate(target.dataset.value, true);
  }

  #activate(value, focus) {
    const option = this.#resolvedOptions().find((item) => item.value === value);
    if (!option || option.disabled || this.disabled || this.value === option.value) return;

    this.#pendingFocusValue = focus ? option.value : "";
    this.value = option.value;
    emit(this, "rowan-change", {
      value: option.value,
      option,
    });
  }

  #buttonFromEvent(event) {
    return event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.value);
  }

  #buttonForValue(value) {
    return [...this.#control.querySelectorAll("button")].find(
      (button) => button.dataset.value === value,
    );
  }
}

define("rowan-segmented-control", RowanSegmentedControl);
