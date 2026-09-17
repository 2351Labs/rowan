import { expect } from "@esm-bundle/chai";

import "./side-nav-section.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-side-nav-section", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a labeled group without becoming a nested navigation landmark", async () => {
    const section = document.createElement("rowan-side-nav-section");
    section.label = "Invexus";
    document.body.append(section);
    await nextMicrotask();

    expect(section.internals.role).to.equal("group");
    expect(section.shadowRoot.querySelector("nav")).to.equal(null);
    expect(section.shadowRoot.querySelector(".label").textContent).to.equal("Invexus");
    expect(section.shadowRoot.querySelector(".label").hidden).to.equal(false);
    if ("ariaLabelledByElements" in section.internals) {
      expect(Array.from(section.internals.ariaLabelledByElements)).to.deep.equal([
        section.shadowRoot.querySelector(".label"),
      ]);
    }
  });
});
