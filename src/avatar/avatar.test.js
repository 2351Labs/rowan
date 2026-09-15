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

  it("retains initials after an image failure during unrelated renders", async () => {
    const el = document.createElement("rowan-avatar");
    el.name = "Ada Lovelace";
    el.src = "missing-avatar.png";
    document.body.append(el);
    await nextMicrotask();

    const image = el.shadowRoot.querySelector(".image");
    const initials = el.shadowRoot.querySelector(".initials");
    image.dispatchEvent(new Event("error"));

    expect(image.hidden).to.equal(true);
    expect(initials.hidden).to.equal(false);

    el.alt = "Portrait of Ada Lovelace";
    el.size = "lg";
    await nextMicrotask();

    expect(image.hidden).to.equal(true);
    expect(initials.hidden).to.equal(false);
    expect(initials.textContent.trim()).to.equal("AL");
    expect(getComputedStyle(image).display).to.equal("none");
  });
});
