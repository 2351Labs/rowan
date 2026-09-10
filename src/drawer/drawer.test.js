import { expect } from "@esm-bundle/chai";
import "./drawer.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-drawer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hides backdrop when closed", async () => {
    const drawer = document.createElement("rowan-drawer");
    document.body.append(drawer);
    await nextMicrotask();

    const backdrop = drawer.shadowRoot.querySelector(".backdrop");
    expect(backdrop.hidden).to.equal(true);
  });
});
