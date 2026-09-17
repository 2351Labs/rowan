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

  it("normalizes unsupported tone to the documented default", async () => {
    const toast = document.createElement("rowan-toast");
    toast.tone = "loud";
    document.body.append(toast);
    await nextMicrotask();

    expect(toast.tone).to.equal("info");
    expect(toast.hasAttribute("tone")).to.equal(false);

    toast.setAttribute("tone", " SUCCESS ");
    expect(toast.tone).to.equal("success");
    expect(toast.getAttribute("tone")).to.equal("success");
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

  it("reveals optional title and actions content and announces danger tones assertively", async () => {
    const toast = document.createElement("rowan-toast");
    toast.tone = "danger";
    const title = document.createElement("strong");
    title.slot = "title";
    title.textContent = "Upload failed";
    const action = document.createElement("button");
    action.slot = "actions";
    action.textContent = "Retry";
    toast.append(title, action);
    document.body.append(toast);
    await nextMicrotask();
    await nextMicrotask();

    const titleRegion = toast.shadowRoot.querySelector(".title");
    const actionsRegion = toast.shadowRoot.querySelector(".actions");
    expect(titleRegion.hidden).to.equal(false);
    expect(actionsRegion.hidden).to.equal(false);
    expect(toast.internals.role).to.equal("alert");
    expect(toast.internals.ariaLive).to.equal("assertive");

    title.remove();
    action.remove();
    await nextMicrotask();
    await nextMicrotask();

    expect(titleRegion.hidden).to.equal(true);
    expect(actionsRegion.hidden).to.equal(true);
  });
});
