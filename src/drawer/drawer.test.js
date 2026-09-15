import { expect } from "@esm-bundle/chai";
import "./drawer.js";

const nextMicrotask = () => Promise.resolve();

function keydown(element, key, options = {}) {
  element.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, composed: true, key, ...options }),
  );
}

describe("rowan-drawer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hides backdrop when closed", async () => {
    const drawer = document.createElement("rowan-drawer");
    document.body.append(drawer);
    await nextMicrotask();

    const backdrop = drawer.shadowRoot.querySelector(".backdrop");
    const panel = drawer.shadowRoot.querySelector(".panel");
    expect(backdrop.hidden).to.equal(true);
    expect(panel.hidden).to.equal(true);
    expect(getComputedStyle(panel).display).to.equal("none");
  });

  it("keeps closed drawers out of modal semantics and names open drawers", async () => {
    const drawer = document.createElement("rowan-drawer");
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Navigation";
    drawer.append(title);
    document.body.append(drawer);
    await nextMicrotask();

    expect(drawer.inert).to.equal(true);
    expect(drawer.internals.role).to.equal(null);
    expect(drawer.internals.ariaHidden).to.equal("true");

    drawer.open = true;
    await nextMicrotask();

    const panel = drawer.shadowRoot.querySelector(".panel");
    expect(drawer.inert).to.equal(false);
    expect(drawer.internals.role).to.equal("dialog");
    expect(drawer.internals.ariaModal).to.equal("true");
    expect(drawer.internals.ariaHidden).to.equal("false");
    expect(drawer.internals.ariaLabel).to.equal("Navigation");
    expect(panel.getAttribute("role")).to.equal("dialog");
    expect(panel.getAttribute("aria-modal")).to.equal("true");
    expect(panel.getAttribute("aria-label")).to.equal("Navigation");
  });

  it("closes on Escape, emits a user change, and returns focus", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open navigation";
    document.body.append(trigger);
    trigger.focus();

    const drawer = document.createElement("rowan-drawer");
    document.body.append(drawer);
    await nextMicrotask();

    let detail = null;
    drawer.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });

    drawer.open = true;
    await nextMicrotask();
    keydown(drawer.shadowRoot.querySelector(".panel"), "Escape");
    await nextMicrotask();

    expect(drawer.open).to.equal(false);
    expect(detail).to.deep.equal({ open: false });
    expect(document.activeElement).to.equal(trigger);
  });

  it("traps Tab focus and restores containment while open", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);

    const drawer = document.createElement("rowan-drawer");
    const action = document.createElement("button");
    action.textContent = "Save";
    drawer.append(action);
    document.body.append(drawer);
    await nextMicrotask();

    drawer.open = true;
    await nextMicrotask();

    action.focus();
    keydown(action, "Tab");
    await nextMicrotask();

    const closeButton = drawer.shadowRoot.querySelector(".close");
    expect(drawer.shadowRoot.activeElement).to.equal(closeButton);

    outside.focus();
    await nextMicrotask();
    expect(drawer.shadowRoot.activeElement).to.equal(closeButton);
  });

  it("keeps parent-driven closing silent", async () => {
    const drawer = document.createElement("rowan-drawer");
    document.body.append(drawer);
    await nextMicrotask();

    let changeCount = 0;
    drawer.addEventListener("rowan-change", () => {
      changeCount += 1;
    });

    drawer.open = true;
    await nextMicrotask();
    drawer.open = false;
    await nextMicrotask();

    expect(changeCount).to.equal(0);
  });
});
