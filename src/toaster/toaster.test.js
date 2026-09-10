import { expect } from "@esm-bundle/chai";
import "./toaster.js";

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
});