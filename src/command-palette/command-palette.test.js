import { expect } from "@esm-bundle/chai";
import "./command-palette.js";

const nextMicrotask = () => Promise.resolve();

function createCommand({ value, label, description = "", keywords = "", disabled = false }) {
  const item = document.createElement("rowan-command-item");
  item.value = value;
  item.description = description;
  item.keywords = keywords;
  item.disabled = disabled;
  item.label = label;
  return item;
}

async function renderPalette({ open = false, hotkey = "" } = {}) {
  const palette = document.createElement("rowan-command-palette");
  palette.open = open;
  palette.hotkey = hotkey;
  palette.append(
    createCommand({
      value: "open-settings",
      label: "Open settings",
      description: "Update workspace preferences",
      keywords: "workspace account",
    }),
    createCommand({ value: "invite-member", label: "Invite member", keywords: "team people" }),
    createCommand({ value: "delete-workspace", label: "Delete workspace", disabled: true }),
  );
  document.body.append(palette);
  await nextMicrotask();
  await nextMicrotask();
  return palette;
}

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-command-palette", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects open state and keeps parent-driven closing silent", async () => {
    const palette = await renderPalette();
    let closeCount = 0;
    palette.addEventListener("rowan-close", () => {
      closeCount += 1;
    });

    palette.show();
    await nextMicrotask();
    expect(palette.open).to.equal(true);
    expect(palette.shadowRoot.querySelector(".overlay").hidden).to.equal(false);

    palette.hide();
    await nextMicrotask();
    expect(palette.open).to.equal(false);
    expect(closeCount).to.equal(0);
  });

  it("filters command items from labels, descriptions, and keywords", async () => {
    const palette = await renderPalette({ open: true });
    const input = palette.shadowRoot.querySelector("input");
    const [settings, invite, remove] = palette.querySelectorAll("rowan-command-item");

    input.value = "preferences";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(palette.query).to.equal("preferences");
    expect(settings.hasAttribute("data-rowan-command-hidden")).to.equal(false);
    expect(invite.hasAttribute("data-rowan-command-hidden")).to.equal(true);
    expect(remove.hasAttribute("data-rowan-command-hidden")).to.equal(true);
  });

  it("preserves author-hidden command items while filtering", async () => {
    const palette = await renderPalette({ open: true });
    const input = palette.shadowRoot.querySelector("input");
    const hiddenItem = palette.querySelector("rowan-command-item:last-child");
    hiddenItem.hidden = true;
    await nextMicrotask();

    input.value = "delete";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(hiddenItem.hidden).to.equal(true);
    expect(hiddenItem.hasAttribute("data-rowan-command-hidden")).to.equal(true);

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(hiddenItem.hidden).to.equal(true);
  });

  it("updates filtered results when an item label changes", async () => {
    const palette = await renderPalette({ open: true });
    const input = palette.shadowRoot.querySelector("input");
    const settings = palette.querySelector("rowan-command-item");

    input.value = "billing";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(settings.hasAttribute("data-rowan-command-hidden")).to.equal(true);

    settings.label = "Open billing settings";
    await nextMicrotask();
    await nextMicrotask();

    expect(settings.hasAttribute("data-rowan-command-hidden")).to.equal(false);
  });

  it("navigates matching enabled commands and emits a composed command event", async () => {
    const palette = await renderPalette({ open: true });
    const input = palette.shadowRoot.querySelector("input");
    const [settings, invite] = palette.querySelectorAll("rowan-command-item");
    let detail = null;
    let eventMeta = null;

    palette.addEventListener("rowan-command", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    keydown(input, "ArrowDown");
    expect(settings.hasAttribute("data-rowan-command-active")).to.equal(false);
    expect(invite.hasAttribute("data-rowan-command-active")).to.equal(true);

    keydown(input, "Home");
    expect(settings.hasAttribute("data-rowan-command-active")).to.equal(true);

    keydown(input, "End");
    expect(invite.hasAttribute("data-rowan-command-active")).to.equal(true);

    keydown(input, "Enter");
    await nextMicrotask();

    expect(detail).to.include({ value: "invite-member", query: "" });
    expect(detail.item).to.equal(invite);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
    expect(palette.open).to.equal(false);
  });

  it("opens from an opted-in hotkey and returns focus after Escape", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open commands";
    document.body.append(trigger);
    trigger.focus();

    const palette = await renderPalette({ hotkey: "alt+q" });
    let closeReason = "";
    palette.addEventListener("rowan-close", (event) => {
      closeReason = event.detail.reason;
    });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { altKey: true, bubbles: true, cancelable: true, key: "q" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    expect(palette.open).to.equal(true);
    expect(palette.shadowRoot.activeElement).to.equal(palette.shadowRoot.querySelector("input"));

    keydown(palette.shadowRoot.querySelector(".panel"), "Escape");
    await nextMicrotask();

    expect(palette.open).to.equal(false);
    expect(closeReason).to.equal("escape");
    expect(document.activeElement).to.equal(trigger);
  });

  it("emits a user close event when the backdrop is activated", async () => {
    const palette = await renderPalette({ open: true });
    let closeReason = "";

    palette.addEventListener("rowan-close", (event) => {
      closeReason = event.detail.reason;
    });

    palette.shadowRoot.querySelector(".backdrop").click();
    await nextMicrotask();

    expect(palette.open).to.equal(false);
    expect(closeReason).to.equal("backdrop");
  });

  it("traps Tab focus inside the palette panel", async () => {
    const palette = await renderPalette({ open: true });
    const input = palette.shadowRoot.querySelector("input");
    const panel = palette.shadowRoot.querySelector(".panel");
    const close = palette.shadowRoot.querySelector(".close");

    input.focus();
    keydown(panel, "Tab");
    await nextMicrotask();

    expect(palette.shadowRoot.activeElement).to.equal(close);
  });

  it("restores focus containment and a single activation listener after reconnecting", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);

    const palette = await renderPalette({ open: true });
    const item = palette.querySelector("rowan-command-item");
    let eventCount = 0;

    palette.addEventListener("rowan-command", () => {
      eventCount += 1;
    });

    palette.remove();
    document.body.append(palette);
    await nextMicrotask();
    await nextMicrotask();

    outside.focus();
    await nextMicrotask();

    expect(palette.shadowRoot.activeElement).to.equal(palette.shadowRoot.querySelector("input"));

    item.shadowRoot.querySelector("button").click();
    expect(eventCount).to.equal(1);
  });

  it("preserves author-provided host semantics", async () => {
    const palette = document.createElement("rowan-command-palette");
    palette.setAttribute("role", "region");
    palette.setAttribute("aria-label", "Workspace command center");
    palette.append(createCommand({ value: "open-settings", label: "Open settings" }));
    document.body.append(palette);
    await nextMicrotask();

    expect(palette.getAttribute("role")).to.equal("region");
    expect(palette.getAttribute("aria-label")).to.equal("Workspace command center");
  });
});
