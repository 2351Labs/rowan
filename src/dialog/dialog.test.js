import { expect } from "@esm-bundle/chai";
import "./dialog.js";
import "../text-field/text-field.js";
import "../button/button.js";

const wait = () => Promise.resolve();

const settle = async () => {
  await wait();
  await wait();
  await wait();
};

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

describe("rowan-dialog focus containment", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("includes slotted Rowan form controls in the focus cycle", async () => {
    const dialog = document.createElement("rowan-dialog");
    const field = document.createElement("rowan-text-field");
    field.label = "Email";
    dialog.append(field);
    document.body.append(dialog);
    await settle();

    dialog.open = true;
    await settle();
    await settle();

    const close = dialog.shadowRoot.querySelector(".close");
    const panel = dialog.shadowRoot.querySelector(".panel");
    close.focus();

    // The close button is first, so Shift+Tab wraps to the last focusable.
    // The old tag allowlist did not recognise rowan-text-field, so it wrapped to itself.
    panel.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await settle();

    expect(document.activeElement).to.equal(field);
  });

  it("lets only the topmost dialog recapture focus", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";

    const first = document.createElement("rowan-dialog");
    const firstButton = document.createElement("rowan-button");
    firstButton.textContent = "First";
    first.append(firstButton);

    const second = document.createElement("rowan-dialog");
    const secondButton = document.createElement("rowan-button");
    secondButton.textContent = "Second";
    second.append(secondButton);

    document.body.append(outside, first, second);
    await settle();

    first.open = true;
    await settle();
    await settle();

    second.open = true;
    await settle();
    await settle();

    expect(second.contains(document.activeElement)).to.equal(true);
    expect(first.contains(document.activeElement)).to.equal(false);
  });

  it("locks and restores document scroll around the open state", async () => {
    const dialog = document.createElement("rowan-dialog");
    const button = document.createElement("rowan-button");
    button.textContent = "Close";
    dialog.append(button);
    document.body.append(dialog);
    await settle();

    const initialOverflow = document.body.style.overflow;

    dialog.open = true;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    dialog.open = false;
    await settle();
    expect(document.body.style.overflow).to.equal(initialOverflow);
  });
});

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

  it("keeps closed dialogs out of modal semantics and names open dialogs", async () => {
    const dialog = document.createElement("rowan-dialog");
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Edit profile";
    dialog.append(title);
    document.body.append(dialog);
    await wait();

    expect(dialog.inert).to.equal(true);
    expect(dialog.internals.role).to.equal(null);
    expect(dialog.internals.ariaHidden).to.equal("true");

    dialog.open = true;
    await wait();

    const panel = dialog.shadowRoot.querySelector(".panel");
    expect(dialog.inert).to.equal(false);
    expect(dialog.internals.role).to.equal("dialog");
    expect(dialog.internals.ariaModal).to.equal("true");
    expect(dialog.internals.ariaHidden).to.equal("false");
    expect(dialog.internals.ariaLabel).to.equal("Edit profile");
    expect(panel.getAttribute("role")).to.equal("dialog");
    expect(panel.getAttribute("aria-modal")).to.equal("true");
    expect(panel.getAttribute("aria-label")).to.equal("Edit profile");
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
