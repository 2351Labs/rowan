import { expect } from "@esm-bundle/chai";
import "./chip.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-chip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects tone and size", async () => {
    const el = document.createElement("rowan-chip");
    document.body.append(el);
    await nextMicrotask();

    el.tone = "warning";
    el.size = "lg";

    expect(el.getAttribute("tone")).to.equal("warning");
    expect(el.getAttribute("size")).to.equal("lg");
  });
});
