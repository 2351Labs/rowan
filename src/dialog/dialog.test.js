import { expect } from "@esm-bundle/chai";
import "./dialog.js";

const wait = () => Promise.resolve();

async function waitForStyleLink(shadowRoot) {
  const link = shadowRoot.querySelector('link[rel="stylesheet"]');
  if (!link) return;

  if (link.sheet) return;

  await new Promise((resolve) => {
    const onLoad = () => {
      link.removeEventListener("load", onLoad);
      link.removeEventListener("error", onLoad);
      resolve();
    };

    link.addEventListener("load", onLoad, { once: true });
    link.addEventListener("error", onLoad, { once: true });
  });
}

describe("rowan-dialog", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects open between property and attribute", async () => {
    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();

    dialog.open = true;
    expect(dialog.hasAttribute("open")).to.equal(true);

    dialog.removeAttribute("open");
    expect(dialog.open).to.equal(false);
  });

  it("closes on Escape and returns focus", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.append(trigger);
    trigger.focus();

    const dialog = document.createElement("rowan-dialog");
    dialog.innerHTML = '<button slot="actions">Action</button>';
    document.body.append(dialog);
    await wait();

    let closeReason = "";
    dialog.addEventListener("rowan-close", (event) => {
      closeReason = event.detail.reason;
    });

    dialog.open = true;
    await wait();

    const panel = dialog.shadowRoot.querySelector(".panel");
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait();

    expect(dialog.open).to.equal(false);
    expect(closeReason).to.equal("escape");
    expect(document.activeElement).to.equal(trigger);
  });

  it("does not emit rowan-close when parent sets open false", async () => {
    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();

    let closeCount = 0;
    dialog.addEventListener("rowan-close", () => {
      closeCount += 1;
    });

    dialog.open = true;
    await wait();
    dialog.open = false;
    await wait();

    expect(closeCount).to.equal(0);
  });

  it("hides the overlay when closed", async () => {
    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();
    await waitForStyleLink(dialog.shadowRoot);

    dialog.open = true;
    await wait();

    const overlay = dialog.shadowRoot.querySelector(".overlay");
    expect(overlay).to.not.equal(null);
    expect(overlay.hidden).to.equal(false);

    dialog.open = false;
    await wait();

    expect(overlay.hidden).to.equal(true);
    expect(getComputedStyle(overlay).display).to.equal("none");
  });

  it("traps Tab focus within the panel", async () => {
    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();

    dialog.open = true;
    await wait();

    const panel = dialog.shadowRoot.querySelector(".panel");
    const closeButton = dialog.shadowRoot.querySelector('button[part="close"]');

    closeButton.focus();
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await wait();

    expect(dialog.shadowRoot.activeElement).to.equal(closeButton);
  });

  it("restores controls and focus containment after reconnecting while open", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);

    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();

    dialog.open = true;
    await wait();

    dialog.remove();
    await wait();
    document.body.append(dialog);
    await wait();

    outside.focus();
    await wait();

    const closeButton = dialog.shadowRoot.querySelector('button[part="close"]');
    expect(dialog.shadowRoot.activeElement).to.equal(closeButton);

    const panel = dialog.shadowRoot.querySelector(".panel");
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait();

    expect(dialog.open).to.equal(false);
  });
});
