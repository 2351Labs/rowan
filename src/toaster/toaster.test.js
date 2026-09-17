import { expect } from "@esm-bundle/chai";
import "./toaster.js";
import "../dialog/dialog.js";

const nextMicrotask = () => Promise.resolve();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("rowan-toaster", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects and normalizes placement, max-visible, and duration", async () => {
    const toaster = document.createElement("rowan-toaster");
    document.body.append(toaster);
    await nextMicrotask();

    expect(toaster.placement).to.equal("top-end");
    expect(toaster.getAttribute("placement")).to.equal(null);

    toaster.placement = "bottom-center";
    expect(toaster.getAttribute("placement")).to.equal("bottom-center");
    expect(toaster.placement).to.equal("bottom-center");

    toaster.setAttribute("placement", "not-a-placement");
    expect(toaster.placement).to.equal("top-end");
    expect(toaster.hasAttribute("placement")).to.equal(false);

    toaster.setAttribute("placement", " BOTTOM-START ");
    expect(toaster.placement).to.equal("bottom-start");
    expect(toaster.getAttribute("placement")).to.equal("bottom-start");

    toaster.maxVisible = 4;
    expect(toaster.getAttribute("max-visible")).to.equal("4");
    toaster.setAttribute("max-visible", "0");
    expect(toaster.maxVisible).to.equal(1);

    toaster.duration = 1800;
    expect(toaster.getAttribute("duration")).to.equal("1800");
    toaster.setAttribute("duration", "-25");
    expect(toaster.duration).to.equal(0);
  });

  it("shows a toast and emits rowan-toast-show", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    document.body.append(toaster);
    await nextMicrotask();

    let eventDetail = null;
    toaster.addEventListener("rowan-toast-show", (event) => {
      eventDetail = event.detail;
    });

    const id = toaster.show({
      tone: "success",
      title: "Saved",
      message: "Workspace settings were saved.",
    });

    await nextMicrotask();

    const renderedToast = toaster.shadowRoot.querySelector("rowan-toast");

    expect(typeof id).to.equal("string");
    expect(renderedToast).to.not.equal(null);
    expect(eventDetail.id).to.equal(id);
    expect(eventDetail.tone).to.equal("success");
  });

  it("rejects incomplete inputs and reports dismissal status", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    document.body.append(toaster);
    await nextMicrotask();

    expect(toaster.show({ title: "Missing message" })).to.equal(null);

    const id = toaster.show("Workspace settings were saved.");
    expect(typeof id).to.equal("string");
    expect(toaster.dismiss("missing")).to.equal(false);
    expect(toaster.dismiss(id)).to.equal(true);
  });

  it("does not emit events when parent sets configuration properties", async () => {
    const toaster = document.createElement("rowan-toaster");
    document.body.append(toaster);
    await nextMicrotask();

    let eventCount = 0;
    toaster.addEventListener("rowan-toast-show", () => {
      eventCount += 1;
    });
    toaster.addEventListener("rowan-toast-dismiss", () => {
      eventCount += 1;
    });

    toaster.maxVisible = 1;
    toaster.duration = 1500;
    toaster.placement = "bottom-center";

    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("auto dismisses active toasts when duration elapses", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 20;
    document.body.append(toaster);
    await nextMicrotask();

    let dismissDetail = null;
    toaster.addEventListener("rowan-toast-dismiss", (event) => {
      dismissDetail = event.detail;
    });

    const id = toaster.show("Changes synced.");
    await wait(80);

    expect(dismissDetail.id).to.equal(id);
    expect(dismissDetail.reason).to.equal("timeout");
    expect(toaster.shadowRoot.querySelector("rowan-toast")).to.equal(null);
  });

  it("emits rowan-toast-dismiss when user closes a dismissible toast", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    document.body.append(toaster);
    await nextMicrotask();

    let dismissDetail = null;
    toaster.addEventListener("rowan-toast-dismiss", (event) => {
      dismissDetail = event.detail;
    });

    toaster.show({
      message: "Policy updated.",
      dismissible: true,
    });
    await nextMicrotask();

    const toast = toaster.shadowRoot.querySelector("rowan-toast");
    const closeButton = toast.shadowRoot.querySelector('button[part="close"]');
    closeButton.click();
    await nextMicrotask();

    expect(dismissDetail.reason).to.equal("dismiss-button");
  });

  it("queues toasts beyond max-visible and shows them after dismissal", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    toaster.maxVisible = 1;
    document.body.append(toaster);
    await nextMicrotask();

    const shownIds = [];
    toaster.addEventListener("rowan-toast-show", (event) => {
      shownIds.push(event.detail.id);
    });

    const firstId = toaster.show("First toast");
    const secondId = toaster.show("Second toast");
    await nextMicrotask();

    let renderedToasts = toaster.shadowRoot.querySelectorAll("rowan-toast");
    expect(renderedToasts.length).to.equal(1);
    expect(renderedToasts[0].textContent.includes("First toast")).to.equal(true);
    expect(shownIds).to.deep.equal([firstId]);

    toaster.dismiss(firstId);
    await nextMicrotask();

    renderedToasts = toaster.shadowRoot.querySelectorAll("rowan-toast");
    expect(renderedToasts.length).to.equal(1);
    expect(renderedToasts[0].textContent.includes("Second toast")).to.equal(true);
    expect(shownIds).to.deep.equal([firstId, secondId]);
  });

  it("preserves active toast nodes and focus as the queue changes", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    toaster.maxVisible = 2;
    document.body.append(toaster);
    await nextMicrotask();

    const firstId = toaster.show({ id: "first", message: "First toast", dismissible: true });
    await nextMicrotask();

    const firstToast = toaster.shadowRoot.querySelector(`[data-toast-id="${firstId}"]`);
    const firstClose = firstToast.shadowRoot.querySelector('[part="close"]');
    firstClose.focus();

    const secondId = toaster.show({ id: "second", message: "Second toast" });
    await nextMicrotask();

    expect(toaster.shadowRoot.querySelector(`[data-toast-id="${firstId}"]`)).to.equal(firstToast);
    expect(firstToast.shadowRoot.activeElement).to.equal(firstClose);
    expect(
      [...toaster.shadowRoot.querySelectorAll("rowan-toast")].map((toast) => toast.dataset.toastId),
    ).to.deep.equal([firstId, secondId]);
  });

  it("enforces a changed visibility cap without replacing retained toasts", async () => {
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    toaster.maxVisible = 3;
    document.body.append(toaster);
    await nextMicrotask();

    const ids = [
      toaster.show({ id: "first", message: "First toast", dismissible: true }),
      toaster.show({ id: "second", message: "Second toast" }),
      toaster.show({ id: "third", message: "Third toast" }),
    ];
    await nextMicrotask();

    const firstToast = toaster.shadowRoot.querySelector(`[data-toast-id="${ids[0]}"]`);
    const firstClose = firstToast.shadowRoot.querySelector('[part="close"]');
    firstClose.focus();

    const events = [];
    toaster.addEventListener("rowan-toast-show", (event) => events.push(event.detail));
    toaster.addEventListener("rowan-toast-dismiss", (event) => events.push(event.detail));

    toaster.maxVisible = 1;
    await nextMicrotask();

    expect(toaster.shadowRoot.querySelectorAll("rowan-toast")).to.have.length(1);
    expect(toaster.shadowRoot.querySelector(`[data-toast-id="${ids[0]}"]`)).to.equal(firstToast);
    expect(firstToast.shadowRoot.activeElement).to.equal(firstClose);
    expect(events).to.deep.equal([]);

    toaster.maxVisible = 3;
    await nextMicrotask();

    expect(
      [...toaster.shadowRoot.querySelectorAll("rowan-toast")].map((toast) => toast.dataset.toastId),
    ).to.deep.equal(ids);
    expect(events).to.deep.equal([]);
  });

  it("defers toasts while a modal dialog is open and shows them after it closes", async () => {
    const dialog = document.createElement("rowan-dialog");
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    document.body.append(dialog, toaster);
    await nextMicrotask();
    await nextMicrotask();

    dialog.open = true;
    await nextMicrotask();
    await nextMicrotask();

    const shownIds = [];
    toaster.addEventListener("rowan-toast-show", (event) => {
      shownIds.push(event.detail.id);
    });

    const id = toaster.show({ message: "Saved", dismissible: true });
    await nextMicrotask();
    await nextMicrotask();

    expect(id).to.be.a("string");
    expect(toaster.shadowRoot.querySelector("rowan-toast")).to.equal(null);
    expect(shownIds).to.deep.equal([]);
    expect(dialog.open).to.equal(true);

    dialog.open = false;
    await nextMicrotask();
    await nextMicrotask();

    const toast = toaster.shadowRoot.querySelector("rowan-toast");
    expect(toast).to.not.equal(null);
    expect(toast.textContent.includes("Saved")).to.equal(true);
    expect(shownIds).to.deep.equal([id]);
    expect(toaster.matches(":popover-open")).to.equal(true);
  });

  it("parks visible toasts when a modal opens and restores them after close", async () => {
    const dialog = document.createElement("rowan-dialog");
    const toaster = document.createElement("rowan-toaster");
    toaster.duration = 0;
    document.body.append(dialog, toaster);
    await nextMicrotask();

    const id = toaster.show({ message: "Still visible", dismissible: true });
    await nextMicrotask();
    expect(toaster.shadowRoot.querySelector("rowan-toast")).to.not.equal(null);

    dialog.open = true;
    await nextMicrotask();
    await nextMicrotask();

    expect(toaster.shadowRoot.querySelector("rowan-toast")).to.equal(null);
    expect(dialog.open).to.equal(true);

    dialog.open = false;
    await nextMicrotask();
    await nextMicrotask();

    const toast = toaster.shadowRoot.querySelector(`[data-toast-id="${id}"]`);
    expect(toast).to.not.equal(null);
    expect(toast.textContent.includes("Still visible")).to.equal(true);
  });
});
