import {
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
} from "./reflect.js";
import { rowanTokenStyleSheet, tokenCssText } from "../tokens/sheet.js";

const supportsAdoptedStyleSheets =
  typeof CSSStyleSheet !== "undefined" && "adoptedStyleSheets" in Document.prototype;

export class BaseElement extends HTMLElement {
  static shadowRootOptions = { mode: "open" };
  static styles = "";
  static styleUrl = "";
  static observedAttributes = [];
  static formAssociated = false;
  static useElementInternals = false;
  static upgradeProperties = [];

  #internals = null;
  #cleanup = new Set();
  #renderQueued = false;
  #didFirstRender = false;
  #pendingUpgrades = [];
  #componentSheet = supportsAdoptedStyleSheets ? new CSSStyleSheet() : null;
  #componentLink = null;
  #tokenStyleTag = null;
  #componentStyleTag = null;
  #renderRoot = null;

  constructor() {
    super();

    const shadowOptions = {
      mode: "open",
      ...this.constructor.shadowRootOptions,
    };
    this.attachShadow(shadowOptions);

    this.#capturePreUpgradeProperties();

    const shouldAttachInternals =
      (this.constructor.formAssociated || this.constructor.useElementInternals) &&
      typeof this.attachInternals === "function";

    if (shouldAttachInternals) {
      this.#internals = this.attachInternals();
    }

    this.#applyStyleSheets();
    this.#createRenderRoot();
  }

  connectedCallback() {
    this.#upgradePendingProperties();
    if (!this.#didFirstRender) {
      this.requestRender();
    }
  }

  disconnectedCallback() {
    for (const cleanup of this.#cleanup) {
      cleanup();
    }

    this.#cleanup.clear();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.requestRender();
  }

  get internals() {
    return this.#internals;
  }

  get renderRoot() {
    return this.#renderRoot;
  }

  requestRender() {
    if (this.#renderQueued) return;

    this.#renderQueued = true;
    queueMicrotask(() => {
      this.#renderQueued = false;
      if (!this.isConnected) return;

      this.render();
      this.#didFirstRender = true;
    });
  }

  render() {}

  setComponentStyles(cssText) {
    const normalizedCss = cssText ?? "";

    if (supportsAdoptedStyleSheets && this.#componentSheet) {
      this.#componentSheet.replaceSync(normalizedCss);
      return;
    }

    if (!this.#componentStyleTag) {
      this.#componentStyleTag = document.createElement("style");
      this.shadowRoot.append(this.#componentStyleTag);
    }

    this.#componentStyleTag.textContent = normalizedCss;
  }

  addCleanup(cleanup) {
    this.#cleanup.add(cleanup);
    return () => this.#cleanup.delete(cleanup);
  }

  listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return this.addCleanup(() => target.removeEventListener(type, handler, options));
  }

  observe(observer) {
    return this.addCleanup(() => observer.disconnect());
  }

  reflectBoolean(attributeName, value) {
    reflectBooleanAttribute(this, attributeName, value);
  }

  reflectString(attributeName, value) {
    reflectStringAttribute(this, attributeName, value);
  }

  reflectNumber(attributeName, value) {
    reflectNumberAttribute(this, attributeName, value);
  }

  readBoolean(attributeName) {
    return readBooleanAttribute(this, attributeName);
  }

  readString(attributeName, fallback = "") {
    return readStringAttribute(this, attributeName, fallback);
  }

  readNumber(attributeName, fallback = 0) {
    return readNumberAttribute(this, attributeName, fallback);
  }

  #applyStyleSheets() {
    const styleUrl = this.constructor.styleUrl;
    const hasStyleUrl = typeof styleUrl === "string" && styleUrl.length > 0;

    const styles = this.constructor.styles;
    const normalizedCss = Array.isArray(styles) ? styles.join("\n") : (styles ?? "");
    const hasInlineStyles = !hasStyleUrl && normalizedCss.length > 0;

    if (supportsAdoptedStyleSheets) {
      const sheets = [];

      if (rowanTokenStyleSheet) {
        sheets.push(rowanTokenStyleSheet);
      }

      if (hasInlineStyles && this.#componentSheet) {
        this.#componentSheet.replaceSync(normalizedCss);
        sheets.push(this.#componentSheet);
      }

      this.shadowRoot.adoptedStyleSheets = sheets;
    } else {
      this.#tokenStyleTag = document.createElement("style");
      this.#tokenStyleTag.textContent = tokenCssText;
      this.shadowRoot.append(this.#tokenStyleTag);

      if (hasInlineStyles) {
        this.#componentStyleTag = document.createElement("style");
        this.#componentStyleTag.textContent = normalizedCss;
        this.shadowRoot.append(this.#componentStyleTag);
      }
    }

    if (hasStyleUrl) {
      this.#componentLink = document.createElement("link");
      this.#componentLink.rel = "stylesheet";
      this.#componentLink.href = styleUrl;
      this.shadowRoot.append(this.#componentLink);
    }
  }

  #createRenderRoot() {
    this.#renderRoot = document.createElement("div");
    this.#renderRoot.setAttribute("data-rowan-render-root", "");
    this.shadowRoot.append(this.#renderRoot);
  }

  #capturePreUpgradeProperties() {
    const configuredProperties = this.constructor.upgradeProperties ?? [];

    this.#pendingUpgrades = configuredProperties.filter((propertyName) =>
      Object.prototype.hasOwnProperty.call(this, propertyName),
    );
  }

  #upgradePendingProperties() {
    for (const propertyName of this.#pendingUpgrades) {
      const value = this[propertyName];
      delete this[propertyName];
      this[propertyName] = value;
    }

    this.#pendingUpgrades = [];
  }
}
