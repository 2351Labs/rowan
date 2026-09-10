import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

function normalizeStepLabel(value, fallbackIndex) {
  const text = String(value ?? "").trim();
  return text || `Step ${fallbackIndex + 1}`;
}

function normalizeStepObject(step, index) {
  if (typeof step === "string") {
    const label = normalizeStepLabel(step, index);
    return {
      id: `step-${index + 1}`,
      label,
    };
  }

  if (step && typeof step === "object") {
    const idText = String(step.id ?? "").trim();
    const label = normalizeStepLabel(step.label, index);
    return {
      id: idText || `step-${index + 1}`,
      label,
    };
  }

  return {
    id: `step-${index + 1}`,
    label: `Step ${index + 1}`,
  };
}

function parseStepsAttribute(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];

  return raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((label, index) =>
      normalizeStepObject(
        {
          id: `step-${index + 1}`,
          label,
        },
        index,
      ),
    );
}

/**
 * Progress step tracker for multi-step workflows.
 * @tag rowan-stepper
 * @attr {number} current-step
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {string} steps
 * @attr {boolean} disabled
 * @csspart stepper
 * @csspart list
 * @csspart step
 * @csspart step-button
 * @csspart marker
 * @event rowan-step-change - Fired when a user activates a different step
 */
export class RowanStepper extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./stepper.css", import.meta.url).href;
  static observedAttributes = ["current-step", "orientation", "steps", "disabled"];
  static upgradeProperties = ["currentStep", "orientation", "steps", "disabled"];

  #steps = null;
  #list = null;

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

  get orientation() {
    const configured = this.readString("orientation", "horizontal").trim().toLowerCase();
    return configured === "vertical" ? "vertical" : "horizontal";
  }

  set orientation(value) {
    const next = String(value ?? "").trim().toLowerCase() === "vertical" ? "vertical" : "horizontal";
    this.reflectString("orientation", next === "horizontal" ? null : next);
  }

  get steps() {
    const source = this.#resolvedSteps();
    return source.map((step) => ({ ...step }));
  }

  set steps(value) {
    if (typeof value === "string") {
      this.#steps = null;
      this.reflectString("steps", value);
      this.requestRender();
      return;
    }

    const entries = Array.isArray(value) ? value : [];
    this.#steps = entries.map((step, index) => normalizeStepObject(step, index));
    this.reflectString("steps", null);
    this.requestRender();
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  next() {
    this.goTo(this.currentStep + 1);
  }

  previous() {
    this.goTo(this.currentStep - 1);
  }

  goTo(stepNumber) {
    const total = this.#resolvedSteps().length;
    const numeric = Number(stepNumber);
    const requested = Number.isFinite(numeric) ? Math.floor(numeric) : 1;
    const max = Math.max(1, total || 1);
    const clamped = Math.min(max, Math.max(1, requested));
    this.currentStep = clamped;
  }

  render() {
    if (!this.#list) {
      this.renderRoot.innerHTML = `
        <nav class="stepper" part="stepper">
          <ol class="list" part="list"></ol>
        </nav>
      `;

      this.#list = this.renderRoot.querySelector(".list");

      this.listen(this.#list, "click", (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches("button[data-step]"));

        if (!button || this.disabled) return;

        const next = Number(button.getAttribute("data-step"));
        this.#activateStep(next);
      });

      this.listen(this.#list, "keydown", (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches("button[data-step]"));

        if (!button) return;

        const buttons = Array.from(this.#list.querySelectorAll("button[data-step]"));
        const index = buttons.indexOf(button);
        if (index === -1) return;

        const isVertical = this.orientation === "vertical";
        const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
        const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";

        let nextIndex = -1;

        if (event.key === nextKey) nextIndex = Math.min(buttons.length - 1, index + 1);
        if (event.key === prevKey) nextIndex = Math.max(0, index - 1);
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = buttons.length - 1;

        if (nextIndex >= 0) {
          event.preventDefault();
          buttons[nextIndex].focus();
        }
      });
    }

    const steps = this.#resolvedSteps();
    const current = this.#normalizedCurrentStep(steps.length);

    this.#list.textContent = "";
    this.#list.classList.toggle("vertical", this.orientation === "vertical");

    const fragment = document.createDocumentFragment();

    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      const isCurrent = stepNumber === current;
      const isComplete = stepNumber < current;

      const item = document.createElement("li");
      item.className = "step";
      item.part = "step";
      item.dataset.part = "step";

      if (isCurrent) item.classList.add("is-current");
      if (isComplete) item.classList.add("is-complete");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-button";
      button.part = "step-button";
      button.dataset.part = "step-button";
      button.setAttribute("data-step", String(stepNumber));
      button.disabled = this.disabled;
      button.tabIndex = isCurrent ? 0 : -1;

      if (isCurrent) {
        button.setAttribute("aria-current", "step");
      }

      const marker = document.createElement("span");
      marker.className = "marker";
      marker.part = "marker";
      marker.textContent = String(stepNumber);

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = step.label;

      button.append(marker, label);
      item.append(button);
      fragment.append(item);
    });

    this.#list.append(fragment);
    this.#applyDefaultA11y();
  }

  #resolvedSteps() {
    if (Array.isArray(this.#steps)) {
      return this.#steps;
    }

    return parseStepsAttribute(this.readString("steps", ""));
  }

  #normalizedCurrentStep(stepCount) {
    const max = Math.max(1, stepCount || 1);
    const current = Math.min(max, Math.max(1, this.currentStep));

    if (current !== this.currentStep) {
      this.currentStep = current;
    }

    return current;
  }

  #activateStep(nextStep) {
    const steps = this.#resolvedSteps();
    if (steps.length === 0) return;

    const next = this.#normalizedCurrentStep(steps.length);
    const target = Math.min(steps.length, Math.max(1, Number(nextStep) || 1));

    if (target === next) return;

    const previousStep = next;
    this.currentStep = target;

    const selected = steps[target - 1];
    emit(this, "rowan-step-change", {
      currentStep: target,
      previousStep,
      stepId: selected.id,
      stepLabel: selected.label,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "list";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-stepper", RowanStepper);