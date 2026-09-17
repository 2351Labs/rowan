import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Labeled group of destinations inside rowan-side-nav.
 * @tag rowan-side-nav-section
 * @attr {string} label
 * @slot - rowan-side-nav-item children
 * @csspart section
 * @csspart label
 * @cssprop --rowan-side-nav-section-gap
 * @cssprop --rowan-side-nav-section-label-fg
 * @cssprop --rowan-side-nav-section-label-font-size
 * @cssprop --rowan-side-nav-section-label-padding
 */
export class RowanSideNavSection extends BaseElement {
  static styleUrl = new URL("./side-nav-section.css", import.meta.url).href;
  static useElementInternals = true;
  static componentTokenPrefixes = ["--rowan-side-nav-section-"];
  static observedAttributes = ["label"];
  static upgradeProperties = ["label"];

  #section = null;
  #heading = null;
  #headingId = `rowan-side-nav-section-${Math.random().toString(36).slice(2, 10)}`;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  render() {
    if (!this.#section) {
      this.renderRoot.innerHTML = `
        <div class="section" part="section">
          <p class="label" part="label"></p>
          <div class="items"><slot></slot></div>
        </div>
      `;
      this.#section = this.renderRoot.querySelector(".section");
      this.#heading = this.renderRoot.querySelector(".label");
      this.#heading.id = this.#headingId;
    }

    const label = this.label.trim();
    this.#heading.textContent = label;
    this.#heading.hidden = !label;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (this.internals && !this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = label || null;
    }

    if (this.internals && "ariaLabelledByElements" in this.internals) {
      this.internals.ariaLabelledByElements =
        !this.hasAttribute("aria-labelledby") && !this.hasAttribute("aria-label") && label
          ? [this.#heading]
          : [];
    }
  }
}

define("rowan-side-nav-section", RowanSideNavSection);
