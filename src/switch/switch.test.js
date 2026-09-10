import { expect } from "@esm-bundle/chai";
import "./switch.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-switch", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects checked state to input", async () => {
    const el = document.createElement("rowan-switch");
    el.checked = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector("input").checked).to.equal(true);
  });

  it("emits rowan-change on user interaction", async () => {
    const el = document.createElement("rowan-switch");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = el.shadowRoot.querySelector('input[type="checkbox"]');
    input.click();

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets checked", async () => {
    const el = document.createElement("rowan-switch");
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
    const el = document.createElement("rowan-switch");

    el.name = "availability";
    el.value = "on-duty";
    el.checked = true;

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("availability")).to.equal("on-duty");
  });

  it("resets to default checked state", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-switch");

    el.setAttribute("checked", "");
    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    el.checked = false;
    form.reset();

    expect(el.checked).to.equal(true);
  });

  it("syncs host a11y states for checked and required", async () => {
    const el = document.createElement("rowan-switch");
    el.required = true;
    el.label = "Availability";

    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("switch");
    expect(el.internals.ariaChecked).to.equal("false");
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("Availability");

    el.checked = true;
    await nextMicrotask();

    expect(el.internals.ariaChecked).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
