import { expect } from "@esm-bundle/chai";
import "./dropzone.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-dropzone", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects accept and multiple attributes", async () => {
    const element = document.createElement("rowan-dropzone");
    document.body.append(element);
    await nextMicrotask();

    element.accept = ".csv,.xlsx";
    element.multiple = true;
    await nextMicrotask();

    expect(element.getAttribute("accept")).to.equal(".csv,.xlsx");
    expect(element.hasAttribute("multiple")).to.equal(true);

    const input = element.shadowRoot.querySelector('input[type="file"]');
    expect(input.accept).to.equal(".csv,.xlsx");
    expect(input.multiple).to.equal(true);
  });

  it("emits rowan-files-add when picker selection changes", async () => {
    const element = document.createElement("rowan-dropzone");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      eventCount += 1;
      detail = event.detail;
    });

    const input = element.shadowRoot.querySelector('input[type="file"]');
    const file = new File(["alpha"], "alpha.csv", { type: "text/csv" });
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [file],
    });

    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
    expect(detail.files).to.have.length(1);
    expect(detail.files[0].name).to.equal("alpha.csv");
    expect(detail.source).to.equal("picker");
  });

  it("toggles drag-active attribute on dragenter and dragleave", async () => {
    const element = document.createElement("rowan-dropzone");
    document.body.append(element);
    await nextMicrotask();

    const surface = element.shadowRoot.querySelector('[data-part="surface"]');
    surface.dispatchEvent(new DragEvent("dragenter", { bubbles: true, cancelable: true }));
    expect(element.hasAttribute("drag-active")).to.equal(true);

    surface.dispatchEvent(new DragEvent("dragleave", { bubbles: true, cancelable: true }));
    expect(element.hasAttribute("drag-active")).to.equal(false);
  });

  it("emits only the first dropped file when multiple is disabled", async () => {
    const element = document.createElement("rowan-dropzone");
    document.body.append(element);
    await nextMicrotask();

    const first = new File(["first"], "first.csv", { type: "text/csv" });
    const second = new File(["second"], "second.csv", { type: "text/csv" });
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      detail = event.detail;
    });

    const event = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [first, second] },
    });
    element.shadowRoot.querySelector('[data-part="surface"]').dispatchEvent(event);

    expect(detail.files).to.deep.equal([first]);
    expect(detail.source).to.equal("drop");
  });

  it("filters dropped files against accept", async () => {
    const element = document.createElement("rowan-dropzone");
    element.accept = ".csv,.pdf";
    document.body.append(element);
    await nextMicrotask();

    const csv = new File(["sheet"], "report.csv", { type: "text/csv" });
    const exe = new File(["binary"], "setup.exe", { type: "application/x-msdownload" });
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      detail = event.detail;
    });

    const event = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [exe, csv] },
    });
    element.shadowRoot.querySelector('[data-part="surface"]').dispatchEvent(event);

    expect(detail.files).to.deep.equal([csv]);
    expect(detail.rejected).to.deep.equal([exe]);
    expect(detail.source).to.equal("drop");
  });

  it("does not add a dropped file that fails accept", async () => {
    const element = document.createElement("rowan-dropzone");
    element.accept = ".csv";
    document.body.append(element);
    await nextMicrotask();

    const exe = new File(["binary"], "setup.exe", { type: "application/x-msdownload" });
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      detail = event.detail;
    });

    const event = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [exe] },
    });
    element.shadowRoot.querySelector('[data-part="surface"]').dispatchEvent(event);

    expect(detail.files).to.deep.equal([]);
    expect(detail.rejected).to.deep.equal([exe]);
  });

  it("matches accept wildcards and MIME types", async () => {
    const element = document.createElement("rowan-dropzone");
    element.accept = "image/*,text/csv";
    element.multiple = true;
    document.body.append(element);
    await nextMicrotask();

    const png = new File(["img"], "photo.png", { type: "image/png" });
    const csv = new File(["sheet"], "report.csv", { type: "text/csv" });
    const txt = new File(["note"], "note.txt", { type: "text/plain" });
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      detail = event.detail;
    });

    const event = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [png, csv, txt] },
    });
    element.shadowRoot.querySelector('[data-part="surface"]').dispatchEvent(event);

    expect(detail.files).to.deep.equal([png, csv]);
    expect(detail.rejected).to.deep.equal([txt]);
  });

  it("filters picker files against accept", async () => {
    const element = document.createElement("rowan-dropzone");
    element.accept = ".csv";
    document.body.append(element);
    await nextMicrotask();

    const csv = new File(["sheet"], "report.csv", { type: "text/csv" });
    const exe = new File(["binary"], "setup.exe", { type: "application/x-msdownload" });
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      detail = event.detail;
    });

    const input = element.shadowRoot.querySelector('input[type="file"]');
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [exe, csv],
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(detail.files).to.deep.equal([csv]);
    expect(detail.rejected).to.deep.equal([exe]);
    expect(detail.source).to.equal("picker");
  });

  it("does not emit rowan-files-add when disabled", async () => {
    const element = document.createElement("rowan-dropzone");
    element.disabled = true;
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-files-add", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="file"]');
    const file = new File(["beta"], "beta.csv", { type: "text/csv" });
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [file],
    });

    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(0);
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-dropzone");
    element.label = "Upload files";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("button");
    expect(element.internals.ariaLabel).to.equal("Upload files");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});
