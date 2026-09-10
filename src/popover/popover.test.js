import { expect } from "@esm-bundle/chai";
import "./popover.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-popover", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles panel visibility from open attribute", async () => {
    const el = document.createElement("rowan-popover");
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(true);

    el.open = true;
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
  });
});
