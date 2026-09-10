import { expect } from "@esm-bundle/chai";
import "./dropdown.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-dropdown", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles open state via trigger click", async () => {
    const el = document.createElement("rowan-dropdown");
    document.body.append(el);
    await nextMicrotask();

    const trigger = el.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(el.open).to.equal(true);
  });
});
