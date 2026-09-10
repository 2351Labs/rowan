import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeError(error, index) {
  const source = error && typeof error === "object" ? error : {};

  const fieldId = String(source.fieldId ?? source.id ?? "").trim();
  const label = String(source.label ?? "").trim();
  const message = String(source.message ?? "").trim();
  const fallbackMessage = label
    ? `${label} is invalid`
    : fieldId
      ? `${fieldId} is invalid`
      : `Field ${index + 1} is invalid`;

  return {
    fieldId,
    label,
    message: message || fallbackMessage,
  };
}

function queryLabelForElement(element) {
  if (!element || !element.id) return "";

  const escapedId = CSS.escape(element.id);
  const fromFor = element.ownerDocument?.querySelector(`label[for="${escapedId}"]`);
  if (fromFor && fromFor.textContent) {
    return fromFor.textContent.trim();
  }

  const wrapperLabel = element.closest("label");
  if (wrapperLabel && wrapperLabel.textContent) {
    return wrapperLabel.textContent.trim();
  }

  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.trim();

  return element.id;
}

/**
 * Renders a navigable summary of validation errors.
 * @tag rowan-validation-summary
 * @attr {string} heading
 * @attr {string} for-form
 * @attr {boolean} disabled
 * @slot heading
 * @slot empty
 * @csspart summary
 * @csspart heading
 * @csspart list
 * @csspart item
 * @csspart error-button
 * @csspart empty
 * @event rowan-jump - Fired when a user activates an error target
 */
export class RowanValidationSummary extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./validation-summary.css", import.meta.url).href;
  static observedAttributes = ["heading", "for-form", "disabled"];
  static upgradeProperties = ["heading", "forForm", "errors", "disabled"];

  #errors = [];
  #root = null;
  #list = null;
  #empty = null;
  #heading = null;

  get heading() {
    return this.readString("heading", "Please fix the following fields");
  }

  set heading(value) {
    const text = String(value ?? "").trim();
    this.reflectString("heading", text || null);
  }

  get forForm() {
    return this.readString("for-form", "");
  }

  set forForm(value) {
    const text = String(value ?? "").trim();
    this.reflectString("for-form", text || null);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get errors() {
    return this.#errors.map((error) => ({ ...error }));
  }

  set errors(value) {
    this.#errors = toArray(value).map((error, index) => normalizeError(error, index));
    this.requestRender();
  }

  collectFromForm() {
    const form = this.#resolveForm();
    if (!form) {
      this.errors = [];
      return this.errors;
    }

    const controls = Array.from(form.elements).filter(
      (element) => element instanceof HTMLElement && typeof element.checkValidity === "function",
    );

    const nextErrors = [];

    controls.forEach((control) => {
      if (!("checkValidity" in control)) return;
      if (control.disabled) return;
      if (!control.id) return;

      if (!control.checkValidity()) {
        const label = queryLabelForElement(control);
        nextErrors.push({
          fieldId: control.id,
          label,
          message: control.validationMessage || `${label || control.id} is invalid`,
        });
      }
    });

    this.errors = nextErrors;
    return this.errors;
  }

  render() {
    if (!this.#root) {
      this.renderRoot.innerHTML = `
        <section class="summary" part="summary">
          <div class="heading" part="heading">
            <slot name="heading"></slot>
            <span data-part="heading-text"></span>
          </div>
          <ul class="list" part="list"></ul>
          <div class="empty" data-part="empty" part="empty">
            <slot name="empty">No validation issues.</slot>
          </div>
        </section>
      `;

      this.#root = this.renderRoot.querySelector(".summary");
      this.#heading = this.renderRoot.querySelector('[data-part="heading-text"]');
      this.#list = this.renderRoot.querySelector(".list");
      this.#empty = this.renderRoot.querySelector(".empty");

      this.listen(this.#list, "click", (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches('button[data-field-id]'));

        if (!button || this.disabled) return;

        const fieldId = button.getAttribute("data-field-id") || "";
        this.#jumpToField(fieldId);
      });

      this.listen(this.#list, "keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches('button[data-field-id]'));

        if (!button || this.disabled) return;

        event.preventDefault();
        const fieldId = button.getAttribute("data-field-id") || "";
        this.#jumpToField(fieldId);
      });
    }

    this.#heading.textContent = this.heading;

    const errors = this.#errors;
    this.#list.textContent = "";

    const fragment = document.createDocumentFragment();

    errors.forEach((error, index) => {
      const item = document.createElement("li");
      item.className = "item";
      item.part = "item";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "error-button";
      button.dataset.part = "error-button";
      button.part = "error-button";
      button.setAttribute("data-field-id", error.fieldId);
      button.disabled = this.disabled;
      button.textContent = `${index + 1}. ${error.message}`;

      item.append(button);
      fragment.append(item);
    });

    this.#list.append(fragment);
    this.#empty.hidden = errors.length > 0;

    this.#applyDefaultA11y();
  }

  #resolveForm() {
    const formId = this.forForm.trim();
    if (!formId) {
      return this.closest("form");
    }

    return this.ownerDocument?.getElementById(formId) || null;
  }

  #jumpToField(fieldId) {
    if (!fieldId) return;

    const target = this.ownerDocument?.getElementById(fieldId);
    if (!target) return;

    if (typeof target.focus === "function") {
      target.focus();
    }

    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    emit(this, "rowan-jump", {
      fieldId,
      target,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "region";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.heading;
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-validation-summary", RowanValidationSummary);