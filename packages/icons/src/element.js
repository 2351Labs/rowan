const ICON_FACTORIES = new Map();
const CONNECTED_ICONS = new Set();
const ICON_REFRESHERS = new WeakMap();
const STYLE_URL = new URL("./element.css", import.meta.url).href;

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeName(value) {
  return normalizeString(value).toLowerCase();
}

const TONES = new Set(["none", "info", "success", "warning", "danger"]);

function normalizeTone(value) {
  const tone = normalizeName(value);
  return TONES.has(tone) ? tone : "none";
}

/**
 * Registers an icon factory for declarative `<rowan-icon>` use.
 *
 * Individual `@rowan-ui/icons/elements/<name>` imports call this for exactly
 * one icon, preserving the direct-import bundle boundary.
 *
 * @param {string} name
 * @param {(options?: import("./icon.js").IconOptions) => SVGSVGElement} factory
 */
export function registerIcon(name, factory) {
  const normalizedName = normalizeName(name);

  if (!normalizedName) {
    throw new TypeError("An icon name is required.");
  }

  if (typeof factory !== "function") {
    throw new TypeError("An icon factory function is required.");
  }

  ICON_FACTORIES.set(normalizedName, factory);

  for (const icon of CONNECTED_ICONS) {
    if (icon.name === normalizedName) ICON_REFRESHERS.get(icon)?.();
  }
}

/**
 * Declarative SVG icon registered by an individual `@rowan-ui/icons/elements/*` import.
 * @tag rowan-icon
 * @attr {string} name
 * @attr {string} size
 * @attr {string} stroke-width
 * @attr {string} label
 * @attr {"none"|"info"|"success"|"warning"|"danger"} tone
 * @csspart icon
 */
export class RowanIcon extends HTMLElement {
  static observedAttributes = ["name", "size", "stroke-width", "label", "tone"];

  #iconContainer = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", STYLE_URL);

    this.#iconContainer = document.createElement("span");
    this.shadowRoot.append(stylesheet, this.#iconContainer);
    ICON_REFRESHERS.set(this, () => this.#render());

    for (const property of ["name", "size", "strokeWidth", "label", "tone"]) {
      this.#upgradeProperty(property);
    }
  }

  connectedCallback() {
    CONNECTED_ICONS.add(this);
    this.#render();
  }

  disconnectedCallback() {
    CONNECTED_ICONS.delete(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.#render();
  }

  get name() {
    return normalizeName(this.getAttribute("name"));
  }

  set name(value) {
    this.#reflectString("name", normalizeName(value));
  }

  get size() {
    return normalizeString(this.getAttribute("size"));
  }

  set size(value) {
    this.#reflectString("size", normalizeString(value));
  }

  get strokeWidth() {
    return normalizeString(this.getAttribute("stroke-width"));
  }

  set strokeWidth(value) {
    this.#reflectString("stroke-width", normalizeString(value));
  }

  get label() {
    return normalizeString(this.getAttribute("label"));
  }

  set label(value) {
    this.#reflectString("label", normalizeString(value));
  }

  /** @returns {"none" | "info" | "success" | "warning" | "danger"} */
  get tone() {
    return normalizeTone(this.getAttribute("tone"));
  }

  /** @param {"none" | "info" | "success" | "warning" | "danger"} value */
  set tone(value) {
    const next = normalizeTone(value);
    this.#reflectString("tone", next === "none" ? "" : next);
  }

  #reflectString(attribute, value) {
    if (value) {
      this.setAttribute(attribute, value);
    } else {
      this.removeAttribute(attribute);
    }
  }

  #render() {
    const factory = ICON_FACTORIES.get(this.name);
    this.#iconContainer.replaceChildren();
    if (!factory) return;

    const options = {};
    if (this.size) options.size = this.size;
    if (this.strokeWidth) options.strokeWidth = this.strokeWidth;
    if (this.label) options.label = this.label;

    const icon = factory(options);
    if (!(icon instanceof SVGSVGElement)) {
      throw new TypeError("An icon factory must return an SVG element.");
    }

    icon.setAttribute("part", "icon");
    this.#iconContainer.append(icon);
  }

  #upgradeProperty(property) {
    if (!Object.prototype.hasOwnProperty.call(this, property)) return;

    const value = this[property];
    delete this[property];
    this[property] = value;
  }
}

if (!customElements.get("rowan-icon")) {
  customElements.define("rowan-icon", RowanIcon);
}
