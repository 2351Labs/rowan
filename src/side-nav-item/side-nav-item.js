import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { sanitizeNavigationHref } from "../lib/url.js";

const TONES = new Set(["none", "info", "success", "warning", "danger"]);
const COUNT_LABELS = {
  none: "alerts",
  info: "notices",
  success: "updates",
  warning: "warnings",
  danger: "alerts",
};

function hasAssignedContent(slot) {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    return true;
  });
}

function assignedText(slot) {
  return slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent ?? "")
    .join("")
    .trim();
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
 * @attr {"none"|"info"|"success"|"warning"|"danger"} tone
 * @attr {number} count
 * @attr {string} count-label
 * @slot - Item label
 * @slot prefix
 * @slot suffix
 * @csspart item
 * @csspart label
 * @csspart status
 * @csspart status-dot
 * @csspart status-count
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
    "tone",
    "count",
    "count-label",
    "tabindex",
  ];
  static upgradeProperties = [
    "value",
    "href",
    "target",
    "label",
    "active",
    "disabled",
    "external",
    "tone",
    "count",
    "countLabel",
  ];

  #control = null;
  #labelSlot = null;
  #labelFallback = null;
  #suffixSlot = null;
  #suffix = null;
  #status = null;
  #statusDot = null;
  #statusCount = null;
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

  /** @returns {"none" | "info" | "success" | "warning" | "danger"} */
  get tone() {
    return normalizeEnum(this.readString("tone", "none"), TONES, "none");
  }

  /** @param {"none" | "info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    reflectEnum(this, "tone", value, TONES, "none");
  }

  /** @returns {number | null} */
  get count() {
    if (!this.hasAttribute("count")) return null;
    const numeric = Number(this.getAttribute("count"));
    return Number.isFinite(numeric) ? numeric : null;
  }

  /** @param {number | null} value */
  set count(value) {
    this.reflectNumber("count", value);
  }

  get countLabel() {
    return this.readString("count-label", "");
  }

  set countLabel(value) {
    this.reflectString("count-label", String(value ?? "").trim() || null);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "tone" && rewriteEnumAttribute(this, name, newValue, TONES, "none")) return;
    super.attributeChangedCallback(name, oldValue, newValue);
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
          <span class="suffix">
            <slot name="suffix"></slot>
            <span class="status" part="status" hidden>
              <span class="status-dot" part="status-dot"></span>
              <span class="status-count" part="status-count"></span>
            </span>
          </span>
        </a>
      `;
      this.#control = this.renderRoot.querySelector("a");
      this.#labelSlot = this.renderRoot.querySelector(".label > slot");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#suffix = this.renderRoot.querySelector(".suffix");
      this.#suffixSlot = this.renderRoot.querySelector('slot[name="suffix"]');
      this.#status = this.renderRoot.querySelector(".status");
      this.#statusDot = this.renderRoot.querySelector(".status-dot");
      this.#statusCount = this.renderRoot.querySelector(".status-count");
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#suffixSlot, "slotchange", () => this.requestRender());
      this.listen(this.#control, "click", (event) => {
        if (!this.disabled) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      });
    }

    const href = sanitizeNavigationHref(this.href, "");
    const hasLabelContent = hasAssignedContent(this.#labelSlot);
    const hasSuffixContent = hasAssignedContent(this.#suffixSlot);
    const status = this.#statusView();
    this.#syncStatus(hasSuffixContent, status);
    const accessibleLabel = this.#accessibleName(hasLabelContent, status, hasSuffixContent);

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

  #statusView() {
    const count = this.count;
    const showCount = count !== null && count > 0;
    const tone = this.tone;
    const showDot = !showCount && tone !== "none";
    const resolvedTone = showCount && tone === "none" ? "danger" : tone;
    const countLabel = this.countLabel || COUNT_LABELS[resolvedTone] || COUNT_LABELS.none;
    return {
      show: showCount || showDot,
      showCount,
      tone: resolvedTone,
      count,
      countLabel,
      phrase: showCount ? `${count} ${countLabel}` : showDot ? countLabel : "",
    };
  }

  #syncStatus(hasSuffixContent, status) {
    const showBuiltIn = status.show && !hasSuffixContent;
    this.#suffix.classList.toggle("is-empty", !hasSuffixContent && !showBuiltIn);
    this.#status.hidden = !showBuiltIn;
    this.#status.dataset.tone = showBuiltIn ? status.tone : "";
    this.#statusDot.hidden = !showBuiltIn || status.showCount;
    this.#statusCount.hidden = !showBuiltIn || !status.showCount;
    this.#statusCount.textContent = showBuiltIn && status.showCount ? String(status.count) : "";
  }

  #accessibleName(hasLabelContent, status, hasSuffixContent) {
    const base =
      this.getAttribute("aria-label") ||
      (!hasLabelContent ? this.label : assignedText(this.#labelSlot));
    if (hasSuffixContent || !status.show || !status.phrase) return base;
    if (!base) return status.phrase;
    return `${base}, ${status.phrase}`;
  }
}

define("rowan-side-nav-item", RowanSideNavItem);
