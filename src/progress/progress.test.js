import { expect } from "@esm-bundle/chai";
import "./progress.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-progress", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("clamps value to max", async () => {
    const el = document.createElement("rowan-progress");
    el.max = 10;
    el.value = 25;

    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("progressbar");
    expect(el.internals.ariaLabel).to.equal("Progress");
    expect(el.internals.ariaValueNow).to.equal("10");
  });

  it("provides a default accessible name without overriding author labels", async () => {
    const el = document.createElement("rowan-progress");
    el.label = "Storage quota";
    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.ariaLabel).to.equal("Storage quota");

    el.setAttribute("aria-label", "Workspace storage");
    await nextMicrotask();

    expect(el.getAttribute("aria-label")).to.equal("Workspace storage");
  });

  it("clamps lower values while keeping visual and accessible progress in sync", async () => {
    const el = document.createElement("rowan-progress");
    el.max = 0;
    el.value = -25;
    el.label = "Upload";
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".bar").style.width).to.equal("0%");
    expect(el.shadowRoot.querySelector(".meta").textContent).to.equal("Upload 0%");
    expect(el.internals.ariaValueMin).to.equal("0");
    expect(el.internals.ariaValueMax).to.equal("100");
    expect(el.internals.ariaValueNow).to.equal("0");
    expect(el.internals.ariaValueText).to.equal("Upload 0%");
  });

  it("hides the percent caption when hide-meta is set and keeps the progressbar name", async () => {
    const el = document.createElement("rowan-progress");
    el.label = "Quota";
    el.value = 42;
    el.hideMeta = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".meta").hidden).to.equal(true);
    expect(el.internals.role).to.equal("progressbar");
    expect(el.internals.ariaLabel).to.equal("Quota");
    expect(el.internals.ariaValueText).to.equal("Quota 42%");
  });

  it("does not supply a competing label when the author provides aria-labelledby", async () => {
    const el = document.createElement("rowan-progress");
    el.label = "Upload";
    el.setAttribute("aria-labelledby", "upload-heading");
    document.body.append(el);
    await nextMicrotask();

    expect(el.getAttribute("aria-labelledby")).to.equal("upload-heading");
    expect(el.internals.ariaLabel).to.equal(null);
  });
});
