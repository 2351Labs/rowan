import { expect } from "@esm-bundle/chai";
import "./avatar.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-avatar", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows initials when no src is provided", async () => {
    const el = document.createElement("rowan-avatar");
    el.name = "Ada Lovelace";
    document.body.append(el);
    await nextMicrotask();

    const initials = el.shadowRoot.querySelector(".initials").textContent.trim();
    expect(initials).to.equal("AL");
  });

  it("reflects size attribute", async () => {
    const el = document.createElement("rowan-avatar");
    document.body.append(el);
    await nextMicrotask();

    el.size = "lg";
    expect(el.getAttribute("size")).to.equal("lg");
  });
});
