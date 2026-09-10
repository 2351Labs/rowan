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