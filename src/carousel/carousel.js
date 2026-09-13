import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

const panelStates = new WeakMap();

function normalizeIndex(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.floor(numeric));
}

function clampIndex(index, panelCount) {
  if (panelCount <= 0) return 0;
  return Math.min(Math.max(0, index), panelCount - 1);
}

/**
 * Controlled sequence of slotted content panels.
 * @tag rowan-carousel
 * @attr {number} active-index
 * @attr {string} label
 * @slot - Carousel panels
 * @csspart carousel
 * @csspart viewport
 * @csspart controls
 * @csspart previous-button
 * @csspart status
 * @csspart next-button
 * @cssprop --rowan-carousel-border
 * @cssprop --rowan-carousel-control-bg
 * @cssprop --rowan-carousel-control-fg
 * @cssprop --rowan-carousel-focus-ring
 * @event rowan-change - Fired when a user changes the active panel
 */
export class RowanCarousel extends BaseElement {
  static styleUrl = new URL("./carousel.css", import.meta.url).href;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static observedAttributes = ["active-index", "label"];
  static upgradeProperties = ["activeIndex", "label"];
  static componentTokenPrefixes = ["--rowan-carousel-"];

  #carousel = null;
  #viewport = null;
  #panelSlot = null;
  #previousButton = null;
  #nextButton = null;
  #status = null;
  #controlledPanels = new Map();

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#releasePanels();
    super.disconnectedCallback();
  }

  get activeIndex() {
    return normalizeIndex(this.readNumber("active-index", 0));
  }

  set activeIndex(value) {
    const next = normalizeIndex(value);
    this.reflectNumber("active-index", next === 0 ? null : next);
  }

  get label() {
    return this.readString("label", "Carousel");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  previous() {
    const panels = this.#getPanels();
    if (panels.length === 0) return;
    this.goTo(this.activeIndex - 1);
  }

  next() {
    const panels = this.#getPanels();
    if (panels.length === 0) return;
    this.goTo(this.activeIndex + 1);
  }

  /**
   * Activates a panel without emitting `rowan-change`.
   * @param {number} index
   */
  goTo(index) {
    const panels = this.#getPanels();
    const requested = normalizeIndex(index);
    this.activeIndex = panels.length > 0 ? clampIndex(requested, panels.length) : requested;
  }

  render() {
    if (!this.#carousel) {
      this.renderRoot.innerHTML = `
        <div class="carousel" part="carousel">
          <div class="viewport" part="viewport" tabindex="0">
            <slot></slot>
          </div>
          <div class="controls" part="controls">
            <button
              class="control-button"
              part="previous-button"
              type="button"
              data-action="previous"
              aria-label="Previous panel"
              title="Previous panel"
            ><span aria-hidden="true">&larr;</span></button>
            <p class="status" part="status" aria-live="polite" aria-atomic="true"></p>
            <button
              class="control-button"
              part="next-button"
              type="button"
              data-action="next"
              aria-label="Next panel"
              title="Next panel"
            ><span aria-hidden="true">&rarr;</span></button>
          </div>
        </div>
      `;

      this.#carousel = this.renderRoot.querySelector(".carousel");
      this.#viewport = this.renderRoot.querySelector(".viewport");
      this.#panelSlot = this.renderRoot.querySelector("slot");
      this.#previousButton = this.renderRoot.querySelector('[data-action="previous"]');
      this.#nextButton = this.renderRoot.querySelector('[data-action="next"]');
      this.#status = this.renderRoot.querySelector(".status");

      this.listen(this.#panelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#carousel, "click", (event) => this.#handleControlClick(event));
      this.listen(this.#viewport, "keydown", (event) => this.#handleViewportKeydown(event));
    }

    const panels = this.#getPanels();
    const activeIndex = this.#normalizeActiveIndex(panels.length);
    this.#syncPanels(panels, activeIndex);
    this.#syncControls(panels.length, activeIndex);
    this.#applyDefaultA11y();
  }

  #getPanels() {
    if (this.#panelSlot) {
      return this.#panelSlot.assignedElements();
    }

    return Array.from(this.children).filter((child) => !child.hasAttribute("slot"));
  }

  #normalizeActiveIndex(panelCount) {
    const next = clampIndex(this.activeIndex, panelCount);
    if (next !== this.activeIndex) {
      this.activeIndex = next;
    }
    return next;
  }

  #syncPanels(panels, activeIndex) {
    const currentPanels = new Set(panels);

    for (const [panel, state] of this.#controlledPanels) {
      if (!currentPanels.has(panel)) {
        this.#releasePanel(panel, state);
      }
    }

    panels.forEach((panel, index) => {
      let state = panelStates.get(panel);
      if (!state) {
        state = {
          hidden: panel.hidden,
          owner: this,
        };
        panelStates.set(panel, state);
      } else {
        state.owner = this;
      }

      this.#controlledPanels.set(panel, state);
      panel.toggleAttribute("data-rowan-carousel-panel", true);
      panel.toggleAttribute("data-rowan-carousel-active", index === activeIndex);
      panel.hidden = index !== activeIndex;
    });
  }

  #syncControls(panelCount, activeIndex) {
    const hasPanels = panelCount > 0;
    this.#previousButton.disabled = !hasPanels || activeIndex === 0;
    this.#nextButton.disabled = !hasPanels || activeIndex === panelCount - 1;

    if (hasPanels) {
      this.#status.textContent = `Panel ${activeIndex + 1} of ${panelCount}`;
      return;
    }

    this.#status.textContent = "No panels";
  }

  #handleControlClick(event) {
    const button = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.action);
    if (
      !button ||
      button.disabled ||
      (button !== this.#previousButton && button !== this.#nextButton)
    ) {
      return;
    }

    const panels = this.#getPanels();
    const current = this.#normalizeActiveIndex(panels.length);
    const next = button.dataset.action === "previous" ? current - 1 : current + 1;
    this.#activateFromUser(next, panels, current);
  }

  #handleViewportKeydown(event) {
    if (event.target !== this.#viewport) return;

    const panels = this.#getPanels();
    const current = this.#normalizeActiveIndex(panels.length);
    let next = null;

    if (event.key === "ArrowLeft" || event.key === "PageUp") next = current - 1;
    if (event.key === "ArrowRight" || event.key === "PageDown") next = current + 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = panels.length - 1;

    if (next == null) return;

    event.preventDefault();
    this.#activateFromUser(next, panels, current);
  }

  #activateFromUser(nextIndex, panels, currentIndex) {
    if (panels.length === 0) return;

    const next = clampIndex(nextIndex, panels.length);
    if (next === currentIndex) return;

    this.activeIndex = next;
    emit(this, "rowan-change", {
      activeIndex: next,
      previousIndex: currentIndex,
    });
  }

  #applyDefaultA11y() {
    const canUseInternals =
      this.internals && !this.hasAttribute("role") && "role" in this.internals;

    if (canUseInternals) {
      this.internals.role = "region";
      if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
        this.internals.ariaLabel = this.label;
      }
      if (!this.hasAttribute("aria-roledescription") && "ariaRoleDescription" in this.internals) {
        this.internals.ariaRoleDescription = "carousel";
      }
      this.#carousel.removeAttribute("role");
      this.#carousel.removeAttribute("aria-label");
      this.#carousel.removeAttribute("aria-roledescription");
      return;
    }

    this.#carousel.setAttribute("role", "region");
    this.#carousel.setAttribute("aria-label", this.label);
    this.#carousel.setAttribute("aria-roledescription", "carousel");
  }

  #releasePanels() {
    for (const [panel, state] of this.#controlledPanels) {
      this.#releasePanel(panel, state);
    }
  }

  #releasePanel(panel, state) {
    this.#controlledPanels.delete(panel);
    if (state.owner !== this) return;

    panel.hidden = state.hidden;
    panel.removeAttribute("data-rowan-carousel-panel");
    panel.removeAttribute("data-rowan-carousel-active");
    panelStates.delete(panel);
  }
}

define("rowan-carousel", RowanCarousel);
