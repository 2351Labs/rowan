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

  it("reflects its value and exposes a menuitem button by default", async () => {
    const item = document.createElement("rowan-menu-item");
    item.value = "archive";
    document.body.append(item);
    await nextMicrotask();

    const button = item.shadowRoot.querySelector("button");
    expect(item.getAttribute("value")).to.equal("archive");
    expect(item.value).to.equal("archive");
    expect(item.internals.role).to.equal("menuitem");
    expect(button.getAttribute("role")).to.equal("menuitem");
    expect(button.tabIndex).to.equal(0);
  });

  it("preserves an author tab index while it is not menu-managed", async () => {
    const item = document.createElement("rowan-menu-item");
    item.tabIndex = -1;
    document.body.append(item);
    await nextMicrotask();

    expect(item.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
  });

  it("removes disabled items from activation and the tab sequence", async () => {
    const item = document.createElement("rowan-menu-item");
    item.disabled = true;
    document.body.append(item);
    await nextMicrotask();

    const button = item.shadowRoot.querySelector("button");
    let clickCount = 0;
    item.addEventListener("click", () => {
      clickCount += 1;
    });
    button.click();

    expect(button.tabIndex).to.equal(-1);
    expect(clickCount).to.equal(0);
  });
});
