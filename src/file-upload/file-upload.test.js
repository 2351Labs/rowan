import { expect } from "@esm-bundle/chai";
import "./file-upload.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-file-upload", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("adds queued files from rowan-files-add events", async () => {
    const element = document.createElement("rowan-file-upload");
    document.body.append(element);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["alpha"], "alpha.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA],
          source: "picker",
        },
      }),
    );
    await nextMicrotask();

    expect(element.files).to.have.length(1);
    expect(element.files[0].name).to.equal("alpha.csv");
    expect(element.files[0].status).to.equal("queued");

    const renderedItems = element.shadowRoot.querySelectorAll("rowan-file-item");
    expect(renderedItems.length).to.equal(1);
  });

  it("emits rowan-files-add with normalized files", async () => {
    const element = document.createElement("rowan-file-upload");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      eventCount += 1;
      detail = event.detail;
    });

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["bravo"], "bravo.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA],
          source: "drop",
        },
      }),
    );
    await nextMicrotask();

    expect(eventCount).to.equal(1);
    expect(detail.files).to.have.length(1);
    expect(detail.files[0].status).to.equal("queued");
    expect(detail.source).to.equal("drop");
  });

  it("supports remove and retry events from file items", async () => {
    const element = document.createElement("rowan-file-upload");
    element.files = [
      {
        id: "f-1",
        name: "retry.csv",
        size: 10,
        status: "failed",
      },
      {
        id: "f-2",
        name: "queued.csv",
        size: 20,
        status: "queued",
      },
    ];
    document.body.append(element);
    await nextMicrotask();

    let retryCount = 0;
    let removeCount = 0;

    element.addEventListener("rowan-file-retry", () => {
      retryCount += 1;
    });

    element.addEventListener("rowan-file-remove", () => {
      removeCount += 1;
    });

    const failedItem = element.shadowRoot.querySelector('rowan-file-item[data-file-id="f-1"]');
    failedItem.dispatchEvent(
      new CustomEvent("rowan-retry", {
        bubbles: true,
        composed: true,
      }),
    );

    const queuedItem = element.shadowRoot.querySelector('rowan-file-item[data-file-id="f-2"]');
    queuedItem.dispatchEvent(
      new CustomEvent("rowan-remove", {
        bubbles: true,
        composed: true,
      }),
    );
    await nextMicrotask();

    expect(retryCount).to.equal(1);
    expect(removeCount).to.equal(1);
    expect(element.files).to.have.length(1);
    expect(element.files[0].id).to.equal("f-1");
  });

  it("enforces max-files limit", async () => {
    const element = document.createElement("rowan-file-upload");
    element.maxFiles = 1;
    document.body.append(element);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["a"], "a.csv", { type: "text/csv" });
    const fileB = new File(["b"], "b.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA, fileB],
          source: "picker",
        },
      }),
    );
    await nextMicrotask();

    expect(element.files).to.have.length(1);
    expect(element.files[0].name).to.equal("a.csv");
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-file-upload");
    element.label = "Upload documents";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("group");
    expect(element.internals.ariaLabel).to.equal("Upload documents");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});