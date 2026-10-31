import { expect } from "@esm-bundle/chai";
import "./form-wizard.js";

const nextMicrotask = () => Promise.resolve();

async function renderWizard() {
  const wizard = document.createElement("rowan-form-wizard");
  wizard.steps = [
    { id: "details", label: "Details" },
    { id: "review", label: "Review" },
  ];

  const details = document.createElement("section");
  details.slot = "step-details";
  details.setAttribute("data-step-label", "Details");

  const name = document.createElement("input");
  name.id = "wizard-name";
  name.name = "name";
  name.required = true;
  details.append(name);

  const review = document.createElement("section");
  review.slot = "step-review";
  review.textContent = "Review your details.";

  wizard.append(details, review);
  document.body.append(wizard);
  await nextMicrotask();
  await nextMicrotask();

  return { wizard, name };
}

describe("rowan-form-wizard", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders configured named panels and reflects current-step", async () => {
    const { wizard } = await renderWizard();

    const panels = wizard.shadowRoot.querySelectorAll('[data-part="panel"]');
    expect(panels.length).to.equal(2);
    expect(panels[0].hidden).to.equal(false);
    expect(panels[1].hidden).to.equal(true);

    wizard.currentStep = 2;
    await nextMicrotask();

    expect(wizard.getAttribute("current-step")).to.equal("2");
    expect(panels[0].hidden).to.equal(true);
    expect(panels[1].hidden).to.equal(false);
  });

  it("uses its default slot as a single inferred panel", async () => {
    const wizard = document.createElement("rowan-form-wizard");
    const content = document.createElement("p");
    content.textContent = "One-step workflow";

    wizard.append(content);
    document.body.append(wizard);
    await nextMicrotask();
    await nextMicrotask();

    const panelSlot = wizard.shadowRoot.querySelector('[data-part="panel"] slot');
    expect(panelSlot.assignedElements()).to.deep.equal([content]);
    expect(wizard.shadowRoot.querySelector('[data-action="next"]').hidden).to.equal(false);
    expect(wizard.shadowRoot.querySelector('[data-action="next"]').textContent).to.equal(
      "Complete",
    );
  });

  it("blocks user navigation from an invalid current panel and emits rowan-invalid", async () => {
    const { wizard } = await renderWizard();
    let detail = null;
    let eventMeta = null;

    wizard.addEventListener("rowan-invalid", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    wizard.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();

    expect(wizard.currentStep).to.equal(1);
    expect(detail.currentStep).to.equal(1);
    expect(detail.errors[0].fieldId).to.equal("wizard-name");
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
    expect(wizard.shadowRoot.querySelector("rowan-validation-summary").hidden).to.equal(false);
  });

  it("emits rowan-step-change only for user navigation", async () => {
    const { wizard, name } = await renderWizard();
    let eventCount = 0;
    let detail = null;

    wizard.addEventListener("rowan-step-change", (event) => {
      eventCount += 1;
      detail = event.detail;
    });

    wizard.goTo(2);
    await nextMicrotask();
    expect(eventCount).to.equal(0);

    wizard.goTo(1);
    name.value = "Ada";
    wizard.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();

    expect(wizard.currentStep).to.equal(2);
    expect(eventCount).to.equal(1);
    expect(detail).to.include({
      currentStep: 2,
      previousStep: 1,
      stepId: "review",
      source: "next",
    });
  });

  it("uses property-only messages for generated steps, actions, and validation copy", async () => {
    const wizard = document.createElement("rowan-form-wizard");
    wizard.steps = [{ id: "details" }, { id: "review" }];

    const details = document.createElement("section");
    details.slot = "step-details";
    const invalidControl = document.createElement("div");
    invalidControl.checkValidity = () => false;
    invalidControl.reportValidity = () => false;
    details.append(invalidControl);

    const review = document.createElement("section");
    review.slot = "step-review";
    wizard.append(details, review);
    document.body.append(wizard);
    await nextMicrotask();
    await nextMicrotask();

    const events = [];
    ["rowan-step-change", "rowan-invalid", "rowan-complete"].forEach((type) => {
      wizard.addEventListener(type, () => events.push(type));
    });
    wizard.messages = {
      completeLabel: "Finalizar",
      label: "Asistente",
      nextLabel: "Siguiente",
      previousLabel: "Anterior",
      stepLabel: "Paso {step}",
      thisField: "Este campo",
      validationErrorItem: "Problema {index}: {message}",
      validationFieldInvalid: "{label} no es valido",
      validationHeading: "Corrige los campos",
    };
    await nextMicrotask();
    await nextMicrotask();

    expect(wizard.getAttribute("messages")).to.equal(null);
    expect(wizard.internals.ariaLabel).to.equal("Asistente");
    expect(wizard.steps.map((step) => step.label)).to.deep.equal(["Paso 1", "Paso 2"]);
    expect(wizard.shadowRoot.querySelector('[data-action="previous"]').textContent).to.equal(
      "Anterior",
    );
    expect(wizard.shadowRoot.querySelector('[data-action="next"]').textContent).to.equal(
      "Siguiente",
    );
    expect(events).to.deep.equal([]);

    wizard.validateCurrentStep();
    await nextMicrotask();
    await nextMicrotask();

    const summary = wizard.shadowRoot.querySelector("rowan-validation-summary");
    expect(summary.shadowRoot.querySelector('[data-part="heading-text"]').textContent).to.equal(
      "Corrige los campos",
    );
    expect(summary.shadowRoot.querySelector('[data-part="error-button"]').textContent).to.equal(
      "Problema 1: Este campo no es valido",
    );
    expect(events).to.deep.equal([]);

    wizard.nextLabel = "Manual";
    wizard.messages = { nextLabel: "Ignored" };
    await nextMicrotask();

    expect(wizard.shadowRoot.querySelector('[data-action="next"]').textContent).to.equal("Manual");
  });

  it("infers slotted steps, dedupes ids, and keeps programmatic navigation silent", async () => {
    const inferred = document.createElement("rowan-form-wizard");
    const details = document.createElement("section");
    details.slot = "step-details";
    details.setAttribute("data-step-label", "Details");
    const review = document.createElement("section");
    review.slot = "step-review";
    review.setAttribute("aria-label", "Review");
    inferred.append(details, review);
    document.body.append(inferred);
    await nextMicrotask();
    await nextMicrotask();

    expect(inferred.steps.map((step) => step.id)).to.deep.equal(["details", "review"]);
    expect(inferred.steps.map((step) => step.label)).to.deep.equal(["Details", "Review"]);

    inferred.steps = "Alpha, Beta";
    await nextMicrotask();
    expect(inferred.getAttribute("steps")).to.equal("Alpha, Beta");
    expect(inferred.steps.map((step) => step.label)).to.deep.equal(["Alpha", "Beta"]);

    inferred.steps = [{ id: "review" }, { id: "review", label: "Again" }];
    await nextMicrotask();
    expect(inferred.steps.map((step) => step.id)).to.deep.equal(["review", "review-2"]);

    inferred.orientation = "vertical";
    inferred.label = "Intake";
    inferred.previousLabel = "Back now";
    inferred.completeLabel = "Finish";
    inferred.disabled = true;
    await nextMicrotask();

    expect(inferred.getAttribute("orientation")).to.equal("vertical");
    expect(inferred.shadowRoot.querySelector("rowan-stepper").orientation).to.equal("vertical");
    expect(inferred.internals.ariaLabel).to.equal("Intake");
    expect(inferred.internals.ariaDisabled).to.equal("true");
    expect(inferred.shadowRoot.querySelector('[data-action="previous"]').textContent).to.equal(
      "Back now",
    );
    expect(inferred.shadowRoot.querySelector('[data-action="next"]').disabled).to.equal(true);

    const messages = inferred.messages;
    messages.label = "Mutated";
    expect(inferred.messages.label).to.not.equal("Mutated");

    const empty = document.createElement("rowan-form-wizard");
    empty.steps = [];
    document.body.append(empty);
    await nextMicrotask();
    await nextMicrotask();
    expect(empty.next()).to.equal(false);
    expect(empty.previous()).to.equal(false);
    expect(empty.complete()).to.equal(false);
  });

  it("validates through next() and emits completion only from the action button", async () => {
    const { wizard, name } = await renderWizard();
    const events = [];
    wizard.addEventListener("rowan-step-change", () => events.push("step"));
    wizard.addEventListener("rowan-invalid", () => events.push("invalid"));
    wizard.addEventListener("rowan-complete", (event) => events.push(event.detail.stepId));

    expect(wizard.next()).to.equal(false);
    expect(wizard.currentStep).to.equal(1);
    expect(events).to.deep.equal([]);

    name.disabled = true;
    expect(wizard.next()).to.equal(true);
    expect(wizard.currentStep).to.equal(2);
    expect(wizard.previous()).to.equal(true);
    expect(wizard.currentStep).to.equal(1);
    expect(events).to.deep.equal([]);

    name.disabled = false;
    name.value = "Ada";
    expect(wizard.next()).to.equal(true);
    expect(wizard.complete()).to.equal(true);
    expect(events).to.deep.equal([]);

    const extra = document.createElement("input");
    extra.required = true;
    wizard.querySelector('[slot="step-review"]').append(extra);
    wizard.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();
    expect(wizard.currentStep).to.equal(2);
    expect(events).to.deep.equal(["invalid"]);

    extra.value = "ok";
    wizard.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();
    expect(events).to.deep.equal(["invalid", "review"]);

    wizard.disabled = true;
    wizard.goTo(1);
    events.length = 0;
    wizard.shadowRoot.querySelector("rowan-stepper").dispatchEvent(
      new CustomEvent("rowan-step-change", {
        bubbles: true,
        detail: { currentStep: 2 },
      }),
    );
    await nextMicrotask();
    expect(wizard.currentStep).to.equal(1);
    expect(events).to.deep.equal([]);
  });
});
