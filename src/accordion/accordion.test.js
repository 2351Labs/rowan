import { expect } from "@esm-bundle/chai";
import "./accordion.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-accordion", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects open attribute to panel visibility", async () => {
    const el = document.createElement("rowan-accordion");
    el.open = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
  });
});
