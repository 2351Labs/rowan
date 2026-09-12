import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

const DEFAULT_POSITION = 50;
const DEFAULT_STEP = 5;
const DEFAULT_SNAP_THRESHOLD = 2;

function clamp(value, minimum, maximum, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(maximum, Math.max(minimum, numeric));
}

function normalizeOrientation(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "vertical"
    ? "vertical"
    : "horizontal";
}

function normalizeSnapPoints(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map((point) => Number(point)).filter(Number.isFinite))].sort(
    (left, right) => left - right,
  );
}

/**
 * Resizable two-pane workspace layout.
 * @tag rowan-split-pane
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {number} position
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {number} snap-threshold
 * @attr {boolean} disabled
 * @property {number[]} snapPoints - Property-only percentage positions that attract nearby resize values.
 * @slot start - Start pane content.
 * @slot end - End pane content.
 * @csspart layout
 * @csspart start
 * @csspart separator
 * @csspart end
 * @cssprop --rowan-split-pane-gap
 * @cssprop --rowan-split-pane-separator-size
 * @cssprop --rowan-split-pane-separator-color
 * @event rowan-resize - Fired when a user resizes the pane with the separator.
 */
export class RowanSplitPane extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./split-pane.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-split-pane-"];
  static observedAttributes = [
    "orientation",
    "position",
    "min",
    "max",
    "step",
    "snap-threshold",
    "disabled",
  ];
  static upgradeProperties = [
    "orientation",
    "position",
    "min",
    "max",
    "step",
    "snapThreshold",
    "snapPoints",
    "disabled",
  ];

  #layout = null;
  #separator = null;
  #snapPoints = [];
  #activePointerId = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (["position", "min", "max", "snap-threshold"].includes(name)) {
      this.#syncConstrainedPosition();
    }
  }

  get orientation() {
    return normalizeOrientation(this.readString("orientation", "horizontal"));
  }

  set orientation(value) {
    const next = normalizeOrientation(value);
    this.reflectString("orientation", next === "horizontal" ? null : next);
  }

  /** @returns {number} */
  get position() {
    return this.#constrain(this.readNumber("position", DEFAULT_POSITION), DEFAULT_POSITION);
  }

  /** @param {number} value */
  set position(value) {
    this.#setPosition(value);
  }

  /** @returns {number} */
  get min() {
    return clamp(this.readNumber("min", 0), 0, 100, 0);
  }

  /** @param {number} value */
  set min(value) {
    const next = clamp(value, 0, 100, 0);
    this.reflectNumber("min", next === 0 ? null : next);

    const rawMax = clamp(this.readNumber("max", 100), 0, 100, 100);
    if (rawMax < next) this.reflectNumber("max", next === 100 ? null : next);
    this.#syncConstrainedPosition();
  }

  /** @returns {number} */
  get max() {
    return Math.max(this.min, clamp(this.readNumber("max", 100), 0, 100, 100));
  }

  /** @param {number} value */
  set max(value) {
    const next = Math.max(this.min, clamp(value, 0, 100, 100));
    this.reflectNumber("max", next === 100 ? null : next);
    this.#syncConstrainedPosition();
  }

  /** @returns {number} */
  get step() {
    return Math.max(0.1, this.readNumber("step", DEFAULT_STEP));
  }

  /** @param {number} value */
  set step(value) {
    const next = Math.max(0.1, Number(value) || DEFAULT_STEP);
    this.reflectNumber("step", next === DEFAULT_STEP ? null : next);
  }

  /** @returns {number} */
  get snapThreshold() {
    return Math.max(0, this.readNumber("snap-threshold", DEFAULT_SNAP_THRESHOLD));
  }

  /** @param {number} value */
  set snapThreshold(value) {
    const next = Math.max(0, Number(value) || 0);
    this.reflectNumber("snap-threshold", next === DEFAULT_SNAP_THRESHOLD ? null : next);
    this.#syncConstrainedPosition();
  }

  /** @returns {number[]} */
  get snapPoints() {
    return [...this.#snapPoints];
  }

  /** @param {number[]} value */
  set snapPoints(value) {
    this.#snapPoints = normalizeSnapPoints(value);
    this.#syncConstrainedPosition();
    this.requestRender();
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  render() {
    if (!this.#layout) {
      this.renderRoot.innerHTML = `
        <div class="layout" part="layout">
          <div class="pane start" part="start"><slot name="start"></slot></div>
          <div class="separator" part="separator" role="separator" tabindex="0"></div>
          <div class="pane end" part="end"><slot name="end"></slot></div>
        </div>
      `;

      this.#layout = this.renderRoot.querySelector(".layout");
      this.#separator = this.renderRoot.querySelector(".separator");

      this.listen(this.#separator, "pointerdown", (event) => this.#handlePointerDown(event));
      this.listen(this.#separator, "keydown", (event) => this.#handleKeyDown(event));
      this.listen(document, "pointermove", (event) => this.#handlePointerMove(event));
      this.listen(document, "pointerup", (event) => this.#handlePointerEnd(event));
      this.listen(document, "pointercancel", (event) => this.#handlePointerEnd(event));
    }

    this.#syncLayout();
  }

  #syncConstrainedPosition() {
    this.#setPosition(this.readNumber("position", DEFAULT_POSITION));
  }

  #setPosition(value, options = {}) {
    const previousValue = this.position;
    const next = this.#constrain(value, previousValue);
    const serialized = next === DEFAULT_POSITION ? null : next;
    const changed = next !== previousValue;

    this.reflectNumber("position", serialized);
    this.requestRender();

    if (changed && options.emitEvent) {
      emit(this, "rowan-resize", {
        value: next,
        previousValue,
        orientation: this.orientation,
      });
    }
  }

  #constrain(value, fallback) {
    const bounded = clamp(value, this.min, this.max, fallback);
    const candidates = this.#snapPoints.filter((point) => point >= this.min && point <= this.max);
    const nearest = candidates.reduce(
      (closest, point) =>
        closest === null || Math.abs(point - bounded) < Math.abs(closest - bounded)
          ? point
          : closest,
      null,
    );
    const snapped =
      nearest !== null && Math.abs(nearest - bounded) <= this.snapThreshold ? nearest : bounded;

    return Number(snapped.toFixed(4));
  }

  #syncLayout() {
    const position = this.position;
    const remaining = Math.max(0, 100 - position);
    const isVertical = this.orientation === "vertical";

    if (isVertical) {
      this.#layout.style.gridTemplateRows = `minmax(0, ${position}fr) var(--rowan-split-pane-separator-size, 0.5rem) minmax(0, ${remaining}fr)`;
      this.#layout.style.removeProperty("grid-template-columns");
    } else {
      this.#layout.style.gridTemplateColumns = `minmax(0, ${position}fr) var(--rowan-split-pane-separator-size, 0.5rem) minmax(0, ${remaining}fr)`;
      this.#layout.style.removeProperty("grid-template-rows");
    }

    this.#separator.setAttribute("aria-orientation", isVertical ? "horizontal" : "vertical");
    this.#separator.setAttribute("aria-valuemin", String(this.min));
    this.#separator.setAttribute("aria-valuemax", String(this.max));
    this.#separator.setAttribute("aria-valuenow", String(position));
    this.#separator.setAttribute("aria-valuetext", `${position}%`);
    this.#separator.setAttribute("aria-disabled", String(this.disabled));
    this.#separator.tabIndex = this.disabled ? -1 : 0;
  }

  #handlePointerDown(event) {
    if (this.disabled || event.button !== 0) return;

    this.#activePointerId = event.pointerId;
    this.#separator.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  #handlePointerMove(event) {
    if (this.#activePointerId !== event.pointerId || this.disabled) return;

    const bounds = this.#layout.getBoundingClientRect();
    const isVertical = this.orientation === "vertical";
    const size = isVertical ? bounds.height : bounds.width;
    if (size <= 0) return;

    const coordinate = isVertical ? event.clientY - bounds.top : event.clientX - bounds.left;
    this.#setPosition((coordinate / size) * 100, { emitEvent: true });
  }

  #handlePointerEnd(event) {
    if (this.#activePointerId !== event.pointerId) return;

    this.#separator.releasePointerCapture?.(event.pointerId);
    this.#activePointerId = null;
  }

  #handleKeyDown(event) {
    if (this.disabled) return;

    const isVertical = this.orientation === "vertical";
    const isRtl = getComputedStyle(this).direction === "rtl";
    const multiplier = event.shiftKey ? 5 : 1;
    let next = null;

    if (event.key === "Home") {
      next = this.min;
    } else if (event.key === "End") {
      next = this.max;
    } else if (!isVertical && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      next = this.position + direction * (isRtl ? -1 : 1) * this.step * multiplier;
    } else if (isVertical && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      const direction = event.key === "ArrowDown" ? 1 : -1;
      next = this.position + direction * this.step * multiplier;
    }

    if (next === null) return;

    event.preventDefault();
    this.#setPosition(next, { emitEvent: true });
  }
}

define("rowan-split-pane", RowanSplitPane);
