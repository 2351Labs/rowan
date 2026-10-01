import { expect } from "@esm-bundle/chai";
import { RowanDateRangePicker } from "./date-range-picker.js";

const nextMicrotask = () => Promise.resolve();
let preUpgradeTagId = 0;

describe("rowan-date-range-picker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects start and end properties with attributes", async () => {
    const element = document.createElement("rowan-date-range-picker");
    document.body.append(element);
    await nextMicrotask();

    element.start = "2026-09-10";
    element.end = "2026-09-20";

    expect(element.getAttribute("start")).to.equal("2026-09-10");
    expect(element.getAttribute("end")).to.equal("2026-09-20");

    element.setAttribute("start", "2026-09-12");
    element.setAttribute("end", "2026-09-18");

    expect(element.start).to.equal("2026-09-12");
    expect(element.end).to.equal("2026-09-18");
  });

  it("emits rowan-change only on user commits and clear", async () => {
    const element = document.createElement("rowan-date-range-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    let lastDetail = null;
    element.addEventListener("rowan-change", (event) => {
      eventCount += 1;
      lastDetail = event.detail;
    });

    const startInput = element.shadowRoot.querySelector('[data-field="start"]');
    const endInput = element.shadowRoot.querySelector('[data-field="end"]');
    const clearButton = element.shadowRoot.querySelector('[data-action="clear"]');

    startInput.value = "2026-09-11";
    startInput.dispatchEvent(new Event("change", { bubbles: true }));

    endInput.value = "2026-09-18";
    endInput.dispatchEvent(new Event("change", { bubbles: true }));

    clearButton.click();

    expect(eventCount).to.equal(3);
    expect(lastDetail.start).to.equal("");
    expect(lastDetail.end).to.equal("");
  });

  it("does not emit rowan-change when parent sets properties", async () => {
    const element = document.createElement("rowan-date-range-picker");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.start = "2026-09-10";
    element.end = "2026-09-20";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits start and end fields through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-date-range-picker");

    element.name = "reportDate";
    element.start = "2026-09-10";
    element.end = "2026-09-20";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("reportDate-start")).to.equal("2026-09-10");
    expect(formData.get("reportDate-end")).to.equal("2026-09-20");
  });

  it("validates required bounds and ordered range", async () => {
    const element = document.createElement("rowan-date-range-picker");
    element.required = true;
    element.min = "2026-09-10";
    element.max = "2026-09-20";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-09-08";
    element.end = "2026-09-12";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-09-12";
    element.end = "2026-09-24";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-09-18";
    element.end = "2026-09-16";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(false);

    element.start = "2026-09-12";
    element.end = "2026-09-18";
    await nextMicrotask();
    expect(element.checkValidity()).to.equal(true);
  });

  it("syncs host a11y defaults and invalid state", async () => {
    const element = document.createElement("rowan-date-range-picker");
    element.required = true;
    element.label = "Report range";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("group");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Report range");

    element.start = "2026-09-12";
    element.end = "2026-09-18";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });

  it("uses property-only messages for generated range copy without an event", async () => {
    const element = document.createElement("rowan-date-range-picker");
    element.label = "Report range";
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });
    element.messages = {
      clear: "Effacer",
      end: "Fin",
      rangeEndpoint: "{label}, {endpoint}",
      separator: "jusqu’au",
      start: "Début",
    };
    await nextMicrotask();

    expect(element.getAttribute("messages")).to.equal(null);
    expect(element.shadowRoot.querySelector('[part="separator"]').textContent).to.equal("jusqu’au");
    expect(element.shadowRoot.querySelector('[data-action="clear"]').textContent).to.equal(
      "Effacer",
    );
    expect(
      element.shadowRoot.querySelector('[data-field="start"]').getAttribute("aria-label"),
    ).to.equal("Report range, Début");
    expect(
      element.shadowRoot.querySelector('[data-field="end"]').getAttribute("aria-label"),
    ).to.equal("Report range, Fin");
    expect(eventCount).to.equal(0);
  });

  it("upgrades messages assigned before custom element definition", async () => {
    preUpgradeTagId += 1;
    const tag = `rowan-date-range-picker-upgrade-${preUpgradeTagId}`;
    const element = document.createElement(tag);
    element.messages = {
      clear: "Effacer",
      end: "Fin",
      rangeEndpoint: "{label}, {endpoint}",
      separator: "jusqu’au",
      start: "Début",
    };

    customElements.define(tag, class extends RowanDateRangePicker {});
    document.body.append(element);
    await nextMicrotask();

    expect(Object.hasOwn(element, "messages")).to.equal(false);
    expect(element.shadowRoot.querySelector('[data-action="clear"]').textContent).to.equal(
      "Effacer",
    );
    expect(element.shadowRoot.querySelector('[part="separator"]').textContent).to.equal("jusqu’au");
  });
});
