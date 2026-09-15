import { expect } from "@esm-bundle/chai";
import { collectFocusableElements, isFocusable } from "./focus.js";
import "../text-field/text-field.js";
import "../button/button.js";

const nextMicrotask = () => Promise.resolve();

describe("focus utilities", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("detects Rowan controls through delegated focus rather than a tag list", async () => {
    const field = document.createElement("rowan-text-field");
    const button = document.createElement("rowan-button");
    document.body.append(field, button);
    await nextMicrotask();

    expect(isFocusable(field)).to.equal(true);
    expect(isFocusable(button)).to.equal(true);
  });

  it("skips disabled, inert, and negative-tabindex elements", async () => {
    const disabled = document.createElement("rowan-text-field");
    disabled.disabled = true;
    const negative = document.createElement("div");
    negative.tabIndex = -1;
    const inertParent = document.createElement("div");
    inertParent.setAttribute("inert", "");
    const inertChild = document.createElement("button");
    inertParent.append(inertChild);

    document.body.append(disabled, negative, inertParent);
    await nextMicrotask();

    expect(isFocusable(disabled)).to.equal(false);
    expect(isFocusable(negative)).to.equal(false);
    expect(isFocusable(inertChild)).to.equal(false);
  });

  it("collects slotted focusables in document order", async () => {
    const host = document.createElement("div");
    const nativeButton = document.createElement("button");
    const field = document.createElement("rowan-text-field");
    host.append(nativeButton, field);
    document.body.append(host);
    await nextMicrotask();

    expect(collectFocusableElements(host)).to.deep.equal([nativeButton, field]);
  });

  it("can exclude slotted children for arrow-navigated collections", async () => {
    const host = document.createElement("div");
    host.attachShadow({ mode: "open" });
    host.shadowRoot.innerHTML = `<div class="panel"><button class="chrome"></button><slot></slot></div>`;
    const slotted = document.createElement("button");
    host.append(slotted);
    document.body.append(host);
    await nextMicrotask();

    const panel = host.shadowRoot.querySelector(".panel");
    const chrome = host.shadowRoot.querySelector(".chrome");

    expect(collectFocusableElements(panel)).to.deep.equal([chrome, slotted]);
    expect(collectFocusableElements(panel, { includeSlotted: false })).to.deep.equal([chrome]);
  });
});
