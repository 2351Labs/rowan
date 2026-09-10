import { expect } from "@esm-bundle/chai";
import "./skeleton.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-skeleton", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("applies width and shape attributes", async () => {
    const el = document.createElement("rowan-skeleton");
    el.shape = "circle";
    el.width = "2rem";

    document.body.append(el);
    await nextMicrotask();

    const skeleton = el.shadowRoot.querySelector(".skeleton");
    expect(el.getAttribute("shape")).to.equal("circle");
    expect(skeleton.style.width).to.equal("2rem");
  });
});
