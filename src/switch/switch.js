import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Toggle switch control with form association.
 * @tag rowan-switch
 * @attr {boolean} checked
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @slot - Label content
 * @csspart control
 * @csspart input
 * @event rowan-change - Fired when user toggles checked state
 */
export class RowanSwitch extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./switch.css", import.meta.url).href;
  static observedAttributes = ["checked", "disabled", "required", "name", "value", "label"];
  static upgradeProperties = ["checked", "disabled", "required", "name", "value", "label"];

  #input = null;
  #fallbackLabel = null;
  #defaultChecked = null;

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultChecked === null) {
      this.#defaultChecked = this.checked;
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get checked() {
    return this.readBoolean("checked");
  }

  set checked(value) {
    this.reflectBoolean("checked", Boolean(value));
    this.#syncFormValue();
    this.#syncValidity();
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

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get value() {
    return this.readString("value", "on");
  }

  set value(value) {
    this.reflectString("value", value);
    this.#syncFormValue();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  setFormValue(value = this.checked ? this.value : null) {
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
    this.checked = Boolean(this.#defaultChecked);
    this.requestRender();
  }

  formStateRestoreCallback(state) {
    if (state == null) {
      this.checked = false;
    } else {
      this.checked = state === this.value || state === "on" || state === true;
    }

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
        <label class="control" part="control">
          <input class="input" part="input" type="checkbox" />
          <span class="track" aria-hidden="true"><span class="thumb"></span></span>
          <span class="content"><slot></slot></span>
          <span class="sr-only"></span>
        </label>
      `;

      this.#input = this.renderRoot.querySelector("input");
      this.#fallbackLabel = this.renderRoot.querySelector(".sr-only");

      this.listen(this.#input, "change", () => {
        this.checked = this.#input.checked;

        emit(this, "rowan-change", {
          checked: this.checked,
          value: this.value,
        });
      });
    }

    this.#input.name = this.name;
    this.#input.value = this.value;
    this.#input.checked = this.checked;
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;

    const fallbackLabelText = this.label;
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;

    if (fallbackLabelText.length > 0) {
      this.#input.setAttribute("aria-label", fallbackLabelText);
    } else {
      this.#input.removeAttribute("aria-label");
    }

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #syncFormValue() {
    this.setFormValue(this.checked ? this.value : null);
  }

  #syncValidity() {
    if (!this.#input) return;

    if (this.required && !this.checked) {
      this.setValidity({ valueMissing: true }, "Please enable this switch.", this.#input);
      return;
    }

    this.setValidity({}, "", this.#input);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    const invalidState = this.required && !this.checked ? "true" : "false";

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "switch";
    }

    if (!this.hasAttribute("aria-checked") && "ariaChecked" in this.internals) {
      this.internals.ariaChecked = this.checked ? "true" : "false";
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

define("rowan-switch", RowanSwitch);
