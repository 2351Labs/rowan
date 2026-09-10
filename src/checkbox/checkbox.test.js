import { expect } from "@esm-bundle/chai";
import "./checkbox.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-checkbox", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects checked property and attribute", async () => {
    const element = document.createElement("rowan-checkbox");
    document.body.append(element);
    await nextMicrotask();

    element.checked = true;
    expect(element.hasAttribute("checked")).to.equal(true);

    element.removeAttribute("checked");
    expect(element.checked).to.equal(false);
  });

  it("emits rowan-change on user interaction", async () => {
    const element = document.createElement("rowan-checkbox");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="checkbox"]');
    input.click();

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets checked", async () => {
    const element = document.createElement("rowan-checkbox");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.checked = true;
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE when checked", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-checkbox");

    element.name = "consent";
    element.value = "yes";
    element.checked = true;

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("consent")).to.equal("yes");
  });

  it("resets to default checked state", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-checkbox");

    element.setAttribute("checked", "");
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    element.checked = false;
    form.reset();

    expect(element.checked).to.equal(true);
  });

  it("syncs host a11y states for checked and validity", async () => {
    const element = document.createElement("rowan-checkbox");
    element.label = "Accept terms";
    element.required = true;

    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("checkbox");
    expect(element.internals.ariaChecked).to.equal("false");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Accept terms");

    element.indeterminate = true;
    await nextMicrotask();

    expect(element.internals.ariaChecked).to.equal("mixed");

    element.indeterminate = false;
    element.checked = true;
    await nextMicrotask();

    expect(element.internals.ariaChecked).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("false");
  });
});
