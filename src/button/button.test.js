import { expect } from "@esm-bundle/chai";
import "./button.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects variant and size between properties and attributes", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    element.variant = "danger";
    element.size = "lg";

    expect(element.getAttribute("variant")).to.equal("danger");
    expect(element.getAttribute("size")).to.equal("lg");

    element.setAttribute("variant", "secondary");
    element.setAttribute("size", "sm");

    expect(element.variant).to.equal("secondary");
    expect(element.size).to.equal("sm");
  });

  it("emits rowan-click on activation", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    const internalButton = element.shadowRoot.querySelector("button");
    internalButton.click();

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-click when disabled", async () => {
    const element = document.createElement("rowan-button");
    element.disabled = true;
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    const internalButton = element.shadowRoot.querySelector("button");
    internalButton.click();

    expect(eventCount).to.equal(0);
  });
});
