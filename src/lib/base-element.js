import {
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
} from "./reflect.js";
import {
  componentTokenCssFor,
  rowanTokenStyleSheet,
  tokenCssText,
  tokenPropertiesRegistered,
  unregisteredTokenNames,
} from "../tokens/sheet.js";

const supportsAdoptedStyleSheets =
  typeof CSSStyleSheet !== "undefined" && "adoptedStyleSheets" in Document.prototype;
const componentTokenStyleSheets = new Map();

function componentTokenPrefixesFor(element) {
  return element.constructor.componentTokenPrefixes ?? [];
}

function componentTokenStyleSheetFor(cssText) {
  if (!cssText) return null;

  let stylesheet = componentTokenStyleSheets.get(cssText);
  if (stylesheet) return stylesheet;

  stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(cssText);
  componentTokenStyleSheets.set(cssText, stylesheet);
  return stylesheet;
}

function elementSuppliesComponentTokens(element) {
  if (typeof getComputedStyle !== "function") {
    return false;
  }

  const tokenPrefixes = componentTokenPrefixesFor(element);
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
    ...unregisteredTokenNames,
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
  #pendingUpgrades = [];
  #componentSheet = supportsAdoptedStyleSheets ? new CSSStyleSheet() : null;
  #componentTokenSheet = null;
  #componentLink = null;
  #tokenStyleTag = null;
  #componentStyleTag = null;
  #renderRoot = null;
  #formDisabled = false;
  #customValidityMessage = "";
  #constraintFlags = {};
  #constraintMessage = "";
  #constraintAnchor = undefined;
  #baseDisabledControls = new Set();
  #labelTextObserver = null;

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
    this.#listenForDisabledInteractions();
  }

  connectedCallback() {
    this.#refreshTokenStyles();
    this.#upgradePendingProperties();
    this.#restoreListeners();
    this.#restoreObservations();
    this.#observeExternalLabels();
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
    if (name === "disabled") this.#syncFormDisabledState();
    this.requestRender();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = Boolean(disabled);
    this.#syncFormDisabledState();
    this.requestRender();
  }

  get internals() {
    return this.#internals;
  }

  get renderRoot() {
    return this.#renderRoot;
  }

  get form() {
    return this.constructor.formAssociated ? (this.#internals?.form ?? null) : null;
  }

  get labels() {
    return this.constructor.formAssociated ? (this.#internals?.labels ?? null) : null;
  }

  get validity() {
    return this.constructor.formAssociated ? this.#internals?.validity : undefined;
  }

  get validationMessage() {
    return this.constructor.formAssociated ? (this.#internals?.validationMessage ?? "") : "";
  }

  get willValidate() {
    return this.constructor.formAssociated ? (this.#internals?.willValidate ?? false) : false;
  }

  /** Text of any `<label for>` bound to the host. `label`/`for` cannot cross a shadow boundary. */
  get externalLabelText() {
    const labels = this.constructor.formAssociated ? this.#internals?.labels : null;
    if (!labels || labels.length === 0) return "";

    return [...labels]
      .map((label) => label.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ");
  }

  setCustomValidity(message) {
    this.#customValidityMessage = String(message ?? "");
    this.#commitValidity();
    this.requestRender();
  }

  /** Applies validity with the consumer's custom error merged in, so renders cannot erase it. */
  applyValidity(flags = {}, message = "", anchor = undefined) {
    this.#constraintFlags = { ...flags };
    this.#constraintMessage = String(message ?? "");
    this.#constraintAnchor = anchor instanceof HTMLElement ? anchor : undefined;
    this.#commitValidity();
  }

  #commitValidity() {
    if (!this.#internals || typeof this.#internals.setValidity !== "function") return;

    const customMessage = this.#customValidityMessage;
    const nextFlags = customMessage
      ? { ...this.#constraintFlags, customError: true }
      : { ...this.#constraintFlags };
    const nextMessage = customMessage || this.#constraintMessage;
    const anchor = this.#constraintAnchor;

    if (anchor instanceof HTMLElement) {
      this.#internals.setValidity(nextFlags, nextMessage, anchor);
      return;
    }

    this.#internals.setValidity(nextFlags, nextMessage);
  }

  requestRender() {
    if (this.#renderQueued) return;

    this.#renderQueued = true;
    queueMicrotask(() => {
      this.#renderQueued = false;
      if (!this.isConnected) return;

      this.render();
      this.#syncFormDisabledState();
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
        (sheet) => sheet !== this.#componentTokenSheet && sheet !== rowanTokenStyleSheet,
      );

      if (this.#componentSheet && !componentSheets.includes(this.#componentSheet)) {
        componentSheets.push(this.#componentSheet);
      }

      this.shadowRoot.adoptedStyleSheets = componentSheets;

      const componentTokenCss = componentTokenCssFor(componentTokenPrefixesFor(this));
      const shouldApplyComponentTokenDefaults =
        tokenPropertiesRegistered &&
        componentTokenCss.length > 0 &&
        !elementSuppliesComponentTokens(this);
      const shouldApplyLegacyTokenDefaults =
        !tokenPropertiesRegistered && !documentSuppliesRowanTokens();
      this.#componentTokenSheet = shouldApplyComponentTokenDefaults
        ? componentTokenStyleSheetFor(componentTokenCss)
        : null;

      this.shadowRoot.adoptedStyleSheets = [
        ...(shouldApplyLegacyTokenDefaults ? [rowanTokenStyleSheet] : []),
        ...(this.#componentTokenSheet ? [this.#componentTokenSheet] : []),
        ...componentSheets,
      ];
      return;
    }

    this.#tokenStyleTag?.remove();
    this.#tokenStyleTag = null;

    const componentTokenCss = componentTokenCssFor(componentTokenPrefixesFor(this));
    const shouldApplyComponentTokenDefaults =
      tokenPropertiesRegistered &&
      componentTokenCss.length > 0 &&
      !elementSuppliesComponentTokens(this);
    const shouldApplyLegacyTokenDefaults =
      !tokenPropertiesRegistered && !documentSuppliesRowanTokens();
    const fallbackTokenCss = shouldApplyComponentTokenDefaults
      ? componentTokenCss
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

  #listenForDisabledInteractions() {
    const preventInteraction = (event) => {
      if (!this.#isEffectivelyDisabled()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    ["beforeinput", "click", "input", "change", "keydown"].forEach((type) => {
      this.listen(this.shadowRoot, type, preventInteraction, true);
    });
  }

  #isEffectivelyDisabled() {
    return this.#formDisabled || this.hasAttribute("disabled");
  }

  #syncFormDisabledState() {
    const disabled = this.#isEffectivelyDisabled();
    this.#renderRoot.inert = disabled;

    if (disabled) {
      this.shadowRoot.querySelectorAll("input, select, textarea, button").forEach((control) => {
        // Leave controls the component disabled on its own so they are not re-enabled later.
        if (control.disabled) return;

        control.disabled = true;
        this.#baseDisabledControls.add(control);
      });
    } else if (this.#baseDisabledControls.size > 0) {
      for (const control of this.#baseDisabledControls) {
        control.disabled = false;
      }

      this.#baseDisabledControls.clear();
    }

    if (
      !this.hasAttribute("aria-disabled") &&
      this.#internals &&
      "ariaDisabled" in this.#internals
    ) {
      this.#internals.ariaDisabled = disabled ? "true" : "false";
    }
  }

  #observeExternalLabels() {
    if (!this.constructor.formAssociated || typeof MutationObserver === "undefined") return;

    this.#syncLabelTextObservers();

    const adoptionObserver = new MutationObserver((mutations) => {
      if (!this.#externalLabelMutationAffectsHost(mutations)) return;
      this.#syncLabelTextObservers();
      this.requestRender();
    });

    adoptionObserver.observe(this, { attributes: true, attributeFilter: ["id"] });

    const root = this.getRootNode();
    const scope =
      root instanceof Document
        ? root.documentElement
        : root instanceof ShadowRoot
          ? root
          : document.documentElement;
    if (scope) {
      adoptionObserver.observe(scope, {
        attributeOldValue: true,
        attributes: true,
        attributeFilter: ["for"],
        childList: true,
        subtree: true,
      });
    }

    this.addCleanup(() => {
      adoptionObserver.disconnect();
      this.#labelTextObserver?.disconnect();
      this.#labelTextObserver = null;
    });
  }

  #syncLabelTextObservers() {
    this.#labelTextObserver?.disconnect();
    this.#labelTextObserver = null;

    const labels = this.#internals?.labels;
    if (!labels || labels.length === 0) return;

    this.#labelTextObserver = new MutationObserver(() => this.requestRender());
    for (const label of labels) {
      this.#labelTextObserver.observe(label, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  #externalLabelMutationAffectsHost(mutations) {
    const hostId = this.id;

    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "id" && mutation.target === this) {
        return true;
      }

      if (mutation.type === "attributes" && mutation.attributeName === "for") {
        const nextFor = mutation.target.getAttribute?.("for");
        if ((hostId && nextFor === hostId) || mutation.oldValue === hostId) return true;
      }

      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (this.#nodeAssociatesLabel(node, hostId)) return true;
        }
        for (const node of mutation.removedNodes) {
          if (this.#nodeAssociatesLabel(node, hostId)) return true;
        }
      }
    }

    return false;
  }

  #nodeAssociatesLabel(node, hostId) {
    if (!hostId) return false;

    if (node instanceof HTMLLabelElement) return node.htmlFor === hostId;

    if (node instanceof Element) {
      return Boolean(node.querySelector(`label[for="${CSS.escape(hostId)}"]`));
    }

    return false;
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
