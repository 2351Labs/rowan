import { expect } from "@esm-bundle/chai";
import "./menu-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-menu-item", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects disabled state to internal button", async () => {
    const item = document.createElement("rowan-menu-item");
    item.disabled = true;
    document.body.append(item);
    await nextMicrotask();

    expect(item.shadowRoot.querySelector("button").disabled).to.equal(true);
  });
});
