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
});
