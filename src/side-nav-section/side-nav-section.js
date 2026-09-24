import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

/**
 * Labeled group of destinations inside rowan-side-nav.
 * Opt-in `collapsible` adds a disclosure control. `collapsed` defaults false
 * (open). The parent nav still has one `value`; this host is not a destination.
 * @tag rowan-side-nav-section
 * @attr {string} label
 * @attr {boolean} collapsible
 * @attr {boolean} collapsed
 * @slot - rowan-side-nav-item children
 * @csspart section
 * @csspart label
 * @csspart trigger
 * @csspart items
 * @cssprop --rowan-side-nav-section-gap
 * @cssprop --rowan-side-nav-section-label-fg
 * @cssprop --rowan-side-nav-section-label-font-size
 * @cssprop --rowan-side-nav-section-label-padding
 * @event rowan-toggle - Fired when a user expands or collapses a collapsible section
 */
export class RowanSideNavSection extends BaseElement {
  static styleUrl = new URL("./side-nav-section.css", import.meta.url).href;
  static useElementInternals = true;
  static componentTokenPrefixes = ["--rowan-side-nav-section-"];
  static observedAttributes = ["label", "collapsible", "collapsed"];
  static upgradeProperties = ["label", "collapsible", "collapsed"];

  #section = null;
  #heading = null;
  #trigger = null;
  #items = null;
  #headingId = `rowan-side-nav-section-${Math.random().toString(36).slice(2, 10)}`;
  #itemsId = `rowan-side-nav-section-items-${Math.random().toString(36).slice(2, 10)}`;
  #removeTriggerClick = null;
  #removeTriggerKey = null;

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get collapsible() {
    return this.readBoolean("collapsible");
  }

  set collapsible(value) {
    this.reflectBoolean("collapsible", Boolean(value));
  }

  get collapsed() {
    return this.readBoolean("collapsed");
  }

  set collapsed(value) {
    this.reflectBoolean("collapsed", Boolean(value));
  }

  /** @returns {boolean} */
  get expanded() {
    return !this.collapsible || !this.collapsed;
  }

  focusTrigger() {
    this.#trigger?.focus({ preventScroll: true });
  }

  toggleFromUser(collapsed = !this.collapsed) {
    if (!this.collapsible) return;
    const next = Boolean(collapsed);
    if (this.collapsed === next) return;
    this.collapsed = next;
    emit(this, "rowan-toggle", { collapsed: next, expanded: !next });
    if (next) this.focusTrigger();
  }

  render() {
    if (!this.#section) {
      this.renderRoot.innerHTML = `
        <div class="section" part="section">
          <p class="label" part="label"></p>
          <button class="trigger" part="trigger" type="button">
            <span class="trigger-label"></span>
            <span class="chevron" aria-hidden="true"></span>
          </button>
          <div class="items" part="items"><slot></slot></div>
        </div>
      `;
      this.#section = this.renderRoot.querySelector(".section");
      this.#heading = this.renderRoot.querySelector(".label");
      this.#trigger = this.renderRoot.querySelector(".trigger");
      this.#items = this.renderRoot.querySelector(".items");
      this.#heading.id = this.#headingId;
      this.#items.id = this.#itemsId;
      this.#bindTrigger();
    }

    const label = this.label.trim();
    const collapsible = this.collapsible;
    const collapsed = collapsible && this.collapsed;
    const headingText = label || (collapsible ? "Group" : "");

    this.#heading.textContent = headingText;
    this.#heading.hidden = collapsible || !headingText;
    this.renderRoot.querySelector(".trigger-label").textContent = headingText;
    this.#trigger.hidden = !collapsible;
    this.#trigger.setAttribute("aria-expanded", collapsed ? "false" : "true");
    this.#trigger.setAttribute("aria-controls", this.#itemsId);
    this.#items.hidden = collapsed;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (this.internals && !this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = headingText || null;
    }

    if (this.internals && "ariaLabelledByElements" in this.internals) {
      const labelledBy = collapsible ? this.#trigger : this.#heading;
      this.internals.ariaLabelledByElements =
        !this.hasAttribute("aria-labelledby") && !this.hasAttribute("aria-label") && headingText
          ? [labelledBy]
          : [];
    }
  }

  #bindTrigger() {
    if (this.#removeTriggerClick) return;

    this.#removeTriggerClick = this.listen(this.#trigger, "click", () => {
      this.toggleFromUser(!this.collapsed);
    });

    this.#removeTriggerKey = this.listen(this.#trigger, "keydown", (event) => {
      if (event.key === keys.ARROW_DOWN || event.key === keys.ARROW_RIGHT) {
        event.preventDefault();
        if (this.collapsed) this.toggleFromUser(false);
        this.#firstItem()?.focus({ preventScroll: true });
        return;
      }

      if (event.key === keys.ARROW_LEFT && !this.collapsed) {
        event.preventDefault();
        this.toggleFromUser(true);
      }
    });
  }

  #firstItem() {
    return [...this.children].find(
      (node) => node.localName === "rowan-side-nav-item" && !node.disabled && !node.hidden,
    );
  }
}

define("rowan-side-nav-section", RowanSideNavSection);
