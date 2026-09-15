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
    const native = innerDialog.shadowRoot.querySelector("dialog");
    native.dispatchEvent(new Event("cancel", { cancelable: true }));
    await wait();

    expect(dialog.open).to.equal(false);
    expect(reason).to.equal("escape");
  });

  it("keeps the default action controls inside the composed modal dialog", async () => {
    const dialog = document.createElement("rowan-confirm-dialog");
    dialog.open = true;
    document.body.append(dialog);
    await waitForNestedRender();

    const innerDialog = dialog.shadowRoot.querySelector("rowan-dialog");
    const native = innerDialog.shadowRoot.querySelector("dialog");
    const confirmButton = dialog.shadowRoot.querySelector(".confirm");

    // Tab containment is the native modal's job; assert the modal contract instead.
    expect(native.open).to.equal(true);
    expect(native.matches(":modal")).to.equal(true);
    expect(native.contains(innerDialog.shadowRoot.querySelector(".panel"))).to.equal(true);
    expect(confirmButton.closest("rowan-dialog")).to.equal(innerDialog);
  });
});
