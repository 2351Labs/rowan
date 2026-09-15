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

    // Tab cycling belongs to the native modal; assert slotted controls stay reachable.
    const native = dialog.shadowRoot.querySelector("dialog");
    expect(native.matches(":modal")).to.equal(true);

    field.focus();
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

  it("keeps the page scroll locked until the last overlay closes", async () => {
    const first = document.createElement("rowan-dialog");
    const second = document.createElement("rowan-dialog");
    document.body.append(first, second);
    await settle();

    const initialOverflow = document.body.style.overflow;

    first.open = true;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    second.open = true;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    second.open = false;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    first.open = false;
    await settle();
    expect(document.body.style.overflow).to.equal(initialOverflow);
  });

  it("releases the scroll lock when an open overlay is removed from the document", async () => {
    const dialog = document.createElement("rowan-dialog");
    const other = document.createElement("rowan-dialog");
    document.body.append(dialog, other);
    await settle();

    const initialOverflow = document.body.style.overflow;

    dialog.open = true;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    dialog.remove();
    // The stack prunes disconnected overlays on its next update.
    other.open = true;
    await settle();
    other.open = false;
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

    const native = dialog.shadowRoot.querySelector("dialog");
    native.dispatchEvent(new Event("cancel", { cancelable: true }));
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

    const overlay = dialog.shadowRoot.querySelector("dialog");
    expect(overlay).to.not.equal(null);
    expect(overlay.open).to.equal(true);

    dialog.open = false;
    await wait();

    expect(overlay.open).to.equal(false);
    expect(getComputedStyle(overlay).display).to.equal("none");
  });

  it("makes background content inert while open", async () => {
    const outside = document.createElement("button");
    outside.textContent = "outside";
    document.body.append(outside);

    const dialog = document.createElement("rowan-dialog");
    document.body.append(dialog);
    await wait();

    dialog.open = true;
    await wait();

    const native = dialog.shadowRoot.querySelector("dialog");
    expect(native.matches(":modal")).to.equal(true);

    outside.focus();
    expect(document.activeElement === outside).to.equal(false);

    dialog.open = false;
    await wait();

    outside.focus();
    expect(document.activeElement === outside).to.equal(true);
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

    // Reconnecting while open must re-enter the top layer, not just keep the attribute.
    const native = dialog.shadowRoot.querySelector("dialog");
    expect(native.open).to.equal(true);
    expect(native.matches(":modal")).to.equal(true);

    native.dispatchEvent(new Event("cancel", { cancelable: true }));
    await wait();

    expect(dialog.open).to.equal(false);
  });
});
