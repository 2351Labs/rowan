import {
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
} from "./reflect.js";
import {
  componentTokenCssText,
  rowanComponentTokenStyleSheet,
  rowanTokenStyleSheet,
  tokenCssText,
  tokenPropertiesRegistered,
  unregisteredTokenNames,
} from "../tokens/sheet.js";

const supportsAdoptedStyleSheets =
  typeof CSSStyleSheet !== "undefined" && "adoptedStyleSheets" in Document.prototype;

function elementSuppliesComponentTokens(element) {
  if (typeof getComputedStyle !== "function") {
    return false;
  }

  const tokenPrefixes = element.constructor.componentTokenPrefixes ?? [];
  if (tokenPrefixes.length === 0) {
    return false;
  }

  const styles = getComputedStyle(element);
  return unregisteredTokenNames
    .filter((name) => tokenPrefixes.some((prefix) => name.startsWith(prefix)))
    .some((name) => styles.getPropertyValue(name).trim().length > 0);
}

function documentSuppliesRowanTokens() {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return false;
  }

  const root = document.documentElement;
  if (!root) return false;

  return [
    "--rowan-color-bg",
    "--rowan-color-fg",
    "--rowan-color-accent",
    "--rowan-color-border",
    "--rowan-font-family",
    "--rowan-space-1",
  ].some((name) => getComputedStyle(root).getPropertyValue(name).trim().length > 0);
}

export class BaseElement extends HTMLElement {
  static shadowRootOptions = { mode: "open" };
  static styles = "";
  static styleUrl = "";
  static observedAttributes = [];
  static formAssociated = false;
  static useElementInternals = false;
  static upgradeProperties = [];
  static componentTokenPrefixes = [];

  #internals = null;
  #cleanup = new Set();
  #listeners = new Set();
  #observations = new Set();
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
    this.#refreshTokenStyles();
    this.#upgradePendingProperties();
    this.#restoreListeners();
    this.#restoreObservations();
    this.requestRender();
  }

  disconnectedCallback() {
    this.#disconnectListeners();
    this.#disconnectObservations();

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
    const listener = { target, type, handler, options, connected: false };
    this.#listeners.add(listener);
    this.#connectListener(listener);

    return () => {
      this.#disconnectListener(listener);
      this.#listeners.delete(listener);
    };
  }

  observe(observer, restore) {
    const observation = {
      observer,
      restore: typeof restore === "function" ? restore : null,
    };
    this.#observations.add(observation);

    return () => {
      observer.disconnect();
      this.#observations.delete(observation);
    };
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

  #restoreListeners() {
    for (const listener of this.#listeners) {
      this.#connectListener(listener);
    }
  }

  #disconnectListeners() {
    for (const listener of this.#listeners) {
      this.#disconnectListener(listener);
    }
  }

  #connectListener(listener) {
    if (listener.connected) return;

    listener.target.addEventListener(listener.type, listener.handler, listener.options);
    listener.connected = true;
  }

  #disconnectListener(listener) {
    if (!listener.connected) return;

    listener.target.removeEventListener(listener.type, listener.handler, listener.options);
    listener.connected = false;
  }

  #restoreObservations() {
    for (const observation of this.#observations) {
      observation.restore?.();
    }
  }

  #disconnectObservations() {
    for (const observation of this.#observations) {
      observation.observer.disconnect();
      if (!observation.restore) {
        this.#observations.delete(observation);
      }
    }
  }

  #applyStyleSheets() {
    const styleUrl = this.constructor.styleUrl;
    const hasStyleUrl = typeof styleUrl === "string" && styleUrl.length > 0;

    const styles = this.constructor.styles;
    const normalizedCss = Array.isArray(styles) ? styles.join("\n") : (styles ?? "");
    const hasInlineStyles = !hasStyleUrl && normalizedCss.length > 0;

    if (supportsAdoptedStyleSheets) {
      if (hasInlineStyles && this.#componentSheet) {
        this.#componentSheet.replaceSync(normalizedCss);
      }
    } else {
      if (hasInlineStyles) {
        this.#componentStyleTag = document.createElement("style");
        this.#componentStyleTag.textContent = normalizedCss;
        this.shadowRoot.append(this.#componentStyleTag);
      }
    }

    this.#refreshTokenStyles();

    if (hasStyleUrl) {
      this.#componentLink = document.createElement("link");
      this.#componentLink.rel = "stylesheet";
      this.#componentLink.href = styleUrl;
      this.shadowRoot.append(this.#componentLink);
    }
  }

  #refreshTokenStyles() {
    if (supportsAdoptedStyleSheets) {
      const componentSheets = this.shadowRoot.adoptedStyleSheets.filter(
        (sheet) => sheet !== rowanComponentTokenStyleSheet && sheet !== rowanTokenStyleSheet,
      );
      this.shadowRoot.adoptedStyleSheets = componentSheets;

      const shouldApplyComponentTokenDefaults =
        tokenPropertiesRegistered && !elementSuppliesComponentTokens(this);
      const shouldApplyLegacyTokenDefaults =
        !tokenPropertiesRegistered && !documentSuppliesRowanTokens();
      const tokenSheet = shouldApplyComponentTokenDefaults
        ? rowanComponentTokenStyleSheet
        : shouldApplyLegacyTokenDefaults
          ? rowanTokenStyleSheet
          : null;

      this.shadowRoot.adoptedStyleSheets = tokenSheet
        ? [tokenSheet, ...componentSheets]
        : componentSheets;
      return;
    }

    this.#tokenStyleTag?.remove();
    this.#tokenStyleTag = null;

    const shouldApplyComponentTokenDefaults =
      tokenPropertiesRegistered && !elementSuppliesComponentTokens(this);
    const shouldApplyLegacyTokenDefaults =
      !tokenPropertiesRegistered && !documentSuppliesRowanTokens();
    const fallbackTokenCss = shouldApplyComponentTokenDefaults
      ? componentTokenCssText
      : shouldApplyLegacyTokenDefaults
        ? tokenCssText
        : "";

    if (!fallbackTokenCss) return;

    this.#tokenStyleTag = document.createElement("style");
    this.shadowRoot.prepend(this.#tokenStyleTag);

    this.#tokenStyleTag.textContent = fallbackTokenCss;
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
