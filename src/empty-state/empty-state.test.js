import { expect } from "@esm-bundle/chai";
import "./empty-state.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-empty-state", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders container and slots", async () => {
    const el = document.createElement("rowan-empty-state");
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".container")).to.not.equal(null);
    expect(el.shadowRoot.querySelector("slot[name='title']")).to.not.equal(null);
  });
});
