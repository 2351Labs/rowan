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
});
