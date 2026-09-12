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
});