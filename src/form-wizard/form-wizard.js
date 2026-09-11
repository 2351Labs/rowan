import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../stepper/stepper.js";
import "../validation-summary/validation-summary.js";

let formWizardId = 0;

function normalizeStepLabel(value, fallbackIndex) {
  const text = String(value ?? "").trim();
  return text || `Step ${fallbackIndex + 1}`;
}

function normalizeStepObject(step, index) {
  if (typeof step === "string") {
    return {
      id: String(index + 1),
      label: normalizeStepLabel(step, index),
      slot: null,
    };
  }

  const source = step && typeof step === "object" ? step : {};
  const id = String(source.id ?? index + 1).trim() || String(index + 1);
  const slot = typeof source.slot === "string" ? source.slot.trim() : null;

  return {
    id,
    label: normalizeStepLabel(source.label, index),
    slot,
  };
}

function normalizeSteps(value) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.map((step, index) => {
    const normalized = normalizeStepObject(step, index);
    let id = normalized.id;

    while (ids.has(id)) {
      id = `${normalized.id}-${index + 1}`;
    }

    ids.add(id);
    return { ...normalized, id };
  });
}

function parseStepsAttribute(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];

  return normalizeSteps(
    raw
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean),
  );
}

function slotNameForStep(step) {
  if (step.slot !== null) return step.slot;
  if (step.id.startsWith("step-")) return step.id;
  return `step-${step.id}`;
}

function inferStepsFromPanels(host) {
  const panels = Array.from(host.children).filter(
    (child) => child instanceof HTMLElement && child.getAttribute("slot")?.startsWith("step-"),
  );

  if (panels.length > 0) {
    return normalizeSteps(
      panels.map((panel, index) => {
        const slot = panel.getAttribute("slot") || "";
        const id = slot.slice("step-".length) || String(index + 1);
        const label =
          panel.getAttribute("data-step-label") ||
          panel.getAttribute("aria-label") ||
          `Step ${index + 1}`;

        return { id, label, slot };
      }),
    );
  }

  return host.children.length > 0 ? [{ id: "1", label: "Step 1", slot: "" }] : [];
}

function isValidatableControl(element) {
  if (!(element instanceof HTMLElement) || typeof element.checkValidity !== "function") {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  if (["button", "fieldset", "form", "object", "output"].includes(tagName)) {
    return false;
  }

  return !element.disabled;
}

function controlLabel(control) {
  const explicit = control.getAttribute("label") || control.getAttribute("aria-label");
  if (explicit) return explicit.trim();

  if (control.id) {
    const associatedLabel = control.ownerDocument?.querySelector(
      `label[for="${CSS.escape(control.id)}"]`,
    );
    if (associatedLabel?.textContent) return associatedLabel.textContent.trim();
  }

  const wrappingLabel = control.closest("label");
  if (wrappingLabel?.textContent) return wrappingLabel.textContent.trim();

  return control.getAttribute("name") || "This field";
}

/**
 * Guided multi-step form workflow with guarded validation and progress.
 * @tag rowan-form-wizard
 * @attr {number} current-step
 * @attr {string} steps
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {string} label
 * @attr {string} previous-label
 * @attr {string} next-label
 * @attr {string} complete-label
 * @attr {boolean} disabled
 * @slot - Single-step form content when no named step panels are used
 * @slot step-* - A named step panel matching a configured step id
 * @csspart wizard
 * @csspart progress
 * @csspart stepper
 * @csspart validation-summary
 * @csspart panels
 * @csspart panel
 * @csspart actions
 * @csspart previous-button
 * @csspart next-button
 * @cssprop --rowan-form-wizard-border
 * @cssprop --rowan-form-wizard-panel-bg
 * @event rowan-step-change - Fired when a user moves between steps
 * @event rowan-invalid - Fired when a user tries to leave an invalid step
 * @event rowan-complete - Fired when a user completes the final valid step
 */
export class RowanFormWizard extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./form-wizard.css", import.meta.url).href;
  static observedAttributes = [
    "current-step",
    "steps",
    "orientation",
    "label",
    "previous-label",
    "next-label",
    "complete-label",
    "disabled",
  ];
  static upgradeProperties = [
    "currentStep",
    "steps",
    "orientation",
    "label",
    "previousLabel",
    "nextLabel",
    "completeLabel",
    "disabled",
  ];

  #steps = null;
  #root = null;
  #stepper = null;
  #validationSummary = null;
  #panelList = null;
  #previousButton = null;
  #nextButton = null;
  #panelEntries = [];
  #panelSignature = "";
  #errors = [];
  #listenerController = null;
  #panelObserver = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.id) {
      formWizardId += 1;
      this.id = `rowan-form-wizard-${formWizardId}`;
    }

    this.#observePanels();
    this.#installListeners();
    this.requestRender();
  }

  disconnectedCallback() {
    this.#listenerController?.abort();
    this.#listenerController = null;
    this.#panelObserver?.disconnect();
    this.#panelObserver = null;
    super.disconnectedCallback();
  }

  get currentStep() {
    const numeric = Number(this.readNumber("current-step", 1));
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.floor(numeric));
  }

  set currentStep(value) {
    const numeric = Number(value);
    const next = Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
    this.reflectNumber("current-step", next === 1 ? null : next);
  }

  get steps() {
    return this.#resolvedSteps().map((step) => ({ ...step }));
  }

  set steps(value) {
    if (typeof value === "string") {
      this.#steps = null;
      this.reflectString("steps", value.trim() || null);
      this.requestRender();
      return;
    }

    this.#steps = normalizeSteps(value);
    this.reflectString("steps", null);
    this.requestRender();
  }

  get orientation() {
    return this.readString("orientation", "horizontal").trim().toLowerCase() === "vertical"
      ? "vertical"
      : "horizontal";
  }

  set orientation(value) {
    const next =
      String(value ?? "")
        .trim()
        .toLowerCase() === "vertical"
        ? "vertical"
        : "horizontal";
    this.reflectString("orientation", next === "horizontal" ? null : next);
  }

  get label() {
    return this.readString("label", "Form wizard");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next && next !== "Form wizard" ? next : null);
  }

  get previousLabel() {
    return this.readString("previous-label", "Back");
  }

  set previousLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("previous-label", next && next !== "Back" ? next : null);
  }

  get nextLabel() {
    return this.readString("next-label", "Continue");
  }

  set nextLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("next-label", next && next !== "Continue" ? next : null);
  }

  get completeLabel() {
    return this.readString("complete-label", "Complete");
  }

  set completeLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("complete-label", next && next !== "Complete" ? next : null);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  next() {
    const steps = this.#resolvedSteps();
    const current = this.#normalizedCurrentStep(steps.length);
    if (!steps.length) return false;

    if (current === steps.length) {
      return this.complete();
    }

    const result = this.#validateStep(current, true);
    if (!result.valid) return false;

    this.#setCurrentStep(current + 1);
    return true;
  }

  previous() {
    return this.goTo(this.currentStep - 1);
  }

  goTo(stepNumber) {
    const steps = this.#resolvedSteps();
    if (!steps.length) return false;

    const numeric = Number(stepNumber);
    const requested = Number.isFinite(numeric) ? Math.floor(numeric) : 1;
    const next = Math.min(steps.length, Math.max(1, requested));

    return this.#setCurrentStep(next);
  }

  complete() {
    const steps = this.#resolvedSteps();
    if (!steps.length) return false;

    return this.#validateStep(this.#normalizedCurrentStep(steps.length), true).valid;
  }

  validateCurrentStep() {
    const steps = this.#resolvedSteps();
    if (!steps.length) return true;

    return this.#validateStep(this.#normalizedCurrentStep(steps.length), true).valid;
  }

  render() {
    const steps = this.#resolvedSteps();
    const current = this.#normalizedCurrentStep(steps.length);

    if (!this.#root) {
      this.#createStructure();
    }

    this.#stepper.steps = steps.map(({ id, label }) => ({ id, label }));
    this.#stepper.currentStep = current;
    this.#stepper.orientation = this.orientation;
    this.#stepper.disabled = this.disabled;

    this.#syncPanelEntries(steps);
    this.#syncPanelVisibility(steps, current);

    this.#previousButton.textContent = this.previousLabel;
    this.#previousButton.disabled = this.disabled || current <= 1 || steps.length === 0;
    this.#previousButton.hidden = steps.length <= 1;

    this.#nextButton.textContent = current === steps.length ? this.completeLabel : this.nextLabel;
    this.#nextButton.disabled = this.disabled || steps.length === 0;
    this.#nextButton.hidden = steps.length === 0;

    this.#validationSummary.errors = this.#errors;
    this.#validationSummary.hidden = this.#errors.length === 0;

    this.#applyDefaultA11y();
  }

  #resolvedSteps() {
    if (Array.isArray(this.#steps)) return this.#steps;

    const fromAttribute = parseStepsAttribute(this.readString("steps", ""));
    return fromAttribute.length > 0 ? fromAttribute : inferStepsFromPanels(this);
  }

  #normalizedCurrentStep(stepCount) {
    const max = Math.max(1, stepCount || 1);
    const current = Math.min(max, Math.max(1, this.currentStep));

    if (current !== this.currentStep) {
      this.currentStep = current;
    }

    return current;
  }

  #setCurrentStep(stepNumber) {
    const steps = this.#resolvedSteps();
    const current = this.#normalizedCurrentStep(steps.length);
    const next = Math.min(steps.length, Math.max(1, stepNumber));

    if (current === next) return false;

    this.currentStep = next;
    this.#setErrors([]);
    return true;
  }

  #createStructure() {
    this.renderRoot.innerHTML = `
      <section class="wizard" part="wizard">
        <div class="progress" part="progress">
          <rowan-stepper part="stepper"></rowan-stepper>
        </div>
        <rowan-validation-summary part="validation-summary" hidden></rowan-validation-summary>
        <div class="panels" part="panels">
          <div class="panel-list" data-panel-list></div>
        </div>
        <div class="actions" part="actions">
          <button class="action-button previous-button" part="previous-button" type="button" data-action="previous"></button>
          <button class="action-button next-button" part="next-button" type="button" data-action="next"></button>
        </div>
      </section>
    `;

    this.#root = this.renderRoot.querySelector(".wizard");
    this.#stepper = this.renderRoot.querySelector("rowan-stepper");
    this.#validationSummary = this.renderRoot.querySelector("rowan-validation-summary");
    this.#panelList = this.renderRoot.querySelector("[data-panel-list]");
    this.#previousButton = this.renderRoot.querySelector('[data-action="previous"]');
    this.#nextButton = this.renderRoot.querySelector('[data-action="next"]');
    this.#installListeners();
  }

  #installListeners() {
    if (!this.#root || this.#listenerController) return;

    this.#listenerController = new AbortController();
    const { signal } = this.#listenerController;

    this.#root.addEventListener(
      "click",
      (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLButtonElement && node.matches("button[data-action]"));

        if (!button || button.disabled || this.disabled) return;

        if (button.dataset.action === "previous") {
          this.#requestUserStep(this.currentStep - 1, "previous");
          return;
        }

        if (button.dataset.action === "next") {
          const steps = this.#resolvedSteps();
          const current = this.#normalizedCurrentStep(steps.length);

          if (current === steps.length) {
            this.#requestUserCompletion();
          } else {
            this.#requestUserStep(current + 1, "next");
          }
        }
      },
      { signal },
    );

    this.#stepper.addEventListener(
      "rowan-step-change",
      (event) => {
        event.stopPropagation();
        const requestedStep = Number(event.detail?.currentStep);
        this.#stepper.currentStep = this.#normalizedCurrentStep(this.#resolvedSteps().length);

        if (!this.disabled && Number.isFinite(requestedStep)) {
          this.#requestUserStep(requestedStep, "stepper");
        }
      },
      { signal },
    );
  }

  #observePanels() {
    this.#panelObserver?.disconnect();
    this.#panelObserver = new MutationObserver(() => {
      if (this.#steps === null && !this.getAttribute("steps")) {
        this.requestRender();
      }
    });

    this.#panelObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["slot", "data-step-label", "aria-label"],
    });
  }

  #syncPanelEntries(steps) {
    const signature = steps.map((step) => `${step.id}:${slotNameForStep(step)}`).join("|");
    if (signature === this.#panelSignature) return;

    this.#panelSignature = signature;
    this.#panelEntries = [];
    this.#panelList.textContent = "";

    steps.forEach((step, index) => {
      const panel = document.createElement("section");
      panel.className = "panel";
      panel.part = "panel";
      panel.dataset.part = "panel";
      panel.dataset.step = String(index + 1);
      panel.setAttribute("role", "region");

      const slot = document.createElement("slot");
      const slotName = slotNameForStep(step);
      if (slotName) slot.name = slotName;
      slot.addEventListener("slotchange", () => this.requestRender());

      panel.append(slot);
      this.#panelList.append(panel);
      this.#panelEntries.push({ panel, slot });
    });
  }

  #syncPanelVisibility(steps, current) {
    this.#panelEntries.forEach((entry, index) => {
      const isCurrent = index + 1 === current;
      entry.panel.hidden = !isCurrent;
      entry.panel.setAttribute("aria-label", steps[index]?.label || `Step ${index + 1}`);
    });
  }

  #requestUserStep(requestedStep, source) {
    const steps = this.#resolvedSteps();
    const previousStep = this.#normalizedCurrentStep(steps.length);
    const targetStep = Math.min(steps.length, Math.max(1, Math.floor(Number(requestedStep) || 1)));

    if (targetStep === previousStep) return false;

    if (targetStep > previousStep) {
      for (let stepNumber = previousStep; stepNumber < targetStep; stepNumber += 1) {
        const result = this.#validateStep(stepNumber, true);
        if (!result.valid) {
          if (stepNumber !== previousStep) {
            this.#setCurrentStep(stepNumber);
            this.#emitStepChange(stepNumber, previousStep, "validation");
          }

          this.#emitInvalid(stepNumber, result.errors, source);
          return false;
        }
      }
    }

    this.#setCurrentStep(targetStep);
    this.#emitStepChange(targetStep, previousStep, source);
    return true;
  }

  #requestUserCompletion() {
    const steps = this.#resolvedSteps();
    const current = this.#normalizedCurrentStep(steps.length);
    const result = this.#validateStep(current, true);

    if (!result.valid) {
      this.#emitInvalid(current, result.errors, "complete");
      return false;
    }

    const step = steps[current - 1];
    emit(this, "rowan-complete", {
      currentStep: current,
      stepId: step?.id || "",
      stepLabel: step?.label || "",
    });
    return true;
  }

  #validateStep(stepNumber, report) {
    const controls = this.#controlsForStep(stepNumber);
    const errors = [];

    controls.forEach((control, index) => {
      if (control.checkValidity()) return;

      const fieldId = this.#ensureFieldId(control, index);
      const label = controlLabel(control);
      errors.push({
        fieldId,
        label,
        message: control.validationMessage || `${label} is invalid`,
      });
    });

    if (errors.length > 0 && report) {
      const firstControl = controls.find((control) => !control.checkValidity());
      if (firstControl && typeof firstControl.reportValidity === "function") {
        firstControl.reportValidity();
      }
    }

    this.#setErrors(errors);
    return { valid: errors.length === 0, errors };
  }

  #controlsForStep(stepNumber) {
    const entry = this.#panelEntries[stepNumber - 1];
    if (!entry) return [];

    const controls = new Set();
    const assignedElements = entry.slot.assignedElements({ flatten: true });

    assignedElements.forEach((element) => {
      if (isValidatableControl(element)) controls.add(element);

      if (element instanceof HTMLFormElement) {
        Array.from(element.elements).forEach((control) => {
          if (isValidatableControl(control)) controls.add(control);
        });
      }

      element.querySelectorAll("*").forEach((child) => {
        if (isValidatableControl(child)) controls.add(child);
      });
    });

    return [...controls];
  }

  #ensureFieldId(control, index) {
    if (control.id) return control.id;

    control.id = `${this.id}__field-${index + 1}`;
    return control.id;
  }

  #setErrors(errors) {
    this.#errors = errors.map((error) => ({ ...error }));
    if (this.#validationSummary) {
      this.#validationSummary.errors = this.#errors;
      this.#validationSummary.hidden = this.#errors.length === 0;
    }

    this.requestRender();
  }

  #emitStepChange(currentStep, previousStep, source) {
    const step = this.#resolvedSteps()[currentStep - 1];
    emit(this, "rowan-step-change", {
      currentStep,
      previousStep,
      stepId: step?.id || "",
      stepLabel: step?.label || "",
      source,
    });
  }

  #emitInvalid(currentStep, errors, source) {
    const step = this.#resolvedSteps()[currentStep - 1];
    emit(this, "rowan-invalid", {
      currentStep,
      stepId: step?.id || "",
      errors: errors.map((error) => ({ ...error })),
      source,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "region";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label;
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-form-wizard", RowanFormWizard);
