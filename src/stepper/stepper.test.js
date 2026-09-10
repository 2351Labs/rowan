import { expect } from "@esm-bundle/chai";
import "./stepper.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-stepper", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects current-step property and attribute", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review", "Publish"];
    document.body.append(element);
    await nextMicrotask();

    element.currentStep = 2;
    expect(element.getAttribute("current-step")).to.equal("2");

    element.setAttribute("current-step", "3");
    expect(element.currentStep).to.equal(3);
  });

  it("renders steps from property array", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review", "Publish"];
    element.currentStep = 2;
    document.body.append(element);
    await nextMicrotask();

    const items = element.shadowRoot.querySelectorAll('[data-part="step"]');
    expect(items.length).to.equal(3);

    const current = element.shadowRoot.querySelector('[data-part="step-button"][aria-current="step"]');
    expect(current.textContent.trim()).to.include("Review");
  });

  it("emits rowan-step-change when user activates a step", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review", "Publish"];
    element.currentStep = 1;
    document.body.append(element);
    await nextMicrotask();

    let detail = null;
    let eventMeta = null;
    element.addEventListener("rowan-step-change", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const target = element.shadowRoot.querySelectorAll('[data-part="step-button"]')[1];
    target.click();
    await nextMicrotask();

    expect(element.currentStep).to.equal(2);
    expect(detail.currentStep).to.equal(2);
    expect(detail.previousStep).to.equal(1);
    expect(detail.stepLabel).to.equal("Review");
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("does not emit rowan-step-change when parent sets currentStep", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review", "Publish"];
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-step-change", () => {
      eventCount += 1;
    });

    element.currentStep = 3;
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("supports next, previous, and goTo methods", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review", "Publish"];
    document.body.append(element);
    await nextMicrotask();

    element.next();
    expect(element.currentStep).to.equal(2);

    element.goTo(3);
    expect(element.currentStep).to.equal(3);

    element.next();
    expect(element.currentStep).to.equal(3);

    element.previous();
    expect(element.currentStep).to.equal(2);

    element.goTo(0);
    expect(element.currentStep).to.equal(1);
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-stepper");
    element.steps = ["Draft", "Review"];
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("list");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaDisabled).to.equal("true");
  });
});