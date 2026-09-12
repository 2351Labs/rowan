import { expect } from "@esm-bundle/chai";
import "./confirm-dialog.js";

const wait = () => Promise.resolve();
const waitForNestedRender = async () => {
  await wait();
  await wait();
};

describe("rowan-confirm-dialog", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects open and delegates its modal state to rowan-dialog", async () => {
    const dialog = document.createElement("rowan-confirm-dialog");
    document.body.append(dialog);
    await wait();

    dialog.open = true;
    await wait();

    expect(dialog.hasAttribute("open")).to.equal(true);
    expect(dialog.shadowRoot.querySelector("rowan-dialog").open).to.equal(true);

    dialog.removeAttribute("open");
    await wait();

    expect(dialog.open).to.equal(false);
    expect(dialog.shadowRoot.querySelector("rowan-dialog").open).to.equal(false);
  });

  it("emits a composed confirmation event only for the default confirm control", async () => {
    const parent = document.createElement("div");
    const dialog = document.createElement("rowan-confirm-dialog");
    dialog.open = true;
    parent.append(dialog);
    document.body.append(parent);
    await wait();

    let detail = null;
    parent.addEventListener("rowan-confirm", (event) => {
      detail = event.detail;
    });

    dialog.shadowRoot
      .querySelector(".confirm")
      .dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await wait();

    expect(dialog.open).to.equal(false);
    expect(detail).to.deep.equal({ reason: "confirm-button" });
  });

  it("keeps parent-driven closing silent", async () => {
    const dialog = document.createElement("rowan-confirm-dialog");
    dialog.open = true;
    document.body.append(dialog);
    await wait();

    let eventCount = 0;
    dialog.addEventListener("rowan-confirm", () => {
      eventCount += 1;
    });
    dialog.addEventListener("rowan-cancel", () => {
      eventCount += 1;
    });
    dialog.addEventListener("rowan-close", () => {
      eventCount += 1;
    });

    dialog.open = false;
    await wait();

    expect(eventCount).to.equal(0);
  });

  it("forwards passive dialog dismissal through its own close event", async () => {
    const dialog = document.createElement("rowan-confirm-dialog");
    dialog.open = true;
    document.body.append(dialog);
    await waitForNestedRender();

    let reason = "";
    dialog.addEventListener("rowan-close", (event) => {
      reason = event.detail.reason;
    });

    const innerDialog = dialog.shadowRoot.querySelector("rowan-dialog");
    const panel = innerDialog.shadowRoot.querySelector(".panel");
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait();

    expect(dialog.open).to.equal(false);
    expect(reason).to.equal("escape");
  });

  it("keeps the default action controls inside the composed dialog focus trap", async () => {
    const dialog = document.createElement("rowan-confirm-dialog");
    dialog.open = true;
    document.body.append(dialog);
    await waitForNestedRender();

    const innerDialog = dialog.shadowRoot.querySelector("rowan-dialog");
    const confirmButton = dialog.shadowRoot.querySelector(".confirm");
    const closeButton = innerDialog.shadowRoot.querySelector('button[part="close"]');

    confirmButton.focus();
    confirmButton.shadowRoot
      .querySelector("button")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, composed: true }));
    await wait();

    expect(innerDialog.shadowRoot.activeElement).to.equal(closeButton);
  });
});
