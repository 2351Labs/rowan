import { expect } from "@esm-bundle/chai";
import "./tree.js";

const nextMicrotask = () => Promise.resolve();

async function renderTree({ expanded = false, selection = "single" } = {}) {
  const tree = document.createElement("rowan-tree");
  const guides = document.createElement("rowan-tree-item");
  const gettingStarted = document.createElement("rowan-tree-item");
  const reference = document.createElement("rowan-tree-item");

  tree.label = "Documentation";
  tree.selection = selection;
  guides.value = "guides";
  guides.expanded = expanded;
  guides.textContent = "Guides";
  gettingStarted.slot = "children";
  gettingStarted.value = "getting-started";
  gettingStarted.textContent = "Getting started";
  reference.value = "reference";
  reference.textContent = "Reference";

  guides.append(gettingStarted);
  tree.append(guides, reference);
  document.body.append(tree);
  await nextMicrotask();
  await nextMicrotask();

  return { tree, guides, gettingStarted, reference };
}

function keydown(item, key) {
  item.shadowRoot
    .querySelector("button")
    .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-tree", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps property-driven selection silent and emits a composed change for user activation", async () => {
    const { tree, guides, reference } = await renderTree();
    let detail = null;
    let eventMeta = null;

    tree.addEventListener("rowan-change", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    tree.selected = ["reference"];
    await nextMicrotask();

    expect(tree.selected).to.deep.equal(["reference"]);
    expect(reference.selected).to.equal(true);
    expect(detail).to.equal(null);

    guides.shadowRoot.querySelector("button").click();

    expect(detail.value).to.equal("guides");
    expect(detail.selected).to.deep.equal(["guides"]);
    expect(detail.item).to.equal(guides);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("uses Arrow Right and Arrow Left to expand, enter, and leave a branch", async () => {
    const { tree, guides, gettingStarted } = await renderTree();
    const toggles = [];

    tree.addEventListener("rowan-toggle", (event) => {
      toggles.push({
        detail: event.detail,
        bubbles: event.bubbles,
        composed: event.composed,
      });
    });

    guides.expanded = true;
    await nextMicrotask();
    expect(toggles).to.have.length(0);
    guides.expanded = false;
    await nextMicrotask();

    guides.focus();
    keydown(guides, "ArrowRight");
    await nextMicrotask();

    expect(guides.expanded).to.equal(true);
    expect(toggles).to.have.length(1);
    expect(toggles[0].detail.expanded).to.equal(true);
    expect(toggles[0]).to.include({ bubbles: true, composed: true });

    keydown(guides, "ArrowRight");
    expect(gettingStarted.shadowRoot.activeElement).to.equal(
      gettingStarted.shadowRoot.querySelector("button"),
    );

    keydown(gettingStarted, "ArrowLeft");
    expect(guides.shadowRoot.activeElement).to.equal(guides.shadowRoot.querySelector("button"));

    keydown(guides, "ArrowLeft");
    await nextMicrotask();
    expect(guides.expanded).to.equal(false);
    expect(toggles).to.have.length(2);
    expect(toggles[1].detail.expanded).to.equal(false);
  });

  it("moves roving focus through visible items and skips disabled nodes", async () => {
    const { guides, gettingStarted, reference } = await renderTree({ expanded: true });

    expect(guides.shadowRoot.querySelector("button").tabIndex).to.equal(0);
    expect(gettingStarted.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    expect(reference.shadowRoot.querySelector("button").tabIndex).to.equal(-1);

    guides.focus();
    keydown(guides, "ArrowDown");
    expect(gettingStarted.shadowRoot.activeElement).to.equal(
      gettingStarted.shadowRoot.querySelector("button"),
    );
    expect(guides.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    expect(gettingStarted.shadowRoot.querySelector("button").tabIndex).to.equal(0);

    keydown(gettingStarted, "ArrowDown");
    expect(reference.shadowRoot.activeElement).to.equal(
      reference.shadowRoot.querySelector("button"),
    );

    keydown(reference, "ArrowUp");
    expect(gettingStarted.shadowRoot.activeElement).to.equal(
      gettingStarted.shadowRoot.querySelector("button"),
    );

    keydown(gettingStarted, "Home");
    expect(guides.shadowRoot.activeElement).to.equal(guides.shadowRoot.querySelector("button"));

    keydown(guides, "End");
    expect(reference.shadowRoot.activeElement).to.equal(
      reference.shadowRoot.querySelector("button"),
    );

    reference.disabled = true;
    await nextMicrotask();
    guides.focus();
    keydown(guides, "ArrowDown");
    keydown(gettingStarted, "End");
    expect(gettingStarted.shadowRoot.activeElement).to.equal(
      gettingStarted.shadowRoot.querySelector("button"),
    );
  });

  it("owns tab stops for managed items without changing standalone behavior", async () => {
    const { guides, reference } = await renderTree();
    reference.tabIndex = 0;
    await nextMicrotask();

    expect(guides.shadowRoot.querySelector("button").tabIndex).to.equal(0);
    expect(reference.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
  });

  it("moves the roving tab stop for a click that does not change selection", async () => {
    const { tree, guides, reference } = await renderTree({ selection: "none" });

    reference.shadowRoot.querySelector("button").click();

    expect(tree.selected).to.deep.equal([]);
    expect(guides.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    expect(reference.shadowRoot.querySelector("button").tabIndex).to.equal(0);
  });

  it("provides sibling position metadata without replacing author-provided ARIA", async () => {
    const { guides, gettingStarted, reference } = await renderTree({ expanded: true });
    guides.setAttribute("aria-posinset", "9");
    guides.setAttribute("aria-setsize", "10");
    await nextMicrotask();

    expect(guides.getAttribute("aria-posinset")).to.equal("9");
    expect(guides.getAttribute("aria-setsize")).to.equal("10");

    if (!("ariaPosInSet" in gettingStarted.internals)) return;

    expect(gettingStarted.internals.ariaPosInSet).to.equal("1");
    expect(gettingStarted.internals.ariaSetSize).to.equal("1");
    expect(reference.internals.ariaPosInSet).to.equal("2");
    expect(reference.internals.ariaSetSize).to.equal("2");
  });

  it("releases tree-managed focus state when an item moves out of the tree", async () => {
    const { reference } = await renderTree();

    expect(reference.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    reference.remove();
    document.body.append(reference);
    await nextMicrotask();
    await nextMicrotask();

    expect(reference.shadowRoot.querySelector("button").tabIndex).to.equal(0);
    if (!("ariaPosInSet" in reference.internals)) return;

    expect(reference.internals.ariaPosInSet).to.equal(null);
    expect(reference.internals.ariaSetSize).to.equal(null);
  });

  it("returns selected items and clears selection without emitting an event", async () => {
    const { tree, guides, reference } = await renderTree({ selection: "multiple" });
    let changeCount = 0;

    tree.addEventListener("rowan-change", () => {
      changeCount += 1;
    });

    tree.selected = ["guides", "reference"];
    await nextMicrotask();

    expect(tree.selectedItems).to.deep.equal([guides, reference]);

    tree.clearSelection();
    await nextMicrotask();

    expect(tree.selected).to.deep.equal([]);
    expect(tree.selectedItems).to.deep.equal([]);
    expect(guides.selected).to.equal(false);
    expect(reference.selected).to.equal(false);
    expect(changeCount).to.equal(0);
  });

  it("clears pending selected values before their matching item is added", async () => {
    const tree = document.createElement("rowan-tree");
    document.body.append(tree);
    await nextMicrotask();

    tree.selected = ["future-item"];
    tree.clearSelection();

    const futureItem = document.createElement("rowan-tree-item");
    futureItem.value = "future-item";
    futureItem.textContent = "Future item";
    tree.append(futureItem);
    await nextMicrotask();
    await nextMicrotask();

    expect(tree.selected).to.deep.equal([]);
    expect(futureItem.selected).to.equal(false);
  });

  it("supports multiple selection from the keyboard without mutating an array attribute", async () => {
    const { tree, guides, reference } = await renderTree({ selection: "multiple" });
    const changes = [];

    tree.addEventListener("rowan-change", (event) => changes.push(event.detail));
    keydown(guides, " ");
    keydown(reference, " ");
    await nextMicrotask();

    expect(tree.selected).to.deep.equal(["guides", "reference"]);
    expect(tree.hasAttribute("selected")).to.equal(false);
    expect(changes).to.have.length(2);
  });

  it("does not select items when selection is none", async () => {
    const { tree, guides } = await renderTree({ selection: "none" });
    let changeCount = 0;

    tree.addEventListener("rowan-change", () => {
      changeCount += 1;
    });

    guides.shadowRoot.querySelector("button").click();
    await nextMicrotask();

    expect(tree.selected).to.deep.equal([]);
    expect(guides.selected).to.equal(false);
    expect(changeCount).to.equal(0);
  });

  it("does not duplicate controller events after reconnecting", async () => {
    const { tree, guides } = await renderTree();
    let changeCount = 0;

    tree.addEventListener("rowan-change", () => {
      changeCount += 1;
    });

    tree.remove();
    document.body.append(tree);
    await nextMicrotask();

    guides.shadowRoot.querySelector("button").click();
    expect(changeCount).to.equal(1);
  });
});
