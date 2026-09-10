import { expect } from "@esm-bundle/chai";
import "./time-picker.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-time-picker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const element = document.createElement("rowan-time-picker");
    document.body.append(element);
    await nextMicrotask();

    element.value = "09:30";
    expect(element.getAttribute("value")).to.equal("09:30");

    element.setAttribute("value", "15:45");
    expect(element.value).to.equal("15:45");
  });

  it("emits rowan-change when user changes the value", async () => {
    const element = document.createElement("rowan-time-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="time"]');
    input.value = "10:15";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
    expect(element.value).to.equal("10:15");
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const element = document.createElement("rowan-time-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.value = "11:00";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-time-picker");

    element.name = "startTime";
    element.value = "08:45";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("startTime")).to.equal("08:45");
  });

  it("validates required and min/max time range", async () => {
    const element = document.createElement("rowan-time-picker");
    element.required = true;
    element.min = "09:00";
    element.max = "17:00";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.value = "08:30";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "13:15";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);

    element.value = "18:10";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);
  });

  it("syncs host a11y states for required, disabled, invalid, and label", async () => {
    const element = document.createElement("rowan-time-picker");
    element.required = true;
    element.label = "Start time";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("combobox");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Start time");

    element.value = "13:15";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});