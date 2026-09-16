import { expect } from "@esm-bundle/chai";
import "./accordion.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-accordion", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects open attribute to panel visibility", async () => {
    const el = document.createElement("rowan-accordion");
    el.open = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
  });

  it("toggles its disclosure state and emits a composed change event from the trigger", async () => {
    const el = document.createElement("rowan-accordion");
    document.body.append(el);
    await nextMicrotask();

    const events = [];
    document.addEventListener("rowan-change", (event) => events.push(event), {
      once: true,
    });

    el.shadowRoot.querySelector(".trigger").click();
    await nextMicrotask();

    expect(el.open).to.equal(true);
    expect(el.shadowRoot.querySelector(".trigger").getAttribute("aria-expanded")).to.equal("true");
    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
    expect(events).to.have.length(1);
    expect(events[0].detail).to.deep.equal({ open: true });
    expect(events[0].bubbles).to.equal(true);
    expect(events[0].composed).to.equal(true);
  });

  it("uses the summary attribute until a named summary slot is supplied", async () => {
    const el = document.createElement("rowan-accordion");
    el.summary = "Shipping details";
    document.body.append(el);
    await nextMicrotask();

    const fallback = el.shadowRoot.querySelector(".fallback-summary");
    expect(fallback.textContent).to.equal("Shipping details");
    expect(fallback.hidden).to.equal(false);

    const summary = document.createElement("span");
    summary.slot = "summary";
    summary.textContent = "Delivery";
    el.append(summary);
    el.requestRender();
    await nextMicrotask();

    expect(fallback.hidden).to.equal(true);
  });

  it("keeps parent-driven open state changes silent while synchronizing disclosure semantics", async () => {
    const el = document.createElement("rowan-accordion");
    document.body.append(el);
    await nextMicrotask();

    let changeCount = 0;
    el.addEventListener("rowan-change", () => {
      changeCount += 1;
    });
    el.open = true;
    await nextMicrotask();

    expect(el.getAttribute("open")).to.equal("");
    expect(el.shadowRoot.querySelector(".trigger").getAttribute("aria-expanded")).to.equal("true");
    expect(el.shadowRoot.querySelector(".panel").hidden).to.equal(false);
    expect(changeCount).to.equal(0);
  });
});
