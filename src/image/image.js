import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { sanitizeNavigationHref } from "../lib/url.js";

const FITS = new Set(["cover", "contain"]);
const LOADINGS = new Set(["lazy", "eager"]);

/**
 * Image display. Overlay and caption are slots. Optional href is a
 * real link around the image, not around overlay actions.
 * @tag rowan-image
 * @attr {string} src
 * @attr {string} alt
 * @attr {string} href
 * @attr {"cover"|"contain"} fit
 * @attr {"lazy"|"eager"} loading
 * @slot overlay - Actions and badges on top of the image. Not inside the link.
 * @slot caption
 * @slot fallback - Shown when src is missing or the image fails.
 * @csspart control
 * @csspart frame
 * @csspart image
 * @csspart overlay
 * @csspart caption
 * @csspart fallback
 * @cssprop --rowan-image-bg
 * @cssprop --rowan-image-fg
 * @cssprop --rowan-image-radius
 * @cssprop --rowan-image-aspect
 */
export class RowanImage extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./image.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-image-"];
  static observedAttributes = ["src", "alt", "href", "fit", "loading"];
  static upgradeProperties = ["src", "alt", "href", "fit", "loading"];

  #figure = null;
  #frame = null;
  #media = null;
  #image = null;
  #overlay = null;
  #fallback = null;
  #caption = null;
  #captionSlot = null;
  #renderedSrc = null;
  #failedSrc = null;
  #loadedSrc = null;

  get src() {
    return this.readString("src", "");
  }

  set src(value) {
    this.reflectString("src", value);
  }

  get alt() {
    return this.readString("alt", "");
  }

  set alt(value) {
    this.reflectString("alt", value);
  }

  get href() {
    return this.readString("href", "");
  }

  set href(value) {
    this.reflectString("href", value);
  }

  /** @returns {"cover" | "contain"} */
  get fit() {
    return normalizeEnum(this.readString("fit", "cover"), FITS, "cover");
  }

  /** @param {"cover" | "contain"} value */
  set fit(value) {
    reflectEnum(this, "fit", value, FITS, "cover");
  }

  /** @returns {"lazy" | "eager"} */
  get loading() {
    return normalizeEnum(this.readString("loading", "lazy"), LOADINGS, "lazy");
  }

  /** @param {"lazy" | "eager"} value */
  set loading(value) {
    reflectEnum(this, "loading", value, LOADINGS, "lazy");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "fit" && rewriteEnumAttribute(this, name, newValue, FITS, "cover")) {
      return;
    }

    if (name === "loading" && rewriteEnumAttribute(this, name, newValue, LOADINGS, "lazy")) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#figure) {
      this.renderRoot.innerHTML = `
        <figure class="control" part="control">
          <div class="frame" part="frame">
            <div class="media"></div>
            <div class="overlay" part="overlay"><slot name="overlay"></slot></div>
            <div class="fallback" part="fallback"><slot name="fallback"></slot></div>
          </div>
          <figcaption class="caption" part="caption"><slot name="caption"></slot></figcaption>
        </figure>
      `;

      this.#figure = this.renderRoot.querySelector(".control");
      this.#frame = this.renderRoot.querySelector(".frame");
      this.#media = this.renderRoot.querySelector(".media");
      this.#overlay = this.renderRoot.querySelector(".overlay");
      this.#fallback = this.renderRoot.querySelector(".fallback");
      this.#caption = this.renderRoot.querySelector(".caption");
      this.#captionSlot = this.renderRoot.querySelector('slot[name="caption"]');
      this.listen(this.#captionSlot, "slotchange", () => this.#syncCaption());
      this.#ensureImage();
    }

    this.#syncImage();
    this.#syncMedia();
    this.#syncCaption();
    this.#applyDefaultA11y();
  }

  #safeHref() {
    const href = sanitizeNavigationHref(this.href, "");
    return href === "#" ? "" : href;
  }

  #linkHref() {
    const src = this.src.trim();
    if (!src || this.#failedSrc === src) return "";
    return this.#safeHref();
  }

  #ensureImage() {
    if (this.#image) return;

    const image = document.createElement("img");
    image.className = "image";
    image.setAttribute("part", "image");
    this.listen(image, "load", () => this.#handleLoad());
    this.listen(image, "error", () => this.#handleError());
    this.#media.append(image);
    this.#image = image;
  }

  #syncMedia() {
    const href = this.#linkHref();
    const wantAnchor = Boolean(href);
    const isAnchor = this.#media.tagName === "A";

    if (wantAnchor === isAnchor) {
      if (wantAnchor) {
        this.#media.setAttribute("href", href);
        this.#media.setAttribute("rel", "noreferrer noopener");
      } else {
        this.#media.removeAttribute("href");
        this.#media.removeAttribute("rel");
      }
      return;
    }

    const next = document.createElement(wantAnchor ? "a" : "div");
    next.className = "media";
    if (wantAnchor) {
      next.setAttribute("href", href);
      next.setAttribute("rel", "noreferrer noopener");
    }
    next.append(this.#image);
    this.#media.replaceWith(next);
    this.#media = next;
  }

  #syncImage() {
    const src = this.src.trim();
    const alt = this.alt;
    this.#image.alt = alt;
    this.#image.loading = this.loading;
    this.#frame.style.setProperty("--image-fit", this.fit);

    if (src !== this.#renderedSrc) {
      this.#renderedSrc = src;
      this.#failedSrc = null;
      this.#loadedSrc = null;
    }

    const failed = Boolean(src) && this.#failedSrc === src;
    const loaded = Boolean(src) && this.#loadedSrc === src;
    const ready = loaded && !failed;
    const showFallback = !src || failed;

    if (src && !failed) {
      if (this.#image.getAttribute("src") !== src) this.#image.src = src;
      this.#image.hidden = false;
    } else {
      this.#image.removeAttribute("src");
      this.#image.hidden = true;
    }

    this.#fallback.hidden = !showFallback;
    this.#frame.classList.toggle("is-loading", Boolean(src) && !ready && !failed);
    this.#frame.classList.toggle("is-ready", ready);
    this.#frame.classList.toggle("is-error", failed);
  }

  #syncCaption() {
    const hasCaption = this.#captionSlot.assignedNodes().some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return true;
    });
    this.#caption.hidden = !hasCaption;
  }

  #handleLoad() {
    const src = this.#image.getAttribute("src");
    if (!src || src !== this.#renderedSrc) return;
    this.#loadedSrc = src;
    this.#failedSrc = null;
    this.requestRender();
  }

  #handleError() {
    const src = this.#image.getAttribute("src") || this.#renderedSrc;
    if (src !== this.#renderedSrc) return;
    this.#failedSrc = src;
    this.#loadedSrc = null;
    this.requestRender();
  }

  #applyDefaultA11y() {
    if (!this.internals) return;
    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }
  }
}

define("rowan-image", RowanImage);
