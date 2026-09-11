import { expect } from "@esm-bundle/chai";
import "./tree-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-tree-item", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects primitive state and exposes an expanded child group", async () => {
    const item = document.createElement("rowan-tree-item");
    const child = document.createElement("rowan-tree-item");
    child.slot = "children";
    child.textContent = "Guide";
    item.value = "guides";
    item.append("Guides", child);
    document.body.append(item);
    await nextMicrotask();

    const button = item.shadowRoot.querySelector("button");
    const children = item.shadowRoot.querySelector(".children");

    expect(item.hasChildren).to.equal(true);
    expect(button.getAttribute("aria-expanded")).to.equal("false");
    expect(children.hidden).to.equal(true);

    item.expanded = true;
    item.selected = true;
    await nextMicrotask();

    expect(item.getAttribute("expanded")).to.equal("");
    expect(item.getAttribute("selected")).to.equal("");
    expect(button.getAttribute("aria-expanded")).to.equal("true");
    expect(button.getAttribute("aria-selected")).to.equal("true");
    expect(children.hidden).to.equal(false);
  });

  it("retains an author-provided tab index on its focus control", async () => {
    const item = document.createElement("rowan-tree-item");
    item.tabIndex = -1;
    item.textContent = "Read only";
    document.body.append(item);
    await nextMicrotask();

    expect(item.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
  });

  it("accepts a controller-provided roving tab index without reflecting it", async () => {
    const item = document.createElement("rowan-tree-item");
    document.body.append(item);
    await nextMicrotask();

    item.setRovingTabIndex(-1);
    await nextMicrotask();

    expect(item.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    expect(item.hasAttribute("tabindex")).to.equal(false);
  });
});
