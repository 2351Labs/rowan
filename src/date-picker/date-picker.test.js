import { expect } from "@esm-bundle/chai";
import "./date-picker.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-date-picker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const element = document.createElement("rowan-date-picker");
    document.body.append(element);
    await nextMicrotask();

    element.value = "2026-09-12";
    expect(element.getAttribute("value")).to.equal("2026-09-12");

    element.setAttribute("value", "2026-09-14");
    expect(element.value).to.equal("2026-09-14");
  });

  it("emits rowan-change when user changes the value", async () => {
    const element = document.createElement("rowan-date-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="date"]');
    input.value = "2026-09-16";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
    expect(element.value).to.equal("2026-09-16");
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const element = document.createElement("rowan-date-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.value = "2026-09-18";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-date-picker");

    element.name = "startDate";
    element.value = "2026-09-20";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("startDate")).to.equal("2026-09-20");
  });

  it("validates required and min/max date range", async () => {
    const element = document.createElement("rowan-date-picker");
    element.required = true;
    element.min = "2026-09-10";
    element.max = "2026-09-20";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.value = "2026-09-08";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "2026-09-14";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);

    element.value = "2026-09-24";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);
  });

  it("syncs host a11y states for required, disabled, invalid, and label", async () => {
    const element = document.createElement("rowan-date-picker");
    element.required = true;
    element.label = "Start date";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("combobox");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Start date");

    element.value = "2026-09-14";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});