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
});
