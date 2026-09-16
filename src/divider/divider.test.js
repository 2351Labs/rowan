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

    el.setAttribute("orientation", " VERTICAL ");
    expect(el.orientation).to.equal("vertical");
    expect(el.getAttribute("orientation")).to.equal("vertical");
  });

  it("normalizes unsupported orientation property values to horizontal", async () => {
    const el = document.createElement("rowan-divider");
    el.orientation = "diagonal";
    document.body.append(el);
    await nextMicrotask();

    expect(el.orientation).to.equal("horizontal");
    expect(el.hasAttribute("orientation")).to.equal(false);
    expect(el.internals.ariaOrientation).to.equal("horizontal");

    el.setAttribute("orientation", "diagonal");
    expect(el.orientation).to.equal("horizontal");
    expect(el.hasAttribute("orientation")).to.equal(false);
  });

  it("uses horizontal separator semantics by default", async () => {
    const el = document.createElement("rowan-divider");
    document.body.append(el);
    await nextMicrotask();

    expect(el.orientation).to.equal("horizontal");
    expect(el.hasAttribute("orientation")).to.equal(false);
    expect(el.internals.role).to.equal("separator");
    expect(el.internals.ariaOrientation).to.equal("horizontal");
    expect(el.shadowRoot.querySelector(".divider").getAttribute("part")).to.equal("divider");
  });

  it("preserves an author-provided ARIA orientation", async () => {
    const el = document.createElement("rowan-divider");
    el.setAttribute("aria-orientation", "vertical");
    document.body.append(el);
    await nextMicrotask();

    expect(el.getAttribute("aria-orientation")).to.equal("vertical");
    expect(el.internals.ariaOrientation).to.equal(null);
  });
});
