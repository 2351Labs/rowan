import { expect } from "@esm-bundle/chai";
import "./tooltip.js";

const nextMicrotask = () => Promise.resolve();

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
};

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-tooltip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles tooltip visibility when open changes", async () => {
    const el = document.createElement("rowan-tooltip");
    el.text = "Hint";
    document.body.append(el);
    await nextMicrotask();

    el.open = true;
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".tooltip").hidden).to.equal(false);
  });

  it("describes its trigger and opens from focus before closing on Escape", async () => {
    const tooltip = document.createElement("rowan-tooltip");
    tooltip.text = "Save the current draft";
    const trigger = document.createElement("button");
    trigger.textContent = "Save";
    tooltip.append(trigger);
    document.body.append(tooltip);
    await settle();

    const bubble = tooltip.shadowRoot.querySelector(".tooltip");
    expect(tooltip.internals).to.equal(null);
    expect(bubble.getAttribute("role")).to.equal("tooltip");
    expect(trigger.getAttribute("aria-description")).to.equal("Save the current draft");

    trigger.focus();
    await settle();
    expect(tooltip.open).to.equal(true);

    keydown(trigger, "Escape");
    await settle();
    expect(tooltip.open).to.equal(false);
  });

  it("cleans managed descriptions as text and triggers change", async () => {
    const tooltip = document.createElement("rowan-tooltip");
    tooltip.text = "Initial hint";
    const firstTrigger = document.createElement("button");
    const secondTrigger = document.createElement("button");
    tooltip.append(firstTrigger);
    document.body.append(tooltip);
    await settle();

    expect(firstTrigger.getAttribute("aria-description")).to.equal("Initial hint");
    tooltip.text = "Updated hint";
    await settle();
    expect(firstTrigger.getAttribute("aria-description")).to.equal("Updated hint");

    tooltip.replaceChildren(secondTrigger);
    await settle();
    expect(firstTrigger.hasAttribute("aria-description")).to.equal(false);
    expect(secondTrigger.getAttribute("aria-description")).to.equal("Updated hint");

    secondTrigger.setAttribute("aria-describedby", "author-hint");
    tooltip.text = "Final hint";
    await settle();
    expect(secondTrigger.getAttribute("aria-describedby")).to.equal("author-hint");
    expect(secondTrigger.hasAttribute("aria-description")).to.equal(false);

    tooltip.text = "";
    await settle();
    expect(secondTrigger.hasAttribute("aria-description")).to.equal(false);
  });
});
