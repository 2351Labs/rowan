import { expect } from "@esm-bundle/chai";
import "./tab-panel.js";
import "../tab/tab.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-tab-panel", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hides when not active", async () => {
    const panel = document.createElement("rowan-tab-panel");
    document.body.append(panel);
    await nextMicrotask();

    expect(panel.shadowRoot.querySelector(".panel").hidden).to.equal(true);
    expect(panel.inert).to.equal(true);
    expect(panel.internals.ariaHidden).to.equal("true");
  });

  it("exposes its controlling tab through ElementInternals", async () => {
    const tab = document.createElement("rowan-tab");
    const panel = document.createElement("rowan-tab-panel");
    document.body.append(tab, panel);
    await nextMicrotask();

    panel.setTab(tab, {});
    await nextMicrotask();

    expect(panel.internals.role).to.equal("tabpanel");
    if ("ariaLabelledByElements" in panel.internals) {
      expect(Array.from(panel.internals.ariaLabelledByElements)).to.deep.equal([tab]);
    }
  });

  it("releases component-owned inertness while active and restores it while hidden", async () => {
    const panel = document.createElement("rowan-tab-panel");
    document.body.append(panel);
    await nextMicrotask();

    panel.active = true;
    await nextMicrotask();
    expect(panel.shadowRoot.querySelector(".panel").hidden).to.equal(false);
    expect(panel.inert).to.equal(false);
    expect(panel.internals.ariaHidden).to.equal("false");

    panel.active = false;
    await nextMicrotask();
    expect(panel.shadowRoot.querySelector(".panel").hidden).to.equal(true);
    expect(panel.inert).to.equal(true);
    expect(panel.internals.ariaHidden).to.equal("true");
  });

  it("preserves author-provided inertness while the panel is active", async () => {
    const panel = document.createElement("rowan-tab-panel");
    panel.active = true;
    panel.inert = true;
    document.body.append(panel);
    await nextMicrotask();

    expect(panel.shadowRoot.querySelector(".panel").hidden).to.equal(false);
    expect(panel.inert).to.equal(true);
    expect(panel.internals.ariaHidden).to.equal("false");
  });
});
