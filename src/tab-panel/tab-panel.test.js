import { expect } from "@esm-bundle/chai";
import "./tab-panel.js";

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
  });
});
