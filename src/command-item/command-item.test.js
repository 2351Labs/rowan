import { expect } from "@esm-bundle/chai";
import "./command-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-command-item", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects primitive properties and renders command metadata", async () => {
    const item = document.createElement("rowan-command-item");
    item.value = "open-settings";
    item.label = "Open settings";
    item.description = "Update workspace preferences";
    item.keywords = "preferences account";
    item.group = "Workspace";
    item.shortcut = "G S";
    item.disabled = true;
    document.body.append(item);
    await nextMicrotask();

    const button = item.shadowRoot.querySelector("button");

    expect(item.getAttribute("value")).to.equal("open-settings");
    expect(item.getAttribute("label")).to.equal("Open settings");
    expect(item.getAttribute("description")).to.equal("Update workspace preferences");
    expect(item.searchText).to.include("preferences account");
    expect(item.searchText).to.include("Update workspace preferences");
    expect(button.disabled).to.equal(true);
    expect(item.shadowRoot.querySelector(".label").textContent.trim()).to.equal("Open settings");
    expect(item.shadowRoot.querySelector(".group").textContent).to.equal("Workspace");
    expect(item.shadowRoot.querySelector(".shortcut").textContent.trim()).to.equal("G S");
  });

  it("accepts and releases controller state without overwriting author tabindex", async () => {
    const item = document.createElement("rowan-command-item");
    const owner = {};
    item.tabIndex = 0;
    item.textContent = "Open settings";
    document.body.append(item);
    await nextMicrotask();

    const generatedId = item.setCommandPaletteState({ active: true, visible: false }, owner);
    await nextMicrotask();

    expect(item.hasAttribute("data-rowan-command-active")).to.equal(true);
    expect(item.hasAttribute("data-rowan-command-hidden")).to.equal(true);
    expect(item.shadowRoot.querySelector("button").tabIndex).to.equal(-1);
    expect(generatedId).to.equal(item.id);

    item.clearCommandPaletteState(owner);
    await nextMicrotask();

    expect(item.hasAttribute("data-rowan-command-active")).to.equal(false);
    expect(item.hasAttribute("data-rowan-command-hidden")).to.equal(false);
    expect(item.shadowRoot.querySelector("button").tabIndex).to.equal(0);
    expect(item.getAttribute("tabindex")).to.equal("0");
    expect(item.id).to.equal("");
  });

  it("does not let a former controller clear a newer controller state", async () => {
    const item = document.createElement("rowan-command-item");
    const firstOwner = {};
    const secondOwner = {};
    item.textContent = "Open settings";
    document.body.append(item);
    await nextMicrotask();

    item.setCommandPaletteState({ active: true }, firstOwner);
    item.setCommandPaletteState({ active: false, visible: false }, secondOwner);
    item.clearCommandPaletteState(firstOwner);
    await nextMicrotask();

    expect(item.hasAttribute("data-rowan-command-hidden")).to.equal(true);
    expect(item.hasAttribute("data-rowan-command-active")).to.equal(false);
  });

  it("preserves author-provided option semantics", async () => {
    const item = document.createElement("rowan-command-item");
    const owner = {};
    item.setAttribute("role", "menuitem");
    item.setAttribute("aria-selected", "false");
    item.textContent = "Open settings";
    document.body.append(item);
    await nextMicrotask();

    item.setCommandPaletteState({ active: true }, owner);
    await nextMicrotask();

    expect(item.getAttribute("role")).to.equal("menuitem");
    expect(item.getAttribute("aria-selected")).to.equal("false");
  });
});
