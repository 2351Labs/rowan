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
    expect(el.internals.ariaValueNow).to.equal("10");
  });
});
