import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Text navigation link.
 * @tag rowan-link
 * @attr {string} href
 * @attr {string} target
 * @attr {boolean} external
 * @attr {boolean} disabled
 * @slot - Link text
 * @csspart link
 * @event rowan-click - Fired when activated (not when disabled)
 */
export class RowanLink extends BaseElement {
  static styleUrl = new URL("./link.css", import.meta.url).href;
  static observedAttributes = ["href", "target", "external", "disabled"];
  static upgradeProperties = ["href", "target", "external", "disabled"];

  #anchor = null;

  get href() {
    return this.readString("href", "");
  }

  set href(value) {
    this.reflectString("href", value);
  }

  get target() {
    return this.readString("target", "");
  }

  set target(value) {
    this.reflectString("target", value);
  }

  get external() {
    return this.readBoolean("external");
  }

  set external(value) {
    this.reflectBoolean("external", Boolean(value));
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  render() {
    if (!this.#anchor) {
      this.renderRoot.innerHTML = '<a class="link" part="link"><slot></slot></a>';
      this.#anchor = this.renderRoot.querySelector("a");

      this.listen(this.#anchor, "click", (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        emit(this, "rowan-click", {
          href: this.#anchor.getAttribute("href") || "",
          nativeEvent: event,
        });
      });
    }

    const safeHref = this.#sanitizeHref(this.href);
    this.#anchor.setAttribute("href", safeHref);

    if (this.external) {
      this.#anchor.target = this.target || "_blank";
      this.#anchor.rel = "noopener noreferrer";
    } else {
      this.#anchor.target = this.target;
      this.#anchor.removeAttribute("rel");
    }

    if (this.disabled) {
      this.#anchor.setAttribute("aria-disabled", "true");
      this.#anchor.tabIndex = -1;
    } else {
      this.#anchor.removeAttribute("aria-disabled");
      this.#anchor.removeAttribute("tabindex");
    }
  }

  #sanitizeHref(value) {
    const href = String(value || "").trim();
    if (href.length === 0) return "#";
    if (/^javascript\s*:/i.test(href)) return "#";
    return href;
  }
}

define("rowan-link", RowanLink);
