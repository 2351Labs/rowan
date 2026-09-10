import { expect } from "@esm-bundle/chai";
import "./breadcrumb.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-breadcrumb", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders nav wrapper", async () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    document.body.append(breadcrumb);
    await nextMicrotask();

    expect(breadcrumb.shadowRoot.querySelector("nav")).to.exist;
  });
});
