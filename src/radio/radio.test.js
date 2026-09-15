import { expect } from "@esm-bundle/chai";
import "./radio.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-radio", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects checked state to input", async () => {
    const el = document.createElement("rowan-radio");
    el.checked = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector("input").checked).to.equal(true);
  });

  it("emits rowan-change on user interaction", async () => {
    const el = document.createElement("rowan-radio");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = el.shadowRoot.querySelector('input[type="radio"]');
    input.click();

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets checked", async () => {
    const el = document.createElement("rowan-radio");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    el.checked = true;
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE when checked", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-radio");

    el.name = "choice";
    el.value = "north";
    el.checked = true;

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("choice")).to.equal("north");
  });

  it("groups radios with the same form owner and name across wrappers", async () => {
    const form = document.createElement("form");
    const firstWrapper = document.createElement("div");
    const secondWrapper = document.createElement("div");
    const first = document.createElement("rowan-radio");
    const second = document.createElement("rowan-radio");
    first.name = "region";
    second.name = "region";
    firstWrapper.append(first);
    secondWrapper.append(second);
    form.append(firstWrapper, secondWrapper);
    document.body.append(form);
    await nextMicrotask();

    first.checked = true;
    second.checked = true;

    expect(first.checked).to.equal(false);
    expect(second.checked).to.equal(true);
  });

  it("does not group same-name radios from separate forms", async () => {
    const firstForm = document.createElement("form");
    const secondForm = document.createElement("form");
    const first = document.createElement("rowan-radio");
    const second = document.createElement("rowan-radio");
    first.name = "region";
    second.name = "region";
    firstForm.append(first);
    secondForm.append(second);
    document.body.append(firstForm, secondForm);
    await nextMicrotask();

    first.checked = true;
    second.checked = true;

    expect(first.checked).to.equal(true);
    expect(second.checked).to.equal(true);
  });

  it("resets to default checked state", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-radio");

    el.setAttribute("checked", "");
    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    el.checked = false;
    form.reset();

    expect(el.checked).to.equal(true);
  });

  it("syncs host a11y states for checked and required", async () => {
    const el = document.createElement("rowan-radio");
    el.required = true;
    el.label = "First choice";

    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("radio");
    expect(el.internals.ariaChecked).to.equal("false");
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("First choice");

    el.checked = true;
    await nextMicrotask();

    expect(el.internals.ariaChecked).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
