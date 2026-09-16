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

  it("blocks parser-normalized JavaScript URLs", async () => {
    const el = document.createElement("rowan-link");
    el.href = "java\nscript:void(globalThis.__rowanLinkProbe = true)";
    document.body.append(el);
    await nextMicrotask();

    const anchor = el.shadowRoot.querySelector("a");
    expect(anchor.getAttribute("href")).to.equal("#");
    expect(new URL(anchor.href).protocol).to.not.equal("javascript:");
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

    const anchor = el.shadowRoot.querySelector("a");
    anchor.addEventListener("click", (event) => event.preventDefault());
    anchor.click();
    expect(count).to.equal(1);
  });

  it("hardens external links and suppresses disabled activation", async () => {
    const el = document.createElement("rowan-link");
    el.href = "/guides";
    el.external = true;
    document.body.append(el);
    await nextMicrotask();

    const anchor = el.shadowRoot.querySelector("a");
    expect(anchor.getAttribute("href")).to.equal("/guides");
    expect(anchor.target).to.equal("_blank");
    expect(anchor.rel).to.equal("noopener noreferrer");

    let eventCount = 0;
    el.addEventListener("rowan-click", () => {
      eventCount += 1;
    });
    el.disabled = true;
    await nextMicrotask();
    anchor.click();

    expect(anchor.getAttribute("aria-disabled")).to.equal("true");
    expect(anchor.tabIndex).to.equal(-1);
    expect(eventCount).to.equal(0);
  });
});
