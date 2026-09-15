import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

let formFieldId = 0;

function assignedContent(slot) {
  return slot.assignedNodes().some((node) => {
    return node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim().length > 0;
  });
}

function contentText(slot, fallback) {
  const assignedText = slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent ?? "")
    .join(" ")
    .trim();

  return assignedText || fallback.textContent?.trim() || "";
}

/**
 * Accessible label, support text, and error composition for a form control.
 * @tag rowan-form-field
 * @attr {string} label
 * @attr {string} hint
 * @attr {string} description
 * @attr {string} error
 * @attr {string} for
 * @attr {"top"|"start"} label-position
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @slot - A direct form control or grouped control
 * @slot label - Replaces the label attribute
 * @slot hint - Replaces the hint attribute
 * @slot description - Replaces the description attribute
 * @slot error - Replaces the error attribute
 * @slot actions - Supplemental actions beside the label
 * @csspart field
 * @csspart label-row
 * @csspart label
 * @csspart required-indicator
 * @csspart control
 * @csspart support
 * @csspart hint
 * @csspart description
 * @csspart error
 * @csspart actions
 * @cssprop --rowan-form-field-label-fg
 * @cssprop --rowan-form-field-hint-fg
 * @cssprop --rowan-form-field-error-fg
 */
export class RowanFormField extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./form-field.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-form-field-"];
  static observedAttributes = [
    "label",
    "hint",
    "description",
    "error",
    "for",
    "label-position",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "label",
    "hint",
    "description",
    "error",
    "htmlFor",
    "labelPosition",
    "required",
    "invalid",
  ];

  #field = null;
  #labelRow = null;
  #label = null;
  #requiredIndicator = null;
  #actions = null;
  #controlSlot = null;
  #labelSlot = null;
  #hintSlot = null;
  #descriptionSlot = null;
  #errorSlot = null;
  #actionsSlot = null;
  #hint = null;
  #description = null;
  #error = null;
  #support = null;
  #labelFallback = null;
  #hintFallback = null;
  #descriptionFallback = null;
  #errorFallback = null;
  #labelId = "";
  #hintId = "";
  #descriptionId = "";
  #errorId = "";
  #managedControls = new Set();
  #managedText = new WeakMap();
  #managedReferences = new WeakMap();
  #controlObserver = null;

  constructor() {
    super();

    formFieldId += 1;
    const id = `rowan-form-field-${formFieldId}`;
    this.#labelId = `${id}__label`;
    this.#hintId = `${id}__hint`;
    this.#descriptionId = `${id}__description`;
    this.#errorId = `${id}__error`;
  }

  disconnectedCallback() {
    this.#clearManagedControls();
    this.#controlObserver?.disconnect();
    this.#controlObserver = null;
    super.disconnectedCallback();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get hint() {
    return this.readString("hint", "");
  }

  set hint(value) {
    this.reflectString("hint", value);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", value);
  }

  get error() {
    return this.readString("error", "");
  }

  set error(value) {
    this.reflectString("error", value);
  }

  get htmlFor() {
    return this.readString("for", "").trim();
  }

  set htmlFor(value) {
    this.reflectString("for", String(value ?? "").trim() || null);
  }

  get labelPosition() {
    return this.readString("label-position", "top").trim().toLowerCase() === "start"
      ? "start"
      : "top";
  }

  set labelPosition(value) {
    const next =
      String(value ?? "")
        .trim()
        .toLowerCase() === "start"
        ? "start"
        : "top";
    this.reflectString("label-position", next === "top" ? null : next);
  }

  get required() {
    return this.readBoolean("required");
  }

  set required(value) {
    this.reflectBoolean("required", Boolean(value));
  }

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.reflectBoolean("invalid", Boolean(value));
  }

  render() {
    if (!this.#field) {
      this.renderRoot.innerHTML = `
        <div class="field" part="field">
          <div class="label-row" part="label-row">
            <span class="label" part="label"></span>
            <span class="required-indicator" part="required-indicator" aria-hidden="true">Required</span>
            <span class="actions" part="actions"><slot name="actions"></slot></span>
          </div>
          <div class="control" part="control"><slot></slot></div>
          <div class="support" part="support">
            <div class="hint" part="hint"></div>
            <div class="description" part="description"></div>
            <div class="error" part="error" aria-live="polite"></div>
          </div>
        </div>
      `;

      this.#field = this.renderRoot.querySelector(".field");
      this.#labelRow = this.renderRoot.querySelector(".label-row");
      this.#label = this.renderRoot.querySelector(".label");
      this.#requiredIndicator = this.renderRoot.querySelector(".required-indicator");
      this.#actions = this.renderRoot.querySelector(".actions");
      this.#support = this.renderRoot.querySelector(".support");
      this.#hint = this.renderRoot.querySelector(".hint");
      this.#description = this.renderRoot.querySelector(".description");
      this.#error = this.renderRoot.querySelector(".error");

      this.#labelId = this.#assignContent(this.#label, "label", this.#labelId).id;
      this.#hintId = this.#assignContent(this.#hint, "hint", this.#hintId).id;
      this.#descriptionId = this.#assignContent(
        this.#description,
        "description",
        this.#descriptionId,
      ).id;
      this.#errorId = this.#assignContent(this.#error, "error", this.#errorId).id;

      this.#controlSlot = this.renderRoot.querySelector(".control slot");
      this.#labelSlot = this.#label.querySelector("slot");
      this.#hintSlot = this.#hint.querySelector("slot");
      this.#descriptionSlot = this.#description.querySelector("slot");
      this.#errorSlot = this.#error.querySelector("slot");
      this.#actionsSlot = this.#actions.querySelector("slot");
      this.#labelFallback = this.#label.querySelector("[data-fallback]");
      this.#hintFallback = this.#hint.querySelector("[data-fallback]");
      this.#descriptionFallback = this.#description.querySelector("[data-fallback]");
      this.#errorFallback = this.#error.querySelector("[data-fallback]");

      [
        this.#controlSlot,
        this.#labelSlot,
        this.#hintSlot,
        this.#descriptionSlot,
        this.#errorSlot,
        this.#actionsSlot,
      ].forEach((slot) => {
        this.listen(slot, "slotchange", () => this.requestRender());
      });

      this.listen(this.#label, "click", () => this.#focusControl());
    }

    this.#labelFallback.textContent = this.label;
    this.#hintFallback.textContent = this.hint;
    this.#descriptionFallback.textContent = this.description;
    this.#errorFallback.textContent = this.error;

    const hasLabel = assignedContent(this.#labelSlot) || this.label.trim().length > 0;
    const hasHint = assignedContent(this.#hintSlot) || this.hint.trim().length > 0;
    const hasDescription =
      assignedContent(this.#descriptionSlot) || this.description.trim().length > 0;
    const hasError = assignedContent(this.#errorSlot) || this.error.trim().length > 0;
    const hasActions = assignedContent(this.#actionsSlot);
    const controls = this.#resolveControls();
    const labelText = hasLabel ? contentText(this.#labelSlot, this.#labelFallback) : "";
    const descriptionText = [
      hasHint ? contentText(this.#hintSlot, this.#hintFallback) : "",
      hasDescription ? contentText(this.#descriptionSlot, this.#descriptionFallback) : "",
      hasError ? contentText(this.#errorSlot, this.#errorFallback) : "",
    ]
      .filter(Boolean)
      .join(" ");
    const isRequired =
      this.required || controls.some((control) => control.hasAttribute("required"));
    const isInvalid =
      this.invalid ||
      controls.some(
        (control) =>
          control.hasAttribute("invalid") || control.getAttribute("aria-invalid") === "true",
      );

    this.#label.hidden = !hasLabel;
    this.#requiredIndicator.hidden = !hasLabel || !isRequired;
    this.#actions.hidden = !hasActions;
    this.#labelRow.hidden = !hasLabel && !hasActions;
    this.#hint.hidden = !hasHint;
    this.#description.hidden = !hasDescription;
    this.#error.hidden = !hasError;
    this.#support.hidden = !hasHint && !hasDescription && !hasError;
    this.#field.classList.toggle("is-invalid", isInvalid);

    this.#syncControlAssociations(controls, {
      label: hasLabel ? this.#label : null,
      labelText,
      descriptions: [
        hasHint ? this.#hint : null,
        hasDescription ? this.#description : null,
        hasError ? this.#error : null,
      ].filter(Boolean),
      descriptionText,
    });
    this.#observeControls(controls);
    this.#applyDefaultA11y(hasLabel, isInvalid);
  }

  #assignContent(container, slotName, id) {
    container.id = id;
    const slot = document.createElement("slot");
    slot.name = slotName;
    const fallback = document.createElement("span");
    fallback.dataset.fallback = "";
    slot.append(fallback);
    container.append(slot);
    return container;
  }

  #resolveControls() {
    if (this.htmlFor) {
      const control = this.ownerDocument?.getElementById(this.htmlFor);
      return control instanceof HTMLElement ? [control] : [];
    }

    return this.#controlSlot
      .assignedElements({ flatten: true })
      .filter((element) => element instanceof HTMLElement);
  }

  #syncControlAssociations(controls, { label, labelText, descriptions, descriptionText }) {
    const nextControls = new Set(controls);

    for (const control of this.#managedControls) {
      if (!nextControls.has(control)) this.#clearControlAssociations(control);
    }

    for (const control of controls) {
      this.#syncControlAssociation(control, {
        fallbackAttribute: "aria-label",
        property: "ariaLabelledByElements",
        elements: label ? [label] : [],
        text: labelText,
        authorAttributes: ["aria-label", "aria-labelledby"],
      });
      this.#syncControlAssociation(control, {
        fallbackAttribute: "aria-description",
        property: "ariaDescribedByElements",
        elements: descriptions,
        text: descriptionText,
        authorAttributes: ["aria-description", "aria-describedby"],
      });
    }
  }

  #syncControlAssociation(
    control,
    { fallbackAttribute, property, elements, text, authorAttributes },
  ) {
    const hasAuthorAssociation = authorAttributes.some((name) =>
      this.#hasAuthorAttribute(control, name),
    );

    if (!hasAuthorAssociation && this.#setManagedElementReferences(control, property, elements)) {
      this.#clearManagedText(control, fallbackAttribute);
      return;
    }

    this.#clearManagedElementReferences(control, property);
    this.#setManagedText(control, fallbackAttribute, hasAuthorAssociation ? "" : text);
  }

  #hasAuthorAttribute(control, attribute) {
    const state = this.#managedText.get(control);
    return (
      control.hasAttribute(attribute) && state?.[attribute] !== control.getAttribute(attribute)
    );
  }

  #setManagedElementReferences(control, property, elements) {
    const internals = control.internals;
    if (!internals || !(property in internals)) return;

    try {
      internals[property] = elements;
    } catch (_error) {
      return false;
    }

    const appliedElements = Array.from(internals[property] ?? []);
    const applied =
      appliedElements.length === elements.length &&
      appliedElements.every((element, index) => element === elements[index]);
    if (!applied) {
      internals[property] = [];
      return false;
    }

    const state = this.#managedReferences.get(control) ?? {};
    state[property] = elements;
    this.#managedReferences.set(control, state);
    this.#managedControls.add(control);
    return true;
  }

  #clearManagedElementReferences(control, property) {
    const state = this.#managedReferences.get(control);

    const internals = control.internals;
    if (internals && property in internals) {
      internals[property] = [];
    }

    if (!state || !(property in state)) return;

    delete state[property];
    if (Object.keys(state).length === 0) this.#managedReferences.delete(control);
  }

  #setManagedText(control, attribute, value) {
    const state = this.#managedText.get(control) ?? {};
    const previousValue = state[attribute];
    const currentValue = control.getAttribute(attribute);

    if (previousValue === undefined && control.hasAttribute(attribute)) {
      return;
    }

    if (previousValue !== undefined && currentValue !== previousValue) {
      delete state[attribute];
      if (Object.keys(state).length === 0) this.#managedText.delete(control);
      return;
    }

    if (!value) {
      this.#clearManagedText(control, attribute);
      return;
    }

    control.setAttribute(attribute, value);
    state[attribute] = value;
    this.#managedText.set(control, state);
    this.#managedControls.add(control);
  }

  #clearManagedText(control, attribute) {
    const state = this.#managedText.get(control);
    const managedValue = state?.[attribute];
    if (managedValue === undefined) return;

    if (control.getAttribute(attribute) === managedValue) {
      control.removeAttribute(attribute);
    }

    delete state[attribute];
    if (Object.keys(state).length === 0) this.#managedText.delete(control);
  }

  #clearManagedControls() {
    for (const control of this.#managedControls) {
      this.#clearControlAssociations(control);
    }
  }

  #clearControlAssociations(control) {
    const text = this.#managedText.get(control);
    if (text) {
      Object.keys(text).forEach((attribute) => this.#clearManagedText(control, attribute));
    }

    const references = this.#managedReferences.get(control);
    if (references) {
      Object.keys(references).forEach((property) => {
        this.#clearManagedElementReferences(control, property);
      });
    }

    this.#managedControls.delete(control);
  }

  #observeControls(controls) {
    this.#controlObserver?.disconnect();
    this.#controlObserver = null;

    if (typeof MutationObserver === "undefined" || controls.length === 0) return;

    this.#controlObserver = new MutationObserver(() => this.requestRender());
    controls.forEach((control) => {
      this.#controlObserver.observe(control, {
        attributeFilter: ["invalid", "required", "aria-invalid"],
        attributes: true,
      });
    });
  }

  #focusControl() {
    const [control] = this.#resolveControls();
    control?.focus?.();
  }

  #applyDefaultA11y(hasLabel, isInvalid) {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = hasLabel
        ? contentText(this.#labelSlot, this.#labelFallback)
        : null;
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = isInvalid ? "true" : "false";
    }
  }
}

define("rowan-form-field", RowanFormField);
