import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

function hasAssignedContent(slot) {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

function sanitizeHref(value) {
  const href = String(value ?? "").trim();
  return /^javascript\s*:/i.test(href) ? "" : href;
}

/**
 * Link item managed by rowan-side-nav.
 * @tag rowan-side-nav-item
 * @attr {string} value
 * @attr {string} href
 * @attr {string} target
 * @attr {string} label
 * @attr {boolean} active
 * @attr {boolean} disabled
 * @attr {boolean} external
 * @slot - Item label
 * @slot prefix
 * @slot suffix
 * @csspart item
 * @csspart label
 * @cssprop --rowan-side-nav-item-fg
 * @cssprop --rowan-side-nav-item-active-bg
 */
export class RowanSideNavItem extends BaseElement {
  static styleUrl = new URL("./side-nav-item.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static componentTokenPrefixes = ["--rowan-side-nav-item-"];
  static observedAttributes = [
    "value",
    "href",
    "target",
    "label",
    "active",
    "disabled",
    "external",
    "tabindex",
  ];
  static upgradeProperties = ["value", "href", "target", "label", "active", "disabled", "external"];

  #control = null;
  #labelSlot = null;
  #labelFallback = null;
  #rovingTabIndex = null;
  #rovingOwner = null;

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

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

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get active() {
    return this.readBoolean("active");
  }

  set active(value) {
    this.reflectBoolean("active", Boolean(value));
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get external() {
    return this.readBoolean("external");
  }

  set external(value) {
    this.reflectBoolean("external", Boolean(value));
  }

  focus(options) {
    if (this.#control) {
      this.#control.focus(options);
      return;
    }

    super.focus(options);
  }

  /** @internal */
  activate() {
    if (!this.disabled) this.#control?.click();
  }

  /** @internal */
  setRovingTabIndex(value, owner = null) {
    const isClearing = value == null;
    if (isClearing && owner && this.#rovingOwner !== owner) return;

    const next = isClearing ? null : Number(value) === 0 ? 0 : -1;
    const nextOwner = isClearing ? null : owner;
    if (this.#rovingTabIndex === next && this.#rovingOwner === nextOwner) return;

    this.#rovingTabIndex = next;
    this.#rovingOwner = nextOwner;
    if (this.#control) this.#control.tabIndex = this.#resolvedTabIndex();
    this.requestRender();
  }

  render() {
    if (!this.#control) {
      this.renderRoot.innerHTML = `
        <a class="item" part="item">
          <span class="prefix"><slot name="prefix"></slot></span>
          <span class="label" part="label"><slot></slot><span class="label-fallback"></span></span>
          <span class="suffix"><slot name="suffix"></slot></span>
        </a>
      `;
      this.#control = this.renderRoot.querySelector("a");
      this.#labelSlot = this.renderRoot.querySelector(".label > slot");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#control, "click", (event) => {
        if (!this.disabled) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      });
    }

    const href = sanitizeHref(this.href);
    const hasLabelContent = hasAssignedContent(this.#labelSlot);
    const accessibleLabel = this.getAttribute("aria-label") || (!hasLabelContent ? this.label : "");

    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = !this.label || hasLabelContent;
    this.#control.tabIndex = this.#resolvedTabIndex();

    if (href) {
      this.#control.href = href;
      this.#control.removeAttribute("role");
    } else {
      this.#control.removeAttribute("href");
      this.#control.setAttribute("role", "button");
    }

    if (this.external) {
      this.#control.target = this.target || "_blank";
      this.#control.rel = "noopener noreferrer";
    } else if (this.target) {
      this.#control.target = this.target;
      this.#control.removeAttribute("rel");
    } else {
      this.#control.removeAttribute("target");
      this.#control.removeAttribute("rel");
    }

    if (accessibleLabel) {
      this.#control.setAttribute("aria-label", accessibleLabel);
    } else {
      this.#control.removeAttribute("aria-label");
    }

    if (!this.hasAttribute("aria-current")) {
      this.#control.toggleAttribute("aria-current", this.active);
      if (this.active) this.#control.setAttribute("aria-current", "page");
    } else {
      this.#control.removeAttribute("aria-current");
    }

    this.#control.setAttribute("aria-disabled", String(this.disabled));

    if (this.internals && !this.hasAttribute("aria-current") && "ariaCurrent" in this.internals) {
      this.internals.ariaCurrent = this.active ? "page" : null;
    }

    if (this.internals && !this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }

  #resolvedTabIndex() {
    if (this.disabled) return -1;
    return this.#rovingTabIndex ?? (this.hasAttribute("tabindex") ? this.tabIndex : 0);
  }
}

define("rowan-side-nav-item", RowanSideNavItem);
