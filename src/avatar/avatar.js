import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { resolveLocale, upperCaseForLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const SIZES = new Set(["sm", "md", "lg"]);
const DEFAULT_MESSAGES = Object.freeze({ avatar: "Avatar" });

function normalizeSize(value) {
  const size = String(value ?? "")
    .trim()
    .toLowerCase();
  return SIZES.has(size) ? size : "md";
}

/**
 * @typedef {object} RowanAvatarMessages
 * @property {string} [avatar]
 */

/**
 * Circular user avatar with image fallback.
 * @tag rowan-avatar
 * @attr {string} name
 * @attr {string} src
 * @attr {string} alt
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} locale
 * @property {RowanAvatarMessages} messages - Property-only built-in message overrides.
 * @csspart avatar
 * @csspart image
 * @csspart initials
 */
export class RowanAvatar extends BaseElement {
  static styleUrl = new URL("./avatar.css", import.meta.url).href;
  static observedAttributes = ["name", "src", "alt", "size", "locale"];
  static upgradeProperties = ["name", "src", "alt", "size", "locale", "messages"];

  #image = null;
  #initials = null;
  #renderedSrc = null;
  #failedSrc = null;
  #messages = {};

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

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

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeSize(this.readString("size", "md"));
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    const next = normalizeSize(value);
    this.reflectString("size", next === "md" ? null : next);
  }

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanAvatarMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanAvatarMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "size") {
      const size = normalizeSize(newValue);
      const attributeValue = size === "md" ? null : size;
      if (newValue !== attributeValue) {
        this.reflectString("size", attributeValue);
        return;
      }
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#image) {
      this.renderRoot.innerHTML = `
        <span class="avatar" part="avatar">
          <img class="image" part="image" alt="" />
          <span class="initials" part="initials"></span>
        </span>
      `;

      this.#image = this.renderRoot.querySelector("img");
      this.#initials = this.renderRoot.querySelector(".initials");

      this.listen(this.#image, "error", () => {
        this.#failedSrc = this.#renderedSrc;
        this.#image.hidden = true;
        this.#initials.hidden = false;
      });
    }

    const initials = this.#initialsFromName(this.name);
    const src = this.src.trim();
    const altText =
      this.alt.trim() ||
      this.name.trim() ||
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "avatar");

    if (src !== this.#renderedSrc) {
      this.#renderedSrc = src;
      this.#failedSrc = null;
    }

    this.#initials.textContent = initials;
    this.#image.alt = altText;

    if (src.length > 0 && this.#failedSrc !== src) {
      this.#image.hidden = false;
      if (this.#image.getAttribute("src") !== src) this.#image.src = src;
      this.#initials.hidden = true;
    } else {
      if (src.length === 0) this.#image.removeAttribute("src");
      this.#image.hidden = true;
      this.#initials.hidden = false;
    }
  }

  #initialsFromName(name) {
    const trimmed = String(name || "").trim();
    if (trimmed.length === 0) return "?";

    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return upperCaseForLocale(parts[0].slice(0, 2), this.locale);
    }

    return upperCaseForLocale(`${parts[0][0]}${parts[1][0]}`, this.locale);
  }
}

define("rowan-avatar", RowanAvatar);
