import { expect } from "@esm-bundle/chai";
import "./tooltip.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-tooltip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles tooltip visibility when open changes", async () => {
    const el = document.createElement("rowan-tooltip");
    el.text = "Hint";
    document.body.append(el);
    await nextMicrotask();

    el.open = true;
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".tooltip").hidden).to.equal(false);
  });
});
