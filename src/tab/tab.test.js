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

  it("accepts a controller-owned roving tab index", async () => {
    const tab = document.createElement("rowan-tab");
    tab.active = true;
    document.body.append(tab);
    await nextMicrotask();

    const owner = {};
    tab.setRovingTabIndex(-1, owner);
    await nextMicrotask();
    expect(tab.shadowRoot.querySelector("button").tabIndex).to.equal(-1);

    tab.setRovingTabIndex(0, owner);
    await nextMicrotask();
    expect(tab.shadowRoot.querySelector("button").tabIndex).to.equal(0);
  });
});
