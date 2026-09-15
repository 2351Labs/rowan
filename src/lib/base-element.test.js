import { expect } from "@esm-bundle/chai";
import { BaseElement } from "./base-element.js";

const nextTask = () => new Promise((resolve) => setTimeout(resolve));
const TEST_TAG = "rowan-base-element-observer-test";
const STATIC_STYLE_TEST_TAG = "rowan-base-element-static-style-test";
const TOKEN_FALLBACK_TEST_TAG = "rowan-base-element-token-fallback-test";
const STYLE_FALLBACK_TEST_TAG = "rowan-base-element-style-fallback-test";

class BaseElementObserverTest extends BaseElement {
  #target = null;
  #observer = null;
  #mutationCount = 0;

  get mutationCount() {
    return this.#mutationCount;
  }

  mutate() {
    this.#target.append(document.createElement("span"));
  }

  render() {
    if (this.#target) return;

    this.#target = document.createElement("div");
    this.renderRoot.append(this.#target);

    this.#observer = new MutationObserver(() => {
      this.#mutationCount += 1;
    });

    const restore = () => {
      this.#observer.observe(this.#target, { childList: true });
    };

    restore();
    this.observe(this.#observer, restore);
  }
}

class BaseElementStaticStyleTest extends BaseElement {
  static styles = ":host { --rowan-base-element-test-color: rebeccapurple; }";
}

class BaseElementTokenFallbackTest extends BaseElement {
  static componentTokenPrefixes = ["--rowan-button-"];
  static styles = ":host { color: var(--rowan-button-bg); }";
}

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, BaseElementObserverTest);
}

if (!customElements.get(STATIC_STYLE_TEST_TAG)) {
  customElements.define(STATIC_STYLE_TEST_TAG, BaseElementStaticStyleTest);
}

if (!customElements.get(TOKEN_FALLBACK_TEST_TAG)) {
  customElements.define(TOKEN_FALLBACK_TEST_TAG, BaseElementTokenFallbackTest);
}

describe("BaseElement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.style.removeProperty("--rowan-button-bg");
  });

  it("disconnects and restores configured observers across reconnection", async () => {
    const element = document.createElement(TEST_TAG);
    document.body.append(element);
    await nextTask();

    element.mutate();
    await nextTask();
    expect(element.mutationCount).to.equal(1);

    element.remove();
    element.mutate();
    await nextTask();
    expect(element.mutationCount).to.equal(1);

    document.body.append(element);
    await nextTask();
    element.mutate();
    await nextTask();

    expect(element.mutationCount).to.equal(2);
  });

  it("applies static and runtime component styles", async () => {
    const element = document.createElement(STATIC_STYLE_TEST_TAG);
    document.body.append(element);
    await nextTask();

    expect(
      getComputedStyle(element).getPropertyValue("--rowan-base-element-test-color").trim(),
    ).to.equal("rebeccapurple");

    element.setComponentStyles(":host { --rowan-base-element-test-color: seagreen; }");

    expect(
      getComputedStyle(element).getPropertyValue("--rowan-base-element-test-color").trim(),
    ).to.equal("seagreen");
  });

  it("falls back to style elements when constructable stylesheets are unavailable", async function () {
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "adoptedStyleSheets");
    if (descriptor && !descriptor.configurable) this.skip();

    delete Document.prototype.adoptedStyleSheets;

    try {
      const { BaseElement: FallbackBaseElement } =
        await import("./base-element.js?style-fallback-test");

      class BaseElementStyleFallbackTest extends FallbackBaseElement {
        static styles = ":host { --rowan-base-element-test-color: rebeccapurple; }";
      }

      if (!customElements.get(STYLE_FALLBACK_TEST_TAG)) {
        customElements.define(STYLE_FALLBACK_TEST_TAG, BaseElementStyleFallbackTest);
      }

      const element = document.createElement(STYLE_FALLBACK_TEST_TAG);
      document.body.append(element);
      await nextTask();

      expect(
        Array.from(element.shadowRoot.querySelectorAll("style")).some((style) =>
          style.textContent.includes("rebeccapurple"),
        ),
      ).to.equal(true);
      expect(
        getComputedStyle(element).getPropertyValue("--rowan-base-element-test-color").trim(),
      ).to.equal("rebeccapurple");

      element.setComponentStyles(":host { --rowan-base-element-test-color: seagreen; }");

      expect(
        getComputedStyle(element).getPropertyValue("--rowan-base-element-test-color").trim(),
      ).to.equal("seagreen");
    } finally {
      if (descriptor) {
        Object.defineProperty(Document.prototype, "adoptedStyleSheets", descriptor);
      }
    }
  });

  it("retains standalone component token defaults after connection", async () => {
    const element = document.createElement(TOKEN_FALLBACK_TEST_TAG);
    document.body.append(element);
    await nextTask();

    expect(getComputedStyle(element).color).to.equal("rgb(29, 67, 47)");
  });

  it("preserves host, wrapper, and root component token precedence", async () => {
    document.documentElement.style.setProperty("--rowan-button-bg", "rgb(20, 40, 30)");

    const wrapper = document.createElement("div");
    wrapper.style.setProperty("--rowan-button-bg", "rgb(30, 60, 45)");
    const wrappedElement = document.createElement(TOKEN_FALLBACK_TEST_TAG);
    wrapper.append(wrappedElement);

    const hostElement = document.createElement(TOKEN_FALLBACK_TEST_TAG);
    hostElement.style.setProperty("--rowan-button-bg", "rgb(40, 80, 60)");
    document.body.append(wrapper, hostElement);
    await nextTask();

    const standaloneElement = document.createElement(TOKEN_FALLBACK_TEST_TAG);
    document.body.append(standaloneElement);
    await nextTask();

    expect(getComputedStyle(wrappedElement).color).to.equal("rgb(30, 60, 45)");
    expect(getComputedStyle(hostElement).color).to.equal("rgb(40, 80, 60)");
    expect(getComputedStyle(standaloneElement).color).to.equal("rgb(20, 40, 30)");
  });
});
