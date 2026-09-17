import { expect } from "@esm-bundle/chai";
import "./popover.js";
import "../button/button.js";
import "../dialog/dialog.js";

const nextMicrotask = () => Promise.resolve();

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
};

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-popover", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles panel visibility from open attribute", async () => {
    const el = document.createElement("rowan-popover");
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(true);

    el.open = true;
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
  });

  it("connects a slotted trigger and dismisses from Escape or outside pointer input", async () => {
    const outside = document.createElement("button");
    const popover = document.createElement("rowan-popover");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.textContent = "More options";
    popover.append(trigger);
    document.body.append(outside, popover);
    await settle();

    let changes = [];
    popover.addEventListener("rowan-change", (event) => changes.push(event.detail));

    trigger.click();
    await settle();
    const panel = popover.shadowRoot.querySelector(".panel");
    expect(popover.open).to.equal(true);
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
    expect(panel.getAttribute("role")).to.equal("dialog");
    expect(panel.getAttribute("aria-label")).to.equal("Popover");

    keydown(trigger, "Escape");
    await settle();
    expect(popover.open).to.equal(false);
    expect(document.activeElement).to.equal(trigger);

    trigger.click();
    await settle();
    outside.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    await settle();
    expect(popover.open).to.equal(false);
    expect(changes).to.deep.equal([
      { open: true },
      { open: false },
      { open: true },
      { open: false },
    ]);
  });

  it("cleans component-owned relationships when the trigger changes", async () => {
    const popover = document.createElement("rowan-popover");
    const firstTrigger = document.createElement("button");
    firstTrigger.slot = "trigger";
    const secondTrigger = document.createElement("button");
    secondTrigger.slot = "trigger";
    popover.append(firstTrigger);
    document.body.append(popover);
    await settle();

    expect(firstTrigger.getAttribute("aria-expanded")).to.equal("false");
    popover.replaceChildren(secondTrigger);
    await settle();

    expect(firstTrigger.hasAttribute("aria-expanded")).to.equal(false);
    expect(secondTrigger.getAttribute("aria-expanded")).to.equal("false");

    secondTrigger.setAttribute("aria-expanded", "mixed");
    popover.open = true;
    await settle();
    expect(secondTrigger.getAttribute("aria-expanded")).to.equal("mixed");
  });

  it("routes popup semantics to the interactive control of a Rowan Button trigger", async () => {
    const popover = document.createElement("rowan-popover");
    const trigger = document.createElement("rowan-button");
    trigger.slot = "trigger";
    trigger.textContent = "More options";
    popover.append(trigger);
    document.body.append(popover);
    await settle();
    await settle();

    const panel = popover.shadowRoot.querySelector(".panel");
    const button = trigger.shadowRoot.querySelector("button");
    expect(button.getAttribute("aria-expanded")).to.equal("false");
    expect(button.getAttribute("aria-haspopup")).to.equal("dialog");
    expect(button.getAttribute("aria-controls") || "").to.not.equal(panel.id);

    button.click();
    await settle();
    expect(button.getAttribute("aria-expanded")).to.equal("true");
  });

  it("does not close a parent dialog on the same backdrop click", async () => {
    const dialog = document.createElement("rowan-dialog");
    const popover = document.createElement("rowan-popover");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.textContent = "More";
    popover.append(trigger);
    dialog.append(popover);
    document.body.append(dialog);
    await settle();

    dialog.open = true;
    await settle();
    trigger.click();
    await settle();
    expect(popover.open).to.equal(true);

    const overlay = dialog.shadowRoot.querySelector("dialog");
    overlay.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await settle();

    expect(popover.open).to.equal(false);
    expect(dialog.open).to.equal(true);
  });

  it("closes only the topmost nested popover on Escape", async () => {
    const outer = document.createElement("rowan-popover");
    const outerTrigger = document.createElement("button");
    outerTrigger.slot = "trigger";
    const inner = document.createElement("rowan-popover");
    const innerTrigger = document.createElement("button");
    innerTrigger.slot = "trigger";
    inner.append(innerTrigger);
    outer.append(outerTrigger, inner);
    document.body.append(outer);
    await settle();

    outerTrigger.click();
    await settle();
    innerTrigger.click();
    await settle();
    expect(outer.open).to.equal(true);
    expect(inner.open).to.equal(true);

    keydown(innerTrigger, "Escape");
    await settle();

    expect(inner.open).to.equal(false);
    expect(outer.open).to.equal(true);
  });

  it("moves focus into the panel on open and closes from Escape on a descendant", async () => {
    const popover = document.createElement("rowan-popover");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.textContent = "More";
    const action = document.createElement("button");
    action.textContent = "Do it";
    popover.append(trigger, action);
    document.body.append(popover);
    await settle();

    trigger.click();
    await settle();

    expect(popover.open).to.equal(true);
    expect(document.activeElement).to.equal(action);

    keydown(action, "Escape");
    await settle();

    expect(popover.open).to.equal(false);
    expect(document.activeElement).to.equal(trigger);
  });

  it("is not clipped by an overflow-hidden ancestor", async () => {
    const clip = document.createElement("div");
    clip.style.overflow = "hidden";
    clip.style.height = "2rem";
    clip.style.width = "12rem";

    const popover = document.createElement("rowan-popover");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.textContent = "More";
    const body = document.createElement("p");
    body.textContent = "Tall popover content that would clip inside overflow hidden.";
    popover.append(trigger, body);
    clip.append(popover);
    document.body.append(clip);
    await settle();

    trigger.click();
    await settle();

    const panel = popover.shadowRoot.querySelector(".panel");
    const panelRect = panel.getBoundingClientRect();
    const clipRect = clip.getBoundingClientRect();

    expect(panel.matches(":popover-open")).to.equal(true);
    expect(panelRect.height).to.be.above(clipRect.height);
    expect(panelRect.bottom).to.be.above(clipRect.bottom);
  });
});
