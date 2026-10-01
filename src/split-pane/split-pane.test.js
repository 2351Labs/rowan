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

  it("removes a disabled separator from keyboard resizing", async () => {
    const pane = document.createElement("rowan-split-pane");
    pane.position = 40;
    pane.disabled = true;
    document.body.append(pane);
    await nextMicrotask();

    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    const events = [];
    pane.addEventListener("rowan-resize", (event) => events.push(event));

    expect(separator.getAttribute("aria-disabled")).to.equal("true");
    expect(separator.tabIndex).to.equal(-1);

    separator.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    await nextMicrotask();

    expect(pane.position).to.equal(40);
    expect(events).to.have.length(0);
  });

  it("reverses horizontal arrow resizing in RTL", async () => {
    const pane = document.createElement("rowan-split-pane");
    pane.position = 50;
    pane.step = 5;
    pane.style.direction = "rtl";
    document.body.append(pane);
    await nextMicrotask();

    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    const events = [];
    pane.addEventListener("rowan-resize", (event) => events.push(event.detail));
    separator.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    await nextMicrotask();

    expect(pane.position).to.equal(45);
    expect(events).to.deep.equal([{ value: 45, previousValue: 50, orientation: "horizontal" }]);
  });

  it("uses inherited locale and property-only messages for separator announcements", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const pane = document.createElement("rowan-split-pane");
    pane.position = 12.5;
    wrapper.append(pane);
    document.body.append(wrapper);
    await nextMicrotask();

    const events = [];
    pane.addEventListener("rowan-resize", (event) => events.push(event));
    pane.messages = {
      resizePanes: "Bereiche anpassen",
      valueText: "{value} Prozent",
    };
    await nextMicrotask();

    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    expect(pane.getAttribute("messages")).to.equal(null);
    expect(pane.locale).to.equal("de-DE");
    expect(separator.getAttribute("aria-label")).to.equal("Bereiche anpassen");
    expect(separator.getAttribute("aria-valuetext")).to.equal("12,5 Prozent");
    expect(events).to.deep.equal([]);
  });

  it("measures horizontal pointer resizing from inline start in RTL", async () => {
    const pane = document.createElement("rowan-split-pane");
    pane.style.direction = "rtl";
    document.body.append(pane);
    await nextMicrotask();

    const layout = pane.shadowRoot.querySelector(".layout");
    const separator = pane.shadowRoot.querySelector('[role="separator"]');
    layout.getBoundingClientRect = () => ({
      bottom: 100,
      height: 100,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
    });
    separator.setPointerCapture = () => {};
    separator.releasePointerCapture = () => {};

    separator.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 50, pointerId: 1 }),
    );
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: 50, pointerId: 1 }));
    await nextMicrotask();

    expect(pane.position).to.equal(75);
  });
});
