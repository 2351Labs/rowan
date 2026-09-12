import { expect } from "@esm-bundle/chai";

import "./split-pane.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-split-pane", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects constrained position and emits resize only for keyboard interaction", async () => {
    const pane = document.createElement("rowan-split-pane");
    pane.min = 20;
    pane.max = 80;
    pane.step = 5;
    pane.position = 35;
    document.body.append(pane);
    await nextMicrotask();

    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    expect(separator).to.not.equal(null);
    expect(pane.position).to.equal(35);
    expect(pane.getAttribute("position")).to.equal("35");
    expect(separator.getAttribute("aria-valuemin")).to.equal("20");
    expect(separator.getAttribute("aria-valuemax")).to.equal("80");

    const events = [];
    pane.addEventListener("rowan-resize", (event) => events.push(event.detail));

    pane.position = 40;
    await nextMicrotask();
    expect(events).to.deep.equal([]);

    separator.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    await nextMicrotask();

    expect(pane.position).to.equal(45);
    expect(events).to.deep.equal([{ value: 45, previousValue: 40, orientation: "horizontal" }]);
  });

  it("uses property-only snap points and vertical keyboard controls", async () => {
    const pane = document.createElement("rowan-split-pane");
    pane.orientation = "vertical";
    pane.min = 10;
    pane.max = 90;
    pane.snapPoints = [25, 50, 75];
    pane.snapThreshold = 3;
    pane.position = 26;
    document.body.append(pane);
    await nextMicrotask();

    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    expect(pane.position).to.equal(25);
    expect(pane.hasAttribute("snap-points")).to.equal(false);
    expect(separator.getAttribute("aria-orientation")).to.equal("horizontal");

    separator.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "End" }));
    await nextMicrotask();

    expect(pane.position).to.equal(90);
  });
});
