import { expect } from "@esm-bundle/chai";
import "./button.js";

const nextMicrotask = () => Promise.resolve();

async function waitForComponentStyles(element) {
  const stylesheet = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (!stylesheet) return;

  if (!stylesheet.sheet) {
    await new Promise((resolve, reject) => {
      stylesheet.addEventListener("load", resolve, { once: true });
      stylesheet.addEventListener(
        "error",
        () => reject(new Error("Button stylesheet failed to load.")),
        {
          once: true,
        },
      );
    });
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));
}

describe("rowan-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects variant and size between properties and attributes", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    element.variant = "danger";
    element.size = "lg";

    expect(element.getAttribute("variant")).to.equal("danger");
    expect(element.getAttribute("size")).to.equal("lg");

    element.setAttribute("variant", "secondary");
    element.setAttribute("size", "sm");

    expect(element.variant).to.equal("secondary");
    expect(element.size).to.equal("sm");
  });

  it("renders internal styling and composition hooks", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    const shadowRoot = element.shadowRoot;
    expect(shadowRoot.querySelector("button").classList.contains("button")).to.equal(true);
    expect(shadowRoot.querySelector('[part="prefix"]')).to.not.equal(null);
    expect(shadowRoot.querySelector('[part="suffix"]')).to.not.equal(null);
    expect(shadowRoot.querySelector('[part="spinner"]')).to.not.equal(null);
  });

  it("derives button defaults from a document-level semantic token", async () => {
    const root = document.documentElement;
    root.style.setProperty("--rowan-color-accent", "rgb(12 34 56)");

    try {
      const element = document.createElement("rowan-button");
      document.body.append(element);
      await nextMicrotask();
      await waitForComponentStyles(element);

      const internalButton = element.shadowRoot.querySelector("button");
      expect(getComputedStyle(element).getPropertyValue("--rowan-color-accent").trim()).to.equal(
        "rgb(12 34 56)",
      );
      expect(getComputedStyle(element).getPropertyValue("--rowan-button-bg").trim()).to.equal(
        "rgb(12 34 56)",
      );
      expect(getComputedStyle(internalButton).backgroundColor).to.equal("rgb(12, 34, 56)");
    } finally {
      root.style.removeProperty("--rowan-color-accent");
    }
  });

  it("honors document-level button tokens", async () => {
    const root = document.documentElement;
    root.style.setProperty("--rowan-button-bg", "rgb(12 34 56)");

    try {
      const element = document.createElement("rowan-button");
      document.body.append(element);
      await nextMicrotask();
      await waitForComponentStyles(element);

      const internalButton = element.shadowRoot.querySelector("button");
      expect(getComputedStyle(internalButton).backgroundColor).to.equal("rgb(12, 34, 56)");
    } finally {
      root.style.removeProperty("--rowan-button-bg");
    }
  });

  it("marks loading buttons busy and prevents activation", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    element.loading = true;
    await nextMicrotask();

    const internalButton = element.shadowRoot.querySelector("button");
    expect(internalButton.disabled).to.equal(true);
    expect(internalButton.getAttribute("aria-busy")).to.equal("true");

    internalButton.click();
    expect(eventCount).to.equal(0);

    element.loading = false;
    await nextMicrotask();

    expect(internalButton.disabled).to.equal(false);
    expect(internalButton.getAttribute("aria-busy")).to.equal("false");
  });

  it("emits rowan-click on activation", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    const internalButton = element.shadowRoot.querySelector("button");
    internalButton.click();

    expect(eventCount).to.equal(1);
  });

  it("keeps its activation listener after reconnecting", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    element.remove();
    document.body.append(element);
    await nextMicrotask();

    element.shadowRoot.querySelector("button").click();
    expect(eventCount).to.equal(1);
  });

  it("synchronizes state changed while detached after reconnecting", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    element.remove();
    element.disabled = true;
    await nextMicrotask();

    document.body.append(element);
    await nextMicrotask();

    expect(element.shadowRoot.querySelector("button").disabled).to.equal(true);
  });

  it("does not emit rowan-click when disabled", async () => {
    const element = document.createElement("rowan-button");
    element.disabled = true;
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-click", () => {
      eventCount += 1;
    });

    const internalButton = element.shadowRoot.querySelector("button");
    internalButton.click();

    expect(eventCount).to.equal(0);
  });
});
