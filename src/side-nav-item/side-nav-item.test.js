import { expect } from "@esm-bundle/chai";

import "./side-nav-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-side-nav-item", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a safe link with an active page indicator", async () => {
    const item = document.createElement("rowan-side-nav-item");
    item.href = "javascript:alert(1)";
    item.label = "Workspace";
    item.active = true;
    document.body.append(item);
    await nextMicrotask();

    const control = item.shadowRoot.querySelector("a");
    expect(control.getAttribute("href")).to.equal(null);
    expect(control.getAttribute("role")).to.equal("button");
    expect(control.getAttribute("aria-current")).to.equal("page");
    expect(control.getAttribute("aria-label")).to.equal("Workspace");
  });

  it("blocks parser-normalized JavaScript URLs", async () => {
    const item = document.createElement("rowan-side-nav-item");
    item.href = "java\nscript:void(globalThis.__rowanSideNavProbe = true)";
    document.body.append(item);
    await nextMicrotask();

    const control = item.shadowRoot.querySelector("a");
    expect(control.getAttribute("href")).to.equal(null);
    expect(control.getAttribute("role")).to.equal("button");
  });

  it("preserves an author tab index while standalone", async () => {
    const item = document.createElement("rowan-side-nav-item");
    item.tabIndex = -1;
    document.body.append(item);
    await nextMicrotask();

    expect(item.shadowRoot.querySelector("a").tabIndex).to.equal(-1);
  });

  it("hardens external links and suppresses disabled navigation", async () => {
    const item = document.createElement("rowan-side-nav-item");
    item.href = "/guides";
    item.external = true;
    document.body.append(item);
    await nextMicrotask();

    const control = item.shadowRoot.querySelector("a");
    expect(control.getAttribute("href")).to.equal("/guides");
    expect(control.target).to.equal("_blank");
    expect(control.rel).to.equal("noopener noreferrer");

    let clickCount = 0;
    item.addEventListener("click", () => {
      clickCount += 1;
    });
    item.disabled = true;
    await nextMicrotask();
    control.click();

    expect(control.getAttribute("aria-disabled")).to.equal("true");
    expect(control.tabIndex).to.equal(-1);
    expect(clickCount).to.equal(0);
  });
});
