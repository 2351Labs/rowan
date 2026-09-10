import { expect } from "@esm-bundle/chai";
import "./number-field.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-number-field", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const element = document.createElement("rowan-number-field");
    document.body.append(element);
    await nextMicrotask();

    element.value = "12.5";
    expect(element.getAttribute("value")).to.equal("12.5");

    element.setAttribute("value", "18");
    expect(element.value).to.equal("18");
  });

  it("emits rowan-change when user commits value", async () => {
    const element = document.createElement("rowan-number-field");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="number"]');
    input.value = "7";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(element.value).to.equal("7");
    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const element = document.createElement("rowan-number-field");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.value = "9";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-number-field");

    element.name = "quantity";
    element.value = "42";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("quantity")).to.equal("42");
  });

  it("validates required, min/max, and step", async () => {
    const element = document.createElement("rowan-number-field");
    element.required = true;
    element.min = "0";
    element.max = "10";
    element.step = 0.5;
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.value = "-1";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "11";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "1.25";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "1.5";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);
  });

  it("supports increment and decrement controls", async () => {
    const element = document.createElement("rowan-number-field");
    element.value = "2";
    element.min = "0";
    element.max = "3";
    element.step = 1;
    document.body.append(element);
    await nextMicrotask();

    const increment = element.shadowRoot.querySelector('[data-action="increment"]');
    const decrement = element.shadowRoot.querySelector('[data-action="decrement"]');

    increment.click();
    expect(element.value).to.equal("3");

    increment.click();
    expect(element.value).to.equal("3");

    decrement.click();
    expect(element.value).to.equal("2");
  });

  it("syncs host a11y states for required, disabled, invalid, and label", async () => {
    const element = document.createElement("rowan-number-field");
    element.required = true;
    element.label = "Quantity";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("spinbutton");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Quantity");

    element.value = "5";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});