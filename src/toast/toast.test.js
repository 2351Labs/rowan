import { expect } from "@esm-bundle/chai";
import "./toast.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-toast", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects tone between property and attribute", async () => {
    const toast = document.createElement("rowan-toast");
    document.body.append(toast);
    await nextMicrotask();

    toast.tone = "warning";
    expect(toast.getAttribute("tone")).to.equal("warning");

    toast.setAttribute("tone", "danger");
    expect(toast.tone).to.equal("danger");
  });

  it("emits rowan-dismiss and hides on close button click", async () => {
    const toast = document.createElement("rowan-toast");
    toast.setAttribute("dismissible", "");
    toast.textContent = "Sync complete.";
    document.body.append(toast);
    await nextMicrotask();

    let dismissCount = 0;
    toast.addEventListener("rowan-dismiss", () => {
      dismissCount += 1;
    });

    const closeButton = toast.shadowRoot.querySelector('button[part="close"]');
    closeButton.click();

    expect(dismissCount).to.equal(1);
    expect(toast.hidden).to.equal(true);
  });

  it("does not emit rowan-dismiss when parent toggles hidden", async () => {
    const toast = document.createElement("rowan-toast");
    toast.setAttribute("dismissible", "");
    toast.textContent = "Background sync complete.";
    document.body.append(toast);
    await nextMicrotask();

    let dismissCount = 0;
    toast.addEventListener("rowan-dismiss", () => {
      dismissCount += 1;
    });

    toast.hidden = true;
    await nextMicrotask();

    expect(dismissCount).to.equal(0);
  });
});