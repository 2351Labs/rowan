import { expect } from "@esm-bundle/chai";
import "./textarea.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-textarea", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value to internal textarea", async () => {
    const el = document.createElement("rowan-textarea");
    el.value = "Draft";
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector("textarea").value).to.equal("Draft");
  });

  it("emits rowan-change when user changes the value", async () => {
    const el = document.createElement("rowan-textarea");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const textarea = el.shadowRoot.querySelector("textarea");
    textarea.value = "Trail notes";
    textarea.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const el = document.createElement("rowan-textarea");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    el.value = "Programmatic";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-textarea");

    el.name = "notes";
    el.value = "Mossy trail";

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("notes")).to.equal("Mossy trail");
  });

  it("reports invalid when required and empty", async () => {
    const el = document.createElement("rowan-textarea");
    el.required = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(false);

    el.value = "Ready";
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(true);
  });

  it("resets to default value", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-textarea");

    el.setAttribute("value", "Start");
    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    el.value = "Changed";
    form.reset();

    expect(el.value).to.equal("Start");
  });

  it("syncs host a11y states for multiline required fields", async () => {
    const el = document.createElement("rowan-textarea");
    el.required = true;
    el.label = "Notes";

    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("textbox");
    expect(el.internals.ariaMultiLine).to.equal("true");
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("Notes");

    el.value = "Ready";
    await nextMicrotask();

    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
