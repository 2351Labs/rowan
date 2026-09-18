import { expect } from "@esm-bundle/chai";
import "./image.js";

const nextMicrotask = () => Promise.resolve();

async function renderImage(options = {}) {
  const el = document.createElement("rowan-image");
  if (options.src !== undefined) el.src = options.src;
  if (options.alt !== undefined) el.alt = options.alt;
  if (options.href !== undefined) el.href = options.href;
  if (options.fit) el.fit = options.fit;
  if (options.caption) {
    const caption = document.createElement("span");
    caption.slot = "caption";
    caption.textContent = options.caption;
    el.append(caption);
  }
  if (options.overlay) {
    const overlay = document.createElement("button");
    overlay.slot = "overlay";
    overlay.type = "button";
    overlay.textContent = options.overlay;
    el.append(overlay);
  }
  document.body.append(el);
  await nextMicrotask();
  await nextMicrotask();
  return el;
}

describe("rowan-image", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders src and alt, and keeps overlay outside the optional link", async () => {
    const el = await renderImage({
      src: "photo.jpg",
      alt: "Dispatch map",
      href: "https://example.test/map",
      overlay: "Flag",
      caption: "North yard",
    });

    const image = el.shadowRoot.querySelector("img.image");
    const link = el.shadowRoot.querySelector("a.media");
    expect(image.getAttribute("src")).to.equal("photo.jpg");
    expect(image.getAttribute("alt")).to.equal("Dispatch map");
    expect(link.getAttribute("href")).to.equal("https://example.test/map");
    expect(link.getAttribute("rel")).to.equal("noreferrer noopener");
    expect(link.contains(el.shadowRoot.querySelector(".overlay"))).to.equal(false);
    expect(el.shadowRoot.querySelector(".caption").hidden).to.equal(false);
    expect(el.querySelector('[slot="caption"]').textContent).to.equal("North yard");
    expect(el.querySelector('[slot="overlay"]').textContent).to.equal("Flag");
  });

  it("does not wrap javascript hrefs and shows fallback after an image error", async () => {
    const el = await renderImage({
      src: "missing.jpg",
      alt: "Evidence",
      href: "javascript:alert(1)",
    });

    expect(el.shadowRoot.querySelector("a.media")).to.equal(null);
    const image = el.shadowRoot.querySelector("img.image");
    image.dispatchEvent(new Event("error"));
    await nextMicrotask();

    expect(image.hidden).to.equal(true);
    expect(el.shadowRoot.querySelector(".fallback").hidden).to.equal(false);
    expect(el.shadowRoot.querySelector(".frame").classList.contains("is-error")).to.equal(true);
  });
});
