import { expect } from "@esm-bundle/chai";
import "./slider.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-slider", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects single values and normalizes them to its bounds", async () => {
    const element = document.createElement("rowan-slider");
    document.body.append(element);
    await nextMicrotask();

    element.min = 10;
    element.max = 50;
    element.step = 5;
    element.value = 27;

    expect(element.value).to.equal(25);
    expect(element.getAttribute("value")).to.equal("25");

    element.setAttribute("value", "60");
    expect(element.value).to.equal(50);
  });

  it("emits rowan-change for user input but not parent-driven updates", async () => {
    const element = document.createElement("rowan-slider");
    document.body.append(element);
    await nextMicrotask();

    let events = 0;
    element.addEventListener("rowan-change", () => {
      events += 1;
    });

    element.value = 20;
    await nextMicrotask();
    expect(events).to.equal(0);

    const input = element.shadowRoot.querySelector('[data-endpoint="value"]');
    input.value = "30";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(element.value).to.equal(30);
    expect(events).to.equal(1);
  });

  it("submits a single value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-slider");
    element.name = "volume";
    element.value = 35;
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    expect(new FormData(form).get("volume")).to.equal("35");
  });

  it("supports ordered range values and separate FACE entries", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-slider");
    element.range = true;
    element.name = "price";
    element.value = { start: 80, end: 20 };
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    expect(element.value).to.deep.equal({ start: 20, end: 80 });
    expect(new FormData(form).get("price-start")).to.equal("20");
    expect(new FormData(form).get("price-end")).to.equal("80");
  });

  it("uses its range bounds for omitted endpoints", async () => {
    const element = document.createElement("rowan-slider");
    element.range = true;
    element.min = 25;
    element.max = 75;
    document.body.append(element);
    await nextMicrotask();

    expect(element.value).to.deep.equal({ start: 25, end: 75 });
  });

  it("keeps range handles ordered through keyboard interaction", async () => {
    const element = document.createElement("rowan-slider");
    element.range = true;
    element.min = 0;
    element.max = 10;
    element.value = { start: 4, end: 5 };
    document.body.append(element);
    await nextMicrotask();

    const startInput = element.shadowRoot.querySelector('[data-endpoint="start"]');
    startInput.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

    expect(element.value).to.deep.equal({ start: 5, end: 5 });
  });

  it("uses its property-only formatter without reflecting it", async () => {
    const element = document.createElement("rowan-slider");
    element.value = 40;
    element.formatValue = (value) => `${value}% capacity`;
    document.body.append(element);
    await nextMicrotask();

    expect(element.hasAttribute("format-value")).to.equal(false);
    expect(element.shadowRoot.querySelector("output").textContent).to.equal("40% capacity");
  });

  it("localizes generated labels and display values through property-only messages", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const element = document.createElement("rowan-slider");
    element.range = true;
    element.min = 0;
    element.max = 10000;
    element.value = { start: 1234, end: 5678 };
    wrapper.append(element);
    document.body.append(wrapper);
    await nextMicrotask();

    let events = 0;
    element.addEventListener("rowan-change", () => {
      events += 1;
    });
    element.messages = {
      end: "Bis",
      rangeEndpoint: "{endpoint}: {label}",
      rangeValue: "{start} bis {end}",
      start: "Von",
      value: "Betrag",
    };
    await nextMicrotask();

    const formatter = new Intl.NumberFormat("de-DE");
    expect(element.getAttribute("messages")).to.equal(null);
    expect(element.locale).to.equal("de-DE");
    expect(element.shadowRoot.querySelector("output").textContent).to.equal(
      `${formatter.format(1234)} bis ${formatter.format(5678)}`,
    );
    expect(
      element.shadowRoot.querySelector('[data-endpoint="start"]').getAttribute("aria-label"),
    ).to.equal("Von: Betrag");
    expect(
      element.shadowRoot.querySelector('[data-endpoint="end"]').getAttribute("aria-valuetext"),
    ).to.equal(formatter.format(5678));
    expect(events).to.equal(0);
  });

  it("uses physical horizontal arrow directions in RTL", async () => {
    const element = document.createElement("rowan-slider");
    element.dir = "rtl";
    element.min = 0;
    element.max = 10;
    element.value = 5;
    document.body.append(element);
    await nextMicrotask();

    const input = element.shadowRoot.querySelector('[data-endpoint="value"]');
    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(element.value).to.equal(4);

    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }));
    expect(element.value).to.equal(5);
  });

  it("submits custom range names, restores form state, and exposes validity semantics", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-slider");
    element.range = true;
    element.name = "price";
    element.nameStart = "low";
    element.nameEnd = "high";
    element.label = "Price";
    element.required = true;
    element.value = { start: 10, end: 40 };
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    expect(new FormData(form).get("low")).to.equal("10");
    expect(new FormData(form).get("high")).to.equal("40");
    expect(element.internals.ariaLabel).to.equal("Price");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.checkValidity()).to.equal(true);
    expect(element.reportValidity()).to.equal(true);

    let changes = 0;
    element.addEventListener("rowan-change", () => {
      changes += 1;
    });
    element.value = { start: 15, end: 30 };
    form.reset();
    await nextMicrotask();

    expect(element.value).to.deep.equal({ start: 10, end: 40 });
    expect(changes).to.equal(0);

    element.formStateRestoreCallback("5|25");
    await nextMicrotask();
    expect(element.value).to.deep.equal({ start: 5, end: 25 });
    expect(changes).to.equal(0);

    element.disabled = true;
    element.invalid = true;
    await nextMicrotask();
    expect(new FormData(form).get("low")).to.equal(null);
    expect(element.internals.ariaDisabled).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");

    element.formatValue = "not-a-function";
    await nextMicrotask();
    expect(element.formatValue).to.equal(null);
    expect(element.shadowRoot.querySelector("output").textContent).to.not.equal("");
    const messages = element.messages;
    messages.value = "Mutated";
    expect(element.messages.value).to.not.equal("Mutated");
  });
});
