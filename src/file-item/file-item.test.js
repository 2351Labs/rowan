import { expect } from "@esm-bundle/chai";
import "./file-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-file-item", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects filename and status attributes", async () => {
    const element = document.createElement("rowan-file-item");
    document.body.append(element);
    await nextMicrotask();

    element.filename = "invoice.pdf";
    element.status = "uploading";

    expect(element.getAttribute("filename")).to.equal("invoice.pdf");
    expect(element.getAttribute("status")).to.equal("uploading");

    element.setAttribute("filename", "quote.pdf");
    element.setAttribute("status", "failed");

    expect(element.filename).to.equal("quote.pdf");
    expect(element.status).to.equal("failed");
  });

  it("emits rowan-remove when remove action is clicked", async () => {
    const element = document.createElement("rowan-file-item");
    element.filename = "plan.csv";
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    let detail = null;
    element.addEventListener("rowan-remove", (event) => {
      eventCount += 1;
      detail = event.detail;
    });

    const removeButton = element.shadowRoot.querySelector('[data-action="remove"]');
    removeButton.click();

    expect(eventCount).to.equal(1);
    expect(detail.filename).to.equal("plan.csv");
  });

  it("emits rowan-retry only when status is failed", async () => {
    const element = document.createElement("rowan-file-item");
    element.filename = "import.csv";
    element.status = "failed";
    document.body.append(element);
    await nextMicrotask();

    let retryCount = 0;
    element.addEventListener("rowan-retry", () => {
      retryCount += 1;
    });

    const retryButton = element.shadowRoot.querySelector('[data-action="retry"]');
    retryButton.click();

    expect(retryCount).to.equal(1);

    element.status = "success";
    await nextMicrotask();

    const retryAfterSuccess = element.shadowRoot.querySelector('[data-action="retry"]');
    expect(retryAfterSuccess.hidden).to.equal(true);
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-file-item");
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("listitem");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();
    expect(element.internals.ariaDisabled).to.equal("true");
  });

  it("uses inherited locale and property-only messages for file metadata and actions", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const element = document.createElement("rowan-file-item");
    element.filename = "report.csv";
    element.filesize = 1536;
    element.status = "uploading";
    element.progress = 42;
    wrapper.append(element);
    document.body.append(wrapper);
    await nextMicrotask();

    const events = [];
    ["rowan-remove", "rowan-retry", "rowan-cancel"].forEach((type) => {
      element.addEventListener(type, () => events.push(type));
    });
    element.messages = {
      cancel: "Abbrechen",
      remove: "Entfernen",
      retry: "Erneut versuchen",
      statusUploading: "Wird hochgeladen",
      uploadProgress: "Fortschritt {progress}%",
    };
    await nextMicrotask();

    expect(element.getAttribute("messages")).to.equal(null);
    expect(element.locale).to.equal("de-DE");
    expect(element.shadowRoot.querySelector('[part="details"]').textContent).to.equal(
      `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(1.5)} KB`,
    );
    expect(element.shadowRoot.querySelector('[part="status"]').textContent).to.equal(
      "Wird hochgeladen",
    );
    expect(element.shadowRoot.querySelector('[data-action="cancel"]').textContent).to.equal(
      "Abbrechen",
    );
    expect(
      element.shadowRoot.querySelector('[part="progress"]').getAttribute("aria-label"),
    ).to.equal("Fortschritt 42%");
    expect(events).to.deep.equal([]);
  });
});
