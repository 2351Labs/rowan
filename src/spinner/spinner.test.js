import { expect } from "@esm-bundle/chai";
import "./spinner.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-spinner", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders with label", async () => {
    const el = document.createElement("rowan-spinner");
    el.label = "Loading table";
    document.body.append(el);
    await nextMicrotask();

    const label = el.shadowRoot.querySelector(".sr-only").textContent;
    expect(label).to.equal("Loading table");
  });

  it("uses host status semantics", async () => {
    const el = document.createElement("rowan-spinner");
    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("status");
    expect(el.internals.ariaLive).to.equal("polite");
  });

  it("normalizes unsupported size property values to md", async () => {
    const el = document.createElement("rowan-spinner");
    el.size = "xl";
    document.body.append(el);
    await nextMicrotask();

    expect(el.size).to.equal("md");
    expect(el.hasAttribute("size")).to.equal(false);
  });

  it("canonicalizes supported size input and retains a fallback loading label", async () => {
    const el = document.createElement("rowan-spinner");
    el.setAttribute("size", " LG ");
    el.label = "";
    document.body.append(el);
    await nextMicrotask();

    expect(el.size).to.equal("lg");
    expect(el.getAttribute("size")).to.equal("lg");
    expect(el.shadowRoot.querySelector(".sr-only").textContent).to.equal("Loading");

    el.setAttribute("size", "xl");
    expect(el.size).to.equal("md");
    expect(el.hasAttribute("size")).to.equal(false);
  });
});
