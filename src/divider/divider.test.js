import { expect } from "@esm-bundle/chai";
import "./divider.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-divider", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects orientation", async () => {
    const el = document.createElement("rowan-divider");
    document.body.append(el);
    await nextMicrotask();

    el.orientation = "vertical";
    await nextMicrotask();

    expect(el.getAttribute("orientation")).to.equal("vertical");
    expect(el.internals.role).to.equal("separator");
    expect(el.internals.ariaOrientation).to.equal("vertical");
  });
});
