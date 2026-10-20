import { expect } from "@esm-bundle/chai";
import { reconnectHost } from "../../test/host-lifecycle.js";
import "./dropdown.js";
import "../icon-button/icon-button.js";
import "../dialog/dialog.js";
import "../menu/menu.js";
import "../menu-item/menu-item.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
};

async function waitForDropdownStyles(dropdown) {
  const stylesheet = dropdown.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (!stylesheet) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    if (hasLoadedRules()) return;
    await nextFrame();
  }

  throw new Error("Dropdown styles did not apply within 60 animation frames.");
}

async function waitForClampedPanel(panel, trigger) {
  for (let frame = 0; frame < 60; frame += 1) {
    const panelRect = panel.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    if (
      panelRect.width > 0 &&
      panelRect.right <= window.innerWidth &&
      panelRect.left >= 0 &&
      panelRect.left < triggerRect.left
    ) {
      return panelRect;
    }
    await nextFrame();
  }

  throw new Error("Panel did not clamp inside the viewport within 60 animation frames.");
}

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

  it("does not close a parent dialog on the same backdrop click", async () => {
    const dialog = document.createElement("rowan-dialog");
    const dropdown = document.createElement("rowan-dropdown");
    dialog.append(dropdown);
    document.body.append(dialog);
    await settle();

    dialog.open = true;
    await settle();
    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(true);

    const overlay = dialog.shadowRoot.querySelector("dialog");
    overlay.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await settle();

    expect(dropdown.open).to.equal(false);
    expect(dialog.open).to.equal(true);
  });

  it("tabs through non-menu panel content and closes at the edge", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const first = document.createElement("input");
    first.type = "checkbox";
    first.setAttribute("data-id", "first");
    const last = document.createElement("input");
    last.type = "checkbox";
    last.setAttribute("data-id", "last");
    dropdown.append(first, last);
    document.body.append(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();

    expect(dropdown.open).to.equal(true);
    expect(trigger.getAttribute("aria-haspopup")).to.equal("true");
    expect(document.activeElement).to.equal(first);

    const innerTab = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    first.dispatchEvent(innerTab);
    await settle();
    expect(dropdown.open).to.equal(true);

    const edgeTab = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    last.dispatchEvent(edgeTab);
    await settle();
    expect(dropdown.open).to.equal(false);
    expect(edgeTab.defaultPrevented).to.equal(false);
  });

  it("flips the panel to the trigger end when it would overflow the viewport", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.style.position = "fixed";
    dropdown.style.top = "8px";
    dropdown.style.right = "0";
    dropdown.style.left = "auto";
    const menu = document.createElement("div");
    menu.style.width = "16rem";
    menu.textContent = "Columns";
    dropdown.append(menu);
    document.body.append(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();

    const panel = dropdown.shadowRoot.querySelector(".panel");
    const panelRect = panel.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    expect(panelRect.right).to.be.at.most(window.innerWidth);
    expect(panelRect.left).to.be.at.least(0);
    expect(panelRect.left).to.be.below(triggerRect.left);
  });

  it("re-clamps when the panel grows while open", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.style.position = "fixed";
    dropdown.style.top = "8px";
    dropdown.style.left = `${Math.max(8, window.innerWidth - 240)}px`;
    const menu = document.createElement("div");
    menu.style.width = "6rem";
    menu.textContent = "Cols";
    dropdown.append(menu);
    document.body.append(dropdown);
    await settle();
    await waitForDropdownStyles(dropdown);

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();

    menu.style.width = "20rem";
    menu.textContent = "Columns that should not overflow after the panel grows.";

    const panel = dropdown.shadowRoot.querySelector(".panel");
    const clamped = await waitForClampedPanel(panel, trigger);
    expect(clamped.right).to.be.at.most(window.innerWidth);
    expect(clamped.left).to.be.at.least(0);
    expect(clamped.left).to.be.below(trigger.getBoundingClientRect().left);
  });

  it("clamps an initially open panel after styles apply", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.setAttribute("open", "");
    dropdown.style.position = "fixed";
    dropdown.style.top = "8px";
    dropdown.style.right = "0";
    dropdown.style.left = "auto";
    const menu = document.createElement("div");
    menu.style.width = "16rem";
    menu.textContent = "Columns";
    dropdown.append(menu);
    document.body.append(dropdown);
    await settle();
    await waitForDropdownStyles(dropdown);

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    const panel = dropdown.shadowRoot.querySelector(".panel");
    const clamped = await waitForClampedPanel(panel, trigger);
    expect(clamped.right).to.be.at.most(window.innerWidth);
    expect(clamped.left).to.be.at.least(0);
    expect(clamped.left).to.be.below(trigger.getBoundingClientRect().left);
  });

  it("closes on Tab so focus can leave", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "edit";
    item.textContent = "Edit";
    menu.append(item);
    dropdown.append(menu);
    document.body.append(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(true);

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    item.shadowRoot.querySelector("button").dispatchEvent(event);
    await settle();

    expect(dropdown.open).to.equal(false);
    expect(event.defaultPrevented).to.equal(false);
  });

  it("closes when a slotted menu item is activated", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "archive";
    item.textContent = "Archive";
    menu.append(item);
    dropdown.append(menu);
    document.body.append(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(true);

    item.shadowRoot.querySelector("button").click();
    await settle();

    expect(dropdown.open).to.equal(false);
  });

  it("keeps trigger and document dismissal after reconnecting", async () => {
    const outside = document.createElement("button");
    const dropdown = document.createElement("rowan-dropdown");
    document.body.append(outside, dropdown);
    await settle();

    await reconnectHost(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(true);

    await reconnectHost(dropdown);
    await settle();
    expect(dropdown.open).to.equal(true);

    outside.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    await settle();
    expect(dropdown.open).to.equal(false);
  });

  it("is not clipped by an overflow-hidden ancestor", async () => {
    const clip = document.createElement("div");
    clip.style.overflow = "hidden";
    clip.style.height = "2rem";
    clip.style.width = "12rem";
    const dropdown = document.createElement("rowan-dropdown");
    clip.append(dropdown);
    document.body.append(clip);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();

    const panel = dropdown.shadowRoot.querySelector(".panel");
    const panelRect = panel.getBoundingClientRect();
    const clipRect = clip.getBoundingClientRect();
    expect(panel.matches(":popover-open")).to.equal(true);
    expect(panelRect.bottom).to.be.above(clipRect.bottom);
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

  it("reflects a custom trigger label and its initial closed panel state", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.label = "Project actions";
    document.body.append(dropdown);
    await settle();

    const trigger = dropdown.shadowRoot.querySelector("rowan-button");
    const panel = dropdown.shadowRoot.querySelector(".panel");
    expect(dropdown.getAttribute("label")).to.equal("Project actions");
    expect(trigger.textContent).to.equal("Project actions");
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.getAttribute("aria-controls")).to.equal(panel.id);
    expect(panel.hidden).to.equal(true);
    expect(panel.getAttribute("aria-hidden")).to.equal("true");
  });

  it("uses a slotted trigger instead of the default button", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.type = "button";
    trigger.textContent = "MK";
    dropdown.append(trigger);
    document.body.append(dropdown);
    await settle();

    const fallback = dropdown.shadowRoot.querySelector(".fallback-trigger");
    expect(fallback.hidden).to.equal(true);
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");

    trigger.click();
    await settle();
    expect(dropdown.open).to.equal(true);
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("forwards popup state onto a slotted icon-button control", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const trigger = document.createElement("rowan-icon-button");
    trigger.slot = "trigger";
    trigger.label = "Account";
    dropdown.append(trigger);
    document.body.append(dropdown);
    await settle();

    const inner = trigger.shadowRoot.querySelector("button");
    expect(inner.getAttribute("aria-haspopup")).to.equal("menu");
    expect(inner.getAttribute("aria-expanded")).to.equal("false");

    trigger.click();
    await settle();
    expect(inner.getAttribute("aria-expanded")).to.equal("true");
  });

  it("clears managed popup attributes when the trigger slot is emptied", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.type = "button";
    trigger.textContent = "MK";
    dropdown.append(trigger);
    document.body.append(dropdown);
    await settle();

    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
    trigger.remove();
    await settle();
    expect(trigger.hasAttribute("aria-haspopup")).to.equal(false);
  });

  it("does not overwrite an author-supplied empty popup attribute", async () => {
    const dropdown = document.createElement("rowan-dropdown");
    const trigger = document.createElement("button");
    trigger.slot = "trigger";
    trigger.type = "button";
    trigger.textContent = "MK";
    trigger.setAttribute("aria-expanded", "");
    dropdown.append(trigger);
    document.body.append(dropdown);
    await settle();

    expect(trigger.getAttribute("aria-expanded")).to.equal("");
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
  });
});
