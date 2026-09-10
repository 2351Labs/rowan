import { expect } from "@esm-bundle/chai";
import "./calendar.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-calendar", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const element = document.createElement("rowan-calendar");
    document.body.append(element);
    await nextMicrotask();

    element.value = "2026-10-12";
    expect(element.getAttribute("value")).to.equal("2026-10-12");

    element.setAttribute("value", "2026-10-18");
    expect(element.value).to.equal("2026-10-18");
  });

  it("emits rowan-change when a day is selected by user", async () => {
    const element = document.createElement("rowan-calendar");
    element.setAttribute("month", "2026-10");
    document.body.append(element);
    await nextMicrotask();

    let detail = null;
    element.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });

    const dayButton = element.shadowRoot.querySelector('[data-date="2026-10-15"]');
    dayButton.click();

    expect(element.value).to.equal("2026-10-15");
    expect(detail.value).to.equal("2026-10-15");
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const element = document.createElement("rowan-calendar");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.value = "2026-10-20";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("supports keyboard navigation and enter selection", async () => {
    const element = document.createElement("rowan-calendar");
    element.month = "2026-10";
    element.value = "2026-10-12";
    document.body.append(element);
    await nextMicrotask();

    const active = element.shadowRoot.querySelector('[data-date="2026-10-12"]');
    active.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await nextMicrotask();

    const moved = element.shadowRoot.querySelector('[tabindex="0"]');
    expect(moved.getAttribute("data-date")).to.equal("2026-10-13");

    moved.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(element.value).to.equal("2026-10-13");
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-calendar");

    element.name = "serviceDate";
    element.value = "2026-10-21";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("serviceDate")).to.equal("2026-10-21");
  });

  it("validates required and min/max range", async () => {
    const element = document.createElement("rowan-calendar");
    element.required = true;
    element.min = "2026-10-10";
    element.max = "2026-10-20";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.value = "2026-10-08";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.value = "2026-10-15";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);

    element.value = "2026-10-22";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);
  });

  it("syncs host a11y states for required, disabled, invalid, and label", async () => {
    const element = document.createElement("rowan-calendar");
    element.required = true;
    element.label = "Service calendar";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("group");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Service calendar");

    element.value = "2026-10-15";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});