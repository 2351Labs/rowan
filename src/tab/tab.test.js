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

    expect(tab.internals.ariaSelected).to.equal("true");
    expect(tab.shadowRoot.querySelector("button").getAttribute("role")).to.equal("presentation");
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

  it("reflects value and delegates host focus to the active tab button", async () => {
    const tab = document.createElement("rowan-tab");
    tab.value = "activity";
    document.body.append(tab);
    await nextMicrotask();

    const button = tab.shadowRoot.querySelector("button");
    expect(tab.getAttribute("value")).to.equal("activity");
    expect(tab.value).to.equal("activity");
    expect(button.tabIndex).to.equal(-1);

    tab.active = true;
    await nextMicrotask();
    tab.focus();

    expect(button.tabIndex).to.equal(0);
    expect(tab.shadowRoot.activeElement === button).to.equal(true);
  });

  it("preserves author-provided host role and selection state", async () => {
    const tab = document.createElement("rowan-tab");
    tab.setAttribute("role", "button");
    tab.setAttribute("aria-selected", "false");
    tab.active = true;
    document.body.append(tab);
    await nextMicrotask();

    expect(tab.getAttribute("role")).to.equal("button");
    expect(tab.getAttribute("aria-selected")).to.equal("false");
  });
});
