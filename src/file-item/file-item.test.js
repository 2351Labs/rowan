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
});