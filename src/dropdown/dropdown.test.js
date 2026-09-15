import { expect } from "@esm-bundle/chai";
import "./dropdown.js";

const nextMicrotask = () => Promise.resolve();

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
};

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-dropdown", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles open state via trigger click", async () => {
    const el = document.createElement("rowan-dropdown");
    document.body.append(el);
    await nextMicrotask();

    const trigger = el.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(el.open).to.equal(true);
  });

  it("connects its trigger to the panel and dismisses from Escape or outside input", async () => {
    const outside = document.createElement("button");
    const dropdown = document.createElement("rowan-dropdown");
    document.body.append(outside, dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    const button = trigger.shadowRoot.querySelector("button");
    const panel = dropdown.shadowRoot.querySelector(".panel");
    const changes = [];
    dropdown.addEventListener("rowan-change", (event) => changes.push(event.detail));

    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(trigger.getAttribute("aria-controls")).to.equal(panel.id);
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
    expect(button.getAttribute("aria-expanded")).to.equal("true");
    expect(button.getAttribute("aria-haspopup")).to.equal("menu");
    expect(button.hasAttribute("aria-controls")).to.equal(false);
    expect(panel.getAttribute("aria-hidden")).to.equal("false");

    keydown(trigger, "Escape");
    await settle();
    expect(dropdown.open).to.equal(false);
    expect(trigger.shadowRoot.activeElement).to.equal(trigger.shadowRoot.querySelector("button"));

    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    outside.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(false);
    expect(changes).to.deep.equal([
      { open: true },
      { open: false },
      { open: true },
      { open: false },
    ]);
  });

  it("keeps parent-driven state changes silent", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    document.body.append(dropdown);
    await settle();

    let changeCount = 0;
    dropdown.addEventListener("rowan-change", () => {
      changeCount += 1;
    });
    dropdown.open = true;
    await settle();
    dropdown.open = false;
    await settle();

    expect(changeCount).to.equal(0);
  });
});
