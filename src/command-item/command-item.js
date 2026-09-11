import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

let generatedCommandItemId = 0;

/**
 * Action entry used by a rowan-command-palette.
 * @tag rowan-command-item
 * @attr {string} value
 * @attr {string} label
 * @attr {string} description
 * @attr {string} keywords
 * @attr {string} group
 * @attr {string} shortcut
 * @attr {boolean} disabled
 * @slot - Command label
 * @slot prefix
 * @slot description
 * @slot shortcut
 * @csspart item
 * @csspart label
 * @csspart description
 * @csspart group
 * @csspart shortcut
 * @cssprop --rowan-command-item-fg
 * @cssprop --rowan-command-item-active-bg
 * @cssprop --rowan-command-item-shortcut-bg
 */
export class RowanCommandItem extends BaseElement {
  static styleUrl = new URL("./command-item.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = [
    "value",
    "label",
    "description",
    "keywords",
    "group",
    "shortcut",
    "disabled",
    "tabindex",
  ];
  static upgradeProperties = [
    "value",
    "label",
    "description",
    "keywords",
    "group",
    "shortcut",
    "disabled",
  ];

  #button = null;
  #labelSlot = null;
  #labelFallback = null;
  #description = null;
  #descriptionSlot = null;
  #descriptionFallback = null;
  #group = null;
  #shortcut = null;
  #shortcutFallback = null;
  #paletteOwner = null;
  #paletteActive = false;
  #generatedId = "";

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", value);
  }

  get keywords() {
    return this.readString("keywords", "");
  }

  set keywords(value) {
    this.reflectString("keywords", value);
  }

  get group() {
    return this.readString("group", "");
  }

  set group(value) {
    this.reflectString("group", value);
  }

  get shortcut() {
    return this.readString("shortcut", "");
  }

  set shortcut(value) {
    this.reflectString("shortcut", value);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get searchText() {
    return [
      this.value,
      this.label,
      this.description,
      this.keywords,
      this.group,
      this.textContent,
    ].join(" ");
  }

  focus(options) {
    if (this.#button) {
      this.#button.focus(options);
      return;
    }

    super.focus(options);
  }

  /** @internal */
  setCommandPaletteState({ active = false, visible = true } = {}, owner) {
    if (!owner) return this.#ensureId();

    const nextActive = Boolean(active);
    const nextVisible = Boolean(visible);
    const changed =
      this.#paletteOwner !== owner ||
      this.#paletteActive !== nextActive ||
      this.hasAttribute("data-rowan-command-hidden") === nextVisible;

    this.#paletteOwner = owner;
    this.#paletteActive = nextActive;
    this.toggleAttribute("data-rowan-command-active", nextActive);
    this.toggleAttribute("data-rowan-command-hidden", !nextVisible);

    if (this.#button) {
      this.#button.tabIndex = this.#resolvedTabIndex();
    }

    if (changed) this.requestRender();
    return this.#ensureId();
  }

  /** @internal */
  clearCommandPaletteState(owner) {
    if (owner && this.#paletteOwner !== owner) return;

    const changed = this.#paletteOwner !== null || this.#paletteActive;
    this.#paletteOwner = null;
    this.#paletteActive = false;
    this.removeAttribute("data-rowan-command-active");
    this.removeAttribute("data-rowan-command-hidden");

    if (this.#generatedId && this.id === this.#generatedId) {
      this.removeAttribute("id");
    }
    this.#generatedId = "";

    if (this.#button) {
      this.#button.tabIndex = this.#resolvedTabIndex();
    }

    if (changed) this.requestRender();
  }

  render() {
    if (!this.#button) {
      this.renderRoot.innerHTML = `
        <button class="item" part="item" type="button">
          <span class="prefix"><slot name="prefix"></slot></span>
          <span class="content">
            <span class="label" part="label"><slot></slot><span class="label-fallback"></span></span>
            <span class="description" part="description">
              <slot name="description"></slot>
              <span class="description-fallback"></span>
            </span>
          </span>
          <span class="meta">
            <span class="group" part="group"></span>
            <kbd class="shortcut" part="shortcut">
              <slot name="shortcut"></slot>
              <span class="shortcut-fallback"></span>
            </kbd>
          </span>
        </button>
      `;
      this.#button = this.renderRoot.querySelector("button");
      this.#labelSlot = this.renderRoot.querySelector(".label > slot");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#description = this.renderRoot.querySelector(".description");
      this.#descriptionSlot = this.renderRoot.querySelector(
        '.description > slot[name="description"]',
      );
      this.#descriptionFallback = this.renderRoot.querySelector(".description-fallback");
      this.#group = this.renderRoot.querySelector(".group");
      this.#shortcut = this.renderRoot.querySelector(".shortcut");
      this.#shortcutFallback = this.renderRoot.querySelector(".shortcut-fallback");

      for (const slot of this.renderRoot.querySelectorAll("slot")) {
        this.listen(slot, "slotchange", () => this.requestRender());
      }
    }

    const hasLabelSlot = this.#hasSlottedContent(this.#labelSlot);
    const hasDescriptionSlot = this.#hasSlottedContent(this.#descriptionSlot);
    const hasShortcutSlot = this.#hasSlottedContent(
      this.renderRoot.querySelector('slot[name="shortcut"]'),
    );

    this.#button.disabled = this.disabled;
    this.#button.tabIndex = this.#resolvedTabIndex();
    this.#button.setAttribute("aria-selected", this.#paletteActive ? "true" : "false");

    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasLabelSlot || !this.label;
    this.#descriptionFallback.textContent = this.description;
    this.#descriptionFallback.hidden = hasDescriptionSlot || !this.description;
    this.#description.hidden = !hasDescriptionSlot && !this.description;

    this.#group.textContent = this.group;
    this.#group.hidden = !this.group;

    this.#shortcutFallback.textContent = this.shortcut;
    this.#shortcutFallback.hidden = hasShortcutSlot || !this.shortcut;
    this.#shortcut.hidden = !hasShortcutSlot && !this.shortcut;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "option";
    }

    if (this.internals && !this.hasAttribute("aria-selected") && "ariaSelected" in this.internals) {
      this.internals.ariaSelected = this.#paletteActive ? "true" : "false";
    }

    if (this.internals && !this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }

  #hasSlottedContent(slot) {
    return slot?.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0;
    });
  }

  #ensureId() {
    if (this.id) return this.id;

    generatedCommandItemId += 1;
    this.#generatedId = `rowan-command-item-${generatedCommandItemId}`;
    this.id = this.#generatedId;
    return this.id;
  }

  #resolvedTabIndex() {
    if (this.#paletteOwner) return -1;
    return this.hasAttribute("tabindex") ? this.tabIndex : 0;
  }
}

define("rowan-command-item", RowanCommandItem);
