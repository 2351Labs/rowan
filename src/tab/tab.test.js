import { expect } from "@esm-bundle/chai";
import "./tab.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-tab", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("maps active to aria-selected", async () => {
    const tab = document.createElement("rowan-tab");
    tab.active = true;
    document.body.append(tab);
    await nextMicrotask();

    expect(tab.shadowRoot.querySelector("button").getAttribute("aria-selected")).to.equal("true");
  });
});
