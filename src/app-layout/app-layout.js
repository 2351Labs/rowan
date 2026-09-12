import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";

let appLayoutNavigationId = 0;

/**
 * Responsive application shell for header, navigation, and main content.
 * @tag rowan-app-layout
 * @attr {boolean} navigation-open
 * @attr {string} navigation-label
 * @slot header - Application header content.
 * @slot navigation - Primary application navigation.
 * @slot - Main application content.
 * @csspart layout
 * @csspart header
 * @csspart navigation-toggle
 * @csspart navigation
 * @csspart backdrop
 * @csspart content
 * @cssprop --rowan-app-layout-navigation-width
 * @cssprop --rowan-app-layout-content-padding
 * @cssprop --rowan-app-layout-header-bg
 * @event rowan-change - Fired when a user opens or closes compact navigation.
 */
export class RowanAppLayout extends BaseElement {
  static styleUrl = new URL("./app-layout.css", import.meta.url).href;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static componentTokenPrefixes = ["--rowan-app-layout-"];
  static observedAttributes = ["navigation-open", "navigation-label"];
  static upgradeProperties = ["navigationOpen", "navigationLabel"];

  #layout = null;
  #navigation = null;
  #backdrop = null;
  #navigationToggle = null;
  #compactMedia = null;

  connectedCallback() {
    super.connectedCallback();
    this.#observeCompactViewport();
  }

  get navigationOpen() {
    return this.readBoolean("navigation-open");
  }

  set navigationOpen(value) {
    this.reflectBoolean("navigation-open", Boolean(value));
  }

  get navigationLabel() {
    return this.readString("navigation-label", "Navigation");
  }

  set navigationLabel(value) {
    this.reflectString("navigation-label", value || null);
  }

  render() {
    if (!this.#layout) {
      appLayoutNavigationId += 1;
      const navigationId = `rowan-app-layout-navigation-${appLayoutNavigationId}`;
      this.renderRoot.innerHTML = `
        <div class="layout" part="layout">
          <header class="header" part="header">
            <button class="navigation-toggle" part="navigation-toggle" type="button">
              <span class="navigation-toggle-icon" aria-hidden="true"></span>
            </button>
            <slot name="header"></slot>
          </header>
          <div class="body">
            <aside class="navigation" part="navigation" id="${navigationId}">
              <slot name="navigation"></slot>
            </aside>
            <div class="backdrop" part="backdrop" aria-hidden="true"></div>
            <main class="content" part="content"><slot></slot></main>
          </div>
        </div>
      `;

      this.#layout = this.renderRoot.querySelector(".layout");
      this.#navigation = this.renderRoot.querySelector(".navigation");
      this.#backdrop = this.renderRoot.querySelector(".backdrop");
      this.#navigationToggle = this.renderRoot.querySelector(".navigation-toggle");

      this.listen(this.#navigationToggle, "click", () => {
        this.#setNavigationOpen(!this.navigationOpen, { emitEvent: true });
      });
      this.listen(this.#backdrop, "click", () => {
        this.#setNavigationOpen(false, { emitEvent: true });
      });
      this.listen(this, "keydown", (event) => this.#handleKeydown(event));
    }

    this.#syncNavigationState();
  }

  #observeCompactViewport() {
    if (this.#compactMedia || typeof matchMedia !== "function") return;

    this.#compactMedia = matchMedia("(max-width: 48rem)");
    this.listen(this.#compactMedia, "change", () => this.#syncNavigationState());
  }

  #setNavigationOpen(value, options = {}) {
    const next = Boolean(value);
    const previousOpen = this.navigationOpen;
    if (previousOpen === next) return;

    this.reflectBoolean("navigation-open", next);

    if (options.emitEvent) {
      emit(this, "rowan-change", {
        navigationOpen: next,
        previousOpen,
      });
    }
  }

  #syncNavigationState() {
    if (!this.#navigation) return;

    const compact = this.#compactMedia?.matches ?? false;
    const closedCompactNavigation = compact && !this.navigationOpen;

    this.#navigationToggle.hidden = !compact;
    this.#navigationToggle.setAttribute("aria-controls", this.#navigation.id);
    this.#navigationToggle.setAttribute("aria-expanded", String(this.navigationOpen));
    this.#navigationToggle.setAttribute("aria-label", `Toggle ${this.navigationLabel}`);
    this.#backdrop.hidden = !compact || !this.navigationOpen;
    this.#navigation.toggleAttribute("inert", closedCompactNavigation);
    this.#navigation.setAttribute("aria-hidden", String(closedCompactNavigation));
    this.#navigation.setAttribute("aria-label", this.navigationLabel);
  }

  #handleKeydown(event) {
    if (event.key !== keys.ESCAPE || !this.navigationOpen || !this.#compactMedia?.matches) return;

    event.preventDefault();
    this.#setNavigationOpen(false, { emitEvent: true });
    this.#navigationToggle.focus({ preventScroll: true });
  }
}

define("rowan-app-layout", RowanAppLayout);
