import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

const COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const DEFAULT_INPUT_COLOR = "#1d432f";

const DEFAULT_COLORS = Object.freeze([
  Object.freeze({ value: "#10261c", label: "Forest 900" }),
  Object.freeze({ value: "#153224", label: "Forest 800" }),
  Object.freeze({ value: "#1d432f", label: "Forest 700" }),
  Object.freeze({ value: "#24543c", label: "Forest 600" }),
  Object.freeze({ value: "#2f6a4d", label: "Forest 500" }),
  Object.freeze({ value: "#f8f7f2", label: "Sand 50" }),
  Object.freeze({ value: "#efede4", label: "Sand 100" }),
  Object.freeze({ value: "#1f2421", label: "Ink 900" }),
  Object.freeze({ value: "#424945", label: "Ink 700" }),
  Object.freeze({ value: "#b4392d", label: "Danger 600" }),
  Object.freeze({ value: "#972d22", label: "Danger 700" }),
]);

let colorPickerId = 0;

/**
 * @typedef {object} RowanColorPickerPaletteEntry
 * @property {string} value
 * @property {string} [label]
 * @property {boolean} [disabled]
 */

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeColor(value) {
  const next = normalizeText(value).toLowerCase();
  if (!COLOR_PATTERN.test(next)) return "";

  const shorthand = next.slice(1);
  const expanded =
    shorthand.length === 3 || shorthand.length === 4
      ? [...shorthand].map((character) => `${character}${character}`).join("")
      : shorthand;
  const rgb = `#${expanded.slice(0, 6)}`;
  const alpha = expanded.slice(6);

  return !alpha || alpha === "ff" ? rgb : `${rgb}${alpha}`;
}

function normalizeAlpha(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 100;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function colorParts(value) {
  const normalized = normalizeColor(value) || DEFAULT_INPUT_COLOR;
  const rgb = normalized.slice(0, 7);
  const alphaHex = normalized.slice(7);
  const alpha = alphaHex ? Math.round((Number.parseInt(alphaHex, 16) / 255) * 100) : 100;

  return { alpha, rgb };
}

function colorWithAlpha(rgb, alpha) {
  const normalized = normalizeColor(rgb);
  if (!normalized) return "";

  const opaqueRgb = normalized.slice(0, 7);
  const alphaHex = Math.round((normalizeAlpha(alpha) / 100) * 255)
    .toString(16)
    .padStart(2, "0");

  return alphaHex === "ff" ? opaqueRgb : `${opaqueRgb}${alphaHex}`;
}

/**
 * Accessible semantic color selection with approved swatches and alpha-enabled custom entry.
 * @tag rowan-color-picker
 * @attr {string} name
 * @attr {string} value - A normalized #rrggbb or #rrggbbaa color.
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @property {Array<string | RowanColorPickerPaletteEntry>} palette - Approved palette entries. Arrays are property-only.
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart swatches
 * @csspart swatch
 * @csspart swatch-color
 * @csspart custom-color
 * @csspart color-input
 * @csspart alpha-input
 * @csspart alpha-value
 * @cssprop --rowan-color-picker-bg
 * @cssprop --rowan-color-picker-border
 * @cssprop --rowan-color-picker-swatch-size
 * @event rowan-change - Fired when a user selects or enters a color.
 */
export class RowanColorPicker extends BaseElement {
  static formAssociated = true;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./color-picker.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-color-picker-"];
  static observedAttributes = [
    "name",
    "value",
    "label",
    "description",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "label",
    "description",
    "disabled",
    "required",
    "invalid",
    "palette",
  ];

  #control = null;
  #labelFallback = null;
  #descriptionFallback = null;
  #swatches = null;
  #colorInput = null;
  #alphaInput = null;
  #alphaValue = null;
  /** @type {Array<string | RowanColorPickerPaletteEntry> | null} */
  #palette = null;
  #defaultValue = null;
  #pendingFocusValue = "";

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      colorPickerId += 1;
      this.id = `rowan-color-picker-${colorPickerId}`;
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  /** @returns {Array<string | RowanColorPickerPaletteEntry>} */
  get palette() {
    return this.#palette ?? DEFAULT_COLORS;
  }

  /** @param {Array<string | RowanColorPickerPaletteEntry>} value */
  set palette(value) {
    this.#palette = Array.isArray(value) ? value : [];
    this.requestRender();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
    this.#syncFormValue();
  }

  get value() {
    return normalizeColor(this.readString("value", ""));
  }

  set value(value) {
    const normalized = normalizeColor(value);
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

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", value);
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

  setFormValue(
    value = this.disabled || !this.value ? null : this.value,
    state = this.value || null,
  ) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#colorInput) {
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

    return !(this.required && !this.disabled && !this.value);
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
            <div class="picker-label" part="label"><slot name="label"><span class="label-fallback"></span></slot></div>
            <div class="description" part="description"><slot name="description"><span class="description-fallback"></span></slot></div>
          </div>
          <div class="swatches" part="swatches" role="radiogroup"></div>
          <div class="custom-entry">
            <label class="color-entry" part="custom-color">
              <span class="entry-label">Custom color</span>
              <input class="color-input" part="color-input" type="color" />
            </label>
            <label class="alpha-entry">
              <span class="entry-label">Opacity</span>
              <input class="alpha-input" part="alpha-input" type="range" min="0" max="100" step="1" />
              <output class="alpha-value" part="alpha-value"></output>
            </label>
          </div>
        </div>
      `;

      this.#control = this.renderRoot.querySelector(".control");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#descriptionFallback = this.renderRoot.querySelector(".description-fallback");
      this.#swatches = this.renderRoot.querySelector(".swatches");
      this.#colorInput = this.renderRoot.querySelector(".color-input");
      this.#alphaInput = this.renderRoot.querySelector(".alpha-input");
      this.#alphaValue = this.renderRoot.querySelector(".alpha-value");

      this.listen(this.#swatches, "click", (event) => this.#handleSwatchClick(event));
      this.listen(this.#swatches, "keydown", (event) => this.#handleSwatchKeydown(event));
      this.listen(this.#colorInput, "input", () => this.#commitCustomColor("color-input"));
      this.listen(this.#colorInput, "change", () => this.#commitCustomColor("color-input"));
      this.listen(this.#alphaInput, "input", () => this.#commitCustomColor("alpha-input"));
      this.listen(this.#alphaInput, "change", () => this.#commitCustomColor("alpha-input"));
    }

    const { alpha, rgb } = colorParts(this.value);
    const label = this.label;
    const description = this.description;

    this.#labelFallback.textContent = label;
    this.#labelFallback.hidden = label.length === 0;
    this.#descriptionFallback.textContent = description;
    this.#descriptionFallback.hidden = description.length === 0;
    this.#colorInput.value = rgb;
    this.#colorInput.disabled = this.disabled;
    this.#colorInput.setAttribute("aria-label", label ? `${label} custom color` : "Custom color");
    this.#alphaInput.value = String(alpha);
    this.#alphaInput.disabled = this.disabled;
    this.#alphaInput.setAttribute("aria-label", label ? `${label} opacity` : "Opacity");
    this.#alphaValue.textContent = `${alpha}%`;

    this.#renderSwatches();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();

    if (this.#pendingFocusValue) {
      const button = this.#buttonForValue(this.#pendingFocusValue);
      this.#pendingFocusValue = "";
      button?.focus({ preventScroll: true });
    }
  }

  #resolvedColors() {
    const values = new Set();
    const colors = [];

    for (const item of this.palette) {
      const isString = typeof item === "string";
      const isObject = item && typeof item === "object";
      if (!isString && !isObject) continue;

      const value = normalizeColor(isString ? item : item.value);
      if (!value || values.has(value)) continue;

      values.add(value);
      colors.push({
        disabled: Boolean(isObject && item.disabled),
        label: normalizeText(isString ? "" : item.label) || value.toUpperCase(),
        value,
      });
    }

    return colors;
  }

  #renderSwatches() {
    const colors = this.#resolvedColors();
    const selectedValue = this.value;
    const selected = colors.find(
      (color) => color.value === selectedValue && !color.disabled,
    )?.value;
    const fallback = colors.find((color) => !color.disabled)?.value ?? "";
    const focusValue = selected || fallback;

    this.#swatches.textContent = "";
    this.#swatches.setAttribute(
      "aria-label",
      this.label ? `${this.label} palette` : "Color palette",
    );

    const fragment = document.createDocumentFragment();
    for (const color of colors) {
      const button = document.createElement("button");
      const swatch = document.createElement("span");

      button.className = "swatch";
      button.part.add("swatch");
      button.type = "button";
      button.dataset.value = color.value;
      button.disabled = this.disabled || color.disabled;
      button.tabIndex = !button.disabled && color.value === focusValue ? 0 : -1;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", color.value === selectedValue ? "true" : "false");
      button.setAttribute("aria-label", `${color.label}, ${color.value}`);

      swatch.className = "swatch-color";
      swatch.part.add("swatch-color");
      swatch.style.setProperty("--color-picker-swatch-color", color.value);
      button.append(swatch);
      fragment.append(button);
    }

    this.#swatches.append(fragment);
  }

  #syncFormValue() {
    this.setFormValue();
  }

  #syncValidity() {
    if (this.required && !this.disabled && !this.value) {
      this.setValidity({ valueMissing: true }, "Please choose a color.", this.#colorInput);
      return;
    }

    this.setValidity({}, "", this.#colorInput);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label || "Color picker";
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
      this.internals.ariaInvalid =
        this.required && !this.disabled && !this.value ? "true" : "false";
    }
  }

  #handleSwatchClick(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    this.#commitUserValue(button.dataset.value, "swatch");
  }

  #handleSwatchKeydown(event) {
    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled) return;

    const buttons = [...this.#swatches.querySelectorAll("button:not(:disabled)")];
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
      this.#commitUserValue(button.dataset.value, "swatch");
      return;
    }

    if (!target) return;
    event.preventDefault();
    this.#pendingFocusValue = target.dataset.value;
    this.#commitUserValue(target.dataset.value, "swatch");
  }

  #commitCustomColor(source) {
    if (this.disabled) return;

    this.#commitUserValue(colorWithAlpha(this.#colorInput.value, this.#alphaInput.value), source);
  }

  #commitUserValue(value, source) {
    const previous = this.value;
    this.value = value;
    if (previous === this.value) return;

    const { alpha, rgb } = colorParts(this.value);
    const color = this.#resolvedColors().find((option) => option.value === this.value) ?? null;
    emit(this, "rowan-change", {
      alpha,
      color: rgb,
      option: color,
      source,
      value: this.value,
    });
  }

  #buttonFromEvent(event) {
    return event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.value);
  }

  #buttonForValue(value) {
    return [...this.#swatches.querySelectorAll("button")].find(
      (button) => button.dataset.value === value,
    );
  }
}

define("rowan-color-picker", RowanColorPicker);
