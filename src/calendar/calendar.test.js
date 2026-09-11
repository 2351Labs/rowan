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

  it("selects an ordered date range across two user selections", async () => {
    const element = document.createElement("rowan-calendar");
    element.selectionMode = "range";
    element.month = "2026-10";
    document.body.append(element);
    await nextMicrotask();

    const details = [];
    element.addEventListener("rowan-change", (event) => {
      details.push(event.detail);
    });

    element.shadowRoot.querySelector('[data-date="2026-10-18"]').click();
    await nextMicrotask();
    element.shadowRoot.querySelector('[data-date="2026-10-12"]').click();
    await nextMicrotask();

    expect(element.start).to.equal("2026-10-12");
    expect(element.end).to.equal("2026-10-18");
    expect(details).to.deep.equal([
      {
        value: { start: "2026-10-18", end: "" },
        start: "2026-10-18",
        end: "",
        source: "pointer",
      },
      {
        value: { start: "2026-10-12", end: "2026-10-18" },
        start: "2026-10-12",
        end: "2026-10-18",
        source: "pointer",
      },
    ]);

    expect(
      element.shadowRoot
        .querySelector('[data-date="2026-10-12"]')
        .classList.contains("range-start"),
    ).to.equal(true);
    expect(
      element.shadowRoot.querySelector('[data-date="2026-10-15"]').classList.contains("in-range"),
    ).to.equal(true);
    expect(
      element.shadowRoot.querySelector('[data-date="2026-10-18"]').classList.contains("range-end"),
    ).to.equal(true);
  });

  it("renders parent-controlled range endpoints without emitting a change", async () => {
    const element = document.createElement("rowan-calendar");
    element.selectionMode = "range";
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.setAttribute("start", "2026-11-12");
    element.setAttribute("end", "2026-11-18");
    await nextMicrotask();

    expect(element.month).to.equal("2026-11");
    expect(element.shadowRoot.querySelector('[data-date="2026-11-12"]')).to.exist;
    expect(
      element.shadowRoot.querySelector('[data-date="2026-11-18"]').classList.contains("range-end"),
    ).to.equal(true);
    expect(eventCount).to.equal(0);
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

  it("submits range endpoints through FACE when range mode is active", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-calendar");
    element.name = "serviceDate";
    element.selectionMode = "range";
    element.start = "2026-10-12";
    element.end = "2026-10-18";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("serviceDate-start")).to.equal("2026-10-12");
    expect(formData.get("serviceDate-end")).to.equal("2026-10-18");
  });

  it("resets and restores range endpoints without emitting a change", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-calendar");
    element.selectionMode = "range";
    element.start = "2026-10-12";
    element.end = "2026-10-18";
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.start = "2026-10-14";
    element.end = "2026-10-20";
    form.reset();
    await nextMicrotask();

    expect(element.start).to.equal("2026-10-12");
    expect(element.end).to.equal("2026-10-18");

    element.formStateRestoreCallback("2026-10-15|2026-10-19");
    await nextMicrotask();

    expect(element.start).to.equal("2026-10-15");
    expect(element.end).to.equal("2026-10-19");
    expect(eventCount).to.equal(0);
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

  it("validates a required ordered range", async () => {
    const element = document.createElement("rowan-calendar");
    element.selectionMode = "range";
    element.required = true;
    element.min = "2026-10-10";
    element.max = "2026-10-20";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-10-08";
    element.end = "2026-10-12";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-10-12";
    element.end = "2026-10-22";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-10-18";
    element.end = "2026-10-16";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-10-12";
    element.end = "2026-10-18";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);
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
