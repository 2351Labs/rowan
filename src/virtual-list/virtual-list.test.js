import { expect } from "@esm-bundle/chai";

import "./virtual-list.js";

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

async function settle() {
  await Promise.resolve();
  await nextFrame();
  await Promise.resolve();
}

describe("rowan-virtual-list", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a bounded keyed window from property-only items", async () => {
    const items = Array.from({ length: 100 }, (_value, index) => ({
      id: `item-${index}`,
      label: `Item ${index}`,
    }));
    const list = document.createElement("rowan-virtual-list");

    list.items = items;
    list.itemKey = "id";
    list.itemSize = 20;
    list.overscan = 1;
    list.renderItem = (item) => item.label;
    document.body.append(list);
    await settle();

    const viewport = list.shadowRoot.querySelector(".viewport");
    viewport.style.height = "60px";
    viewport.style.overflow = "auto";
    await settle();

    const initialItems = list.shadowRoot.querySelectorAll("[data-virtual-list-key]");
    expect(initialItems.length).to.be.lessThan(items.length);
    expect(initialItems[0].textContent).to.equal("Item 0");
    expect(list.hasAttribute("items")).to.equal(false);

    list.scrollToIndex(40, { align: "start" });
    await settle();

    const renderedItems = list.shadowRoot.querySelectorAll("[data-virtual-list-key]");
    expect(renderedItems.length).to.be.lessThan(items.length);
    expect([...renderedItems].some((item) => item.dataset.virtualListKey === "item-40")).to.equal(
      true,
    );
  });

  it("retains visible item nodes when keyed items are replaced", async () => {
    const first = { id: "first", label: "First" };
    const second = { id: "second", label: "Second" };
    const list = document.createElement("rowan-virtual-list");

    list.items = [first, second];
    list.itemKey = "id";
    list.renderItem = (item) => item.label;
    document.body.append(list);
    await settle();

    const firstElement = list.shadowRoot.querySelector('[data-virtual-list-key="first"]');
    expect(firstElement).to.not.equal(null);

    list.items = [first, second, { id: "third", label: "Third" }];
    await settle();

    expect(list.shadowRoot.querySelector('[data-virtual-list-key="first"]')).to.equal(firstElement);
  });
});
