import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Circular user avatar with image fallback.
 * @tag rowan-avatar
 * @attr {string} name
 * @attr {string} src
 * @attr {string} alt
 * @attr {"sm"|"md"|"lg"} size
 * @csspart avatar
 * @csspart image
 * @csspart initials
 */
export class RowanAvatar extends BaseElement {
  static styleUrl = new URL("./avatar.css", import.meta.url).href;
  static observedAttributes = ["name", "src", "alt", "size"];
  static upgradeProperties = ["name", "src", "alt", "size"];

  #image = null;
  #initials = null;

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

  get size() {
    return this.readString("size", "md");
  }

  set size(value) {
    this.reflectString("size", value === "md" ? null : value);
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
        this.#image.hidden = true;
        this.#initials.hidden = false;
      });
    }

    const initials = this.#initialsFromName(this.name);
    const src = this.src.trim();
    const altText = this.alt.trim() || this.name.trim() || "Avatar";

    this.#initials.textContent = initials;
    this.#image.alt = altText;

    if (src.length > 0) {
      this.#image.hidden = false;
      this.#image.src = src;
      this.#initials.hidden = true;
    } else {
      this.#image.removeAttribute("src");
      this.#image.hidden = true;
      this.#initials.hidden = false;
    }
  }

  #initialsFromName(name) {
    const trimmed = String(name || "").trim();
    if (trimmed.length === 0) return "?";

    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
}

define("rowan-avatar", RowanAvatar);
