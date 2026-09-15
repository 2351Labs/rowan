import { expect } from "@esm-bundle/chai";
import "./icon-button.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-icon-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects label and size", async () => {
    const el = document.createElement("rowan-icon-button");
    document.body.append(el);
    await nextMicrotask();

    el.label = "Open";
    el.size = "lg";

    expect(el.getAttribute("label")).to.equal("Open");
    expect(el.getAttribute("size")).to.equal("lg");
  });

  it("emits rowan-click when activated", async () => {
    const el = document.createElement("rowan-icon-button");
    document.body.append(el);
    await nextMicrotask();

    let count = 0;
    el.addEventListener("rowan-click", () => {
      count += 1;
    });

    el.shadowRoot.querySelector("button").click();
    expect(count).to.equal(1);
  });

  it("does not emit rowan-click when disabled", async () => {
    const el = document.createElement("rowan-icon-button");
    el.disabled = true;
    document.body.append(el);
    await nextMicrotask();

    let count = 0;
    el.addEventListener("rowan-click", () => {
      count += 1;
    });

    el.shadowRoot.querySelector("button").click();
    expect(count).to.equal(0);
  });

  it("submits and resets its associated light-DOM form", async () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const submit = document.createElement("rowan-icon-button");
    const reset = document.createElement("rowan-icon-button");
    input.defaultValue = "Pine";
    input.value = "Cedar";
    submit.type = "submit";
    reset.type = "reset";
    form.append(input, submit, reset);
    document.body.append(form);
    await nextMicrotask();

    let submitCount = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitCount += 1;
    });

    submit.shadowRoot.querySelector("button").click();
    reset.shadowRoot.querySelector("button").click();

    expect(submitCount).to.equal(1);
    expect(input.value).to.equal("Pine");
  });
});
