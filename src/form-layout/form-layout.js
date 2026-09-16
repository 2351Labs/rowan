import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

function normalizeColumns(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 2;
  return Math.min(12, Math.max(1, Math.floor(numeric)));
}

function normalizeSpan(value, maximum) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) return null;
  return Math.min(maximum, Math.max(1, Math.floor(numeric)));
}

function normalizeLength(value, fallback) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

/**
 * Responsive field grid with direct-child spans and coordinated label alignment.
 * @tag rowan-form-layout
 * @attr {number} columns
 * @attr {string} gap
 * @attr {"top"|"start"} label-position
 * @attr {"start"|"end"} label-align
 * @attr {string} label-width
 * @slot - Form fields and controls; direct children may set span="1" through span="12"
 * @csspart layout
 * @cssprop --rowan-form-layout-gap
 * @cssprop --rowan-form-layout-label-width
 * @cssprop --rowan-form-layout-min-column-width
 */
export class RowanFormLayout extends BaseElement {
  static styleUrl = new URL("./form-layout.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-form-layout-"];
  static observedAttributes = ["columns", "gap", "label-position", "label-align", "label-width"];
  static upgradeProperties = ["columns", "gap", "labelPosition", "labelAlign", "labelWidth"];

  #layout = null;
  #slot = null;
  #styleLink = null;
  #sizingProbe = null;
  #responsiveProbe = null;
  #childObserver = null;
  #resizeObserver = null;
  #managedSpans = new Map();
  #managedResponsiveMarkers = new Map();
  #effectiveColumns = null;
  #responsiveMarkerQueued = false;

  connectedCallback() {
    super.connectedCallback();
    this.#observeChildren();
    this.#observeSize();
  }

  disconnectedCallback() {
    this.#clearManagedSpans();
    this.#clearManagedResponsiveMarkers();
    super.disconnectedCallback();
  }

  get columns() {
    return normalizeColumns(this.readNumber("columns", 2));
  }

  set columns(value) {
    const next = normalizeColumns(value);
    this.reflectNumber("columns", next === 2 ? null : next);
  }

  get gap() {
    return normalizeLength(this.readString("gap", ""), "");
  }

  set gap(value) {
    this.reflectString("gap", normalizeLength(value, "") || null);
  }

  get labelPosition() {
    return this.readString("label-position", "top").trim().toLowerCase() === "start"
      ? "start"
      : "top";
  }

  set labelPosition(value) {
    const next =
      String(value ?? "")
        .trim()
        .toLowerCase() === "start"
        ? "start"
        : "top";
    this.reflectString("label-position", next === "top" ? null : next);
  }

  get labelAlign() {
    return this.readString("label-align", "start").trim().toLowerCase() === "end" ? "end" : "start";
  }

  set labelAlign(value) {
    const next =
      String(value ?? "")
        .trim()
        .toLowerCase() === "end"
        ? "end"
        : "start";
    this.reflectString("label-align", next === "start" ? null : next);
  }

  get labelWidth() {
    return normalizeLength(this.readString("label-width", ""), "10rem");
  }

  set labelWidth(value) {
    const next = normalizeLength(value, "");
    this.reflectString("label-width", next || null);
  }

  render() {
    if (!this.#layout) {
      this.renderRoot.innerHTML = `
        <div class="layout" part="layout">
          <slot></slot>
          <span class="sizing-probe" aria-hidden="true"></span>
          <span class="responsive-probe" aria-hidden="true"></span>
        </div>
      `;
      this.#layout = this.renderRoot.querySelector(".layout");
      this.#slot = this.renderRoot.querySelector("slot");
      this.#styleLink = this.shadowRoot.querySelector('link[rel="stylesheet"]');
      this.#sizingProbe = this.renderRoot.querySelector(".sizing-probe");
      this.#responsiveProbe = this.renderRoot.querySelector(".responsive-probe");
      this.listen(this.#slot, "slotchange", () => this.#syncChildSpans());
      if (this.#styleLink) {
        this.listen(this.#styleLink, "load", () => this.#syncResponsiveLayout());
      }
      this.#observeSize();
    }

    this.#layout.style.setProperty("--rowan-form-layout-columns", String(this.columns));
    if (this.#effectiveColumns === null || this.#effectiveColumns > this.columns) {
      this.#setEffectiveColumns(this.columns);
    }

    if (this.gap) {
      this.#layout.style.setProperty("--rowan-form-layout-gap", this.gap);
    } else {
      this.#layout.style.removeProperty("--rowan-form-layout-gap");
    }

    if (this.labelPosition === "start") {
      this.#layout.style.setProperty(
        "--rowan-form-layout-required-column-width",
        "max(var(--rowan-form-layout-min-column-width, 14rem), calc(var(--rowan-form-layout-label-width, 10rem) + var(--rowan-space-2, 0.5rem) + var(--rowan-form-layout-min-column-width, 14rem)))",
      );
      this.style.setProperty("--rowan-form-layout-field-areas", '"label control" ". support"');
      this.style.setProperty(
        "--rowan-form-layout-field-columns",
        "minmax(var(--rowan-form-layout-label-width, 10rem), 0.45fr) minmax(0, 1fr)",
      );
    } else {
      this.#layout.style.removeProperty("--rowan-form-layout-required-column-width");
      this.style.removeProperty("--rowan-form-layout-field-areas");
      this.style.removeProperty("--rowan-form-layout-field-columns");
    }

    if (this.hasAttribute("label-width")) {
      this.style.setProperty("--rowan-form-layout-label-width", this.labelWidth);
    } else {
      this.style.removeProperty("--rowan-form-layout-label-width");
    }

    this.style.setProperty("--rowan-form-field-label-align", this.labelAlign);
    this.#syncResponsiveLayout();
    this.#syncChildSpans();
  }

  #observeChildren() {
    if (this.#childObserver || typeof MutationObserver === "undefined") return;

    this.#childObserver = new MutationObserver(() => this.#syncChildSpans());
    const restore = () => {
      this.#childObserver.observe(this, {
        attributeFilter: ["span"],
        attributes: true,
        childList: true,
      });
    };

    this.observe(this.#childObserver, restore);
    restore();
  }

  #observeSize() {
    if (typeof ResizeObserver === "undefined") return;

    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => this.#queueResponsiveLayout());
      this.observe(this.#resizeObserver, () => this.#observeResponsiveSizeTargets());
    }

    this.#observeResponsiveSizeTargets();
  }

  #queueResponsiveLayout(attempt = 0) {
    if (this.#responsiveMarkerQueued) return;

    this.#responsiveMarkerQueued = true;
    const synchronize = () => {
      this.#responsiveMarkerQueued = false;
      if (this.isConnected) this.#syncResponsiveLayout(attempt);
    };

    setTimeout(synchronize);
  }

  #syncChildSpans() {
    const children = new Set(
      Array.from(this.children).filter((child) => child instanceof HTMLElement),
    );

    for (const [child] of this.#managedSpans) {
      if (!children.has(child) || !child.hasAttribute("span")) {
        this.#restoreChildSpan(child);
      }
    }

    for (const child of children) {
      const span = normalizeSpan(child.getAttribute("span"), this.#effectiveColumns);
      if (span === null) continue;

      if (!this.#managedSpans.has(child)) {
        this.#managedSpans.set(child, {
          value: child.style.getPropertyValue("--rowan-form-layout-item-span"),
          priority: child.style.getPropertyPriority("--rowan-form-layout-item-span"),
        });
      }

      child.style.setProperty("--rowan-form-layout-item-span", String(span));
    }

    this.#syncResponsiveMarkers();
  }

  #syncResponsiveLayout(attempt = 0) {
    if (!this.#layout || typeof getComputedStyle !== "function") return;

    const styles = getComputedStyle(this.#layout);
    const minimumColumnWidth = this.#inlineSize(this.#sizingProbe, styles.writingMode);
    const layoutInlineSize = this.#inlineSize(this.#layout, styles.writingMode);
    const combinedWidth = this.#inlineSize(this.#responsiveProbe, styles.writingMode);
    const gap = Math.max(0, combinedWidth - minimumColumnWidth);

    if (!Number.isFinite(minimumColumnWidth) || minimumColumnWidth <= 0 || layoutInlineSize <= 0) {
      if (attempt < 3) this.#queueResponsiveLayout(attempt + 1);
      return;
    }

    const effectiveColumns = Math.min(
      this.columns,
      Math.max(1, Math.floor((layoutInlineSize + gap) / (minimumColumnWidth + gap))),
    );

    if (effectiveColumns !== this.#effectiveColumns) {
      this.#setEffectiveColumns(effectiveColumns);
      this.#syncChildSpans();
    }

    this.#syncResponsiveMarkers(attempt);
  }

  #inlineSize(element, writingMode) {
    if (!element) return 0;

    const { height, width } = element.getBoundingClientRect();
    return writingMode.startsWith("vertical") || writingMode.startsWith("sideways")
      ? height
      : width;
  }

  #setEffectiveColumns(columns) {
    this.#effectiveColumns = columns;
    this.#layout.style.setProperty("--rowan-form-layout-effective-columns", String(columns));
  }

  #observeResponsiveSizeTargets() {
    if (!this.#resizeObserver) return;

    this.#resizeObserver.observe(this);
    if (this.#sizingProbe) this.#resizeObserver.observe(this.#sizingProbe);
    if (this.#responsiveProbe) this.#resizeObserver.observe(this.#responsiveProbe);
  }

  #clearManagedSpans() {
    for (const [child] of this.#managedSpans) {
      this.#restoreChildSpan(child);
    }
  }

  #restoreChildSpan(child) {
    const previous = this.#managedSpans.get(child);
    if (!previous) return;

    if (previous.value) {
      child.style.setProperty("--rowan-form-layout-item-span", previous.value, previous.priority);
    } else {
      child.style.removeProperty("--rowan-form-layout-item-span");
    }

    this.#managedSpans.delete(child);
  }

  #syncResponsiveMarkers(attempt = 0) {
    if (!this.#layout || typeof getComputedStyle !== "function") return;

    const gridTemplateColumns = getComputedStyle(this.#layout).gridTemplateColumns.trim();
    if (!gridTemplateColumns || gridTemplateColumns === "none") {
      if (attempt < 3) this.#queueResponsiveLayout(attempt + 1);
      return;
    }

    const isStacked = gridTemplateColumns.split(/\s+/).length <= 1;
    const children = new Set(
      Array.from(this.children).filter((child) => child instanceof HTMLElement),
    );

    for (const [child] of this.#managedResponsiveMarkers) {
      if (!children.has(child)) this.#restoreResponsiveMarker(child);
    }

    for (const child of children) {
      if (!this.#managedResponsiveMarkers.has(child)) {
        this.#managedResponsiveMarkers.set(
          child,
          child.hasAttribute("data-rowan-form-layout-stacked"),
        );
      }

      if (isStacked) {
        if (!child.hasAttribute("data-rowan-form-layout-stacked")) {
          child.setAttribute("data-rowan-form-layout-stacked", "");
        }
      } else if (
        !this.#managedResponsiveMarkers.get(child) &&
        child.hasAttribute("data-rowan-form-layout-stacked")
      ) {
        child.removeAttribute("data-rowan-form-layout-stacked");
      }
    }
  }

  #clearManagedResponsiveMarkers() {
    for (const [child] of this.#managedResponsiveMarkers) {
      this.#restoreResponsiveMarker(child);
    }
  }

  #restoreResponsiveMarker(child) {
    const hadAttribute = this.#managedResponsiveMarkers.get(child);
    if (hadAttribute === undefined) return;

    if (hadAttribute) {
      child.setAttribute("data-rowan-form-layout-stacked", "");
    } else {
      child.removeAttribute("data-rowan-form-layout-stacked");
    }

    this.#managedResponsiveMarkers.delete(child);
  }
}

define("rowan-form-layout", RowanFormLayout);
