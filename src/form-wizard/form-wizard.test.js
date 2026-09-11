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
});
