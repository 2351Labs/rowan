import { expect } from "@esm-bundle/chai";
import "./link.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-link", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders safe href", async () => {
    const el = document.createElement("rowan-link");
    el.href = "javascript:alert(1)";
    document.body.append(el);
    await nextMicrotask();

    const anchor = el.shadowRoot.querySelector("a");
    expect(anchor.getAttribute("href")).to.equal("#");
  });

  it("emits rowan-click when activated", async () => {
    const el = document.createElement("rowan-link");
    el.href = "/paths";
    document.body.append(el);
    await nextMicrotask();

    let count = 0;
    el.addEventListener("rowan-click", () => {
      count += 1;
    });

    el.shadowRoot.querySelector("a").click();
    expect(count).to.equal(1);
  });
});
