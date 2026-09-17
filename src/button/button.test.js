import { expect } from "@esm-bundle/chai";
import "./button.js";

const nextMicrotask = () => Promise.resolve();

async function waitForComponentStyles(element, expectedBackground = "") {
  const stylesheet = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  const button = element.shadowRoot.querySelector("button");
  if (!stylesheet || !button) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    const styles = getComputedStyle(button);
    const backgroundMatches = !expectedBackground || styles.backgroundColor === expectedBackground;
    if (hasLoadedRules() && styles.display === "inline-flex" && backgroundMatches) {
      return;
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  throw new Error("Button styles did not apply within 60 animation frames.");
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

  it("treats disabled=\"false\" as unset", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    element.setAttribute("disabled", "false");
    expect(element.hasAttribute("disabled")).to.equal(false);
    expect(element.disabled).to.equal(false);
  });

  it("normalizes unsupported variant, size, and type to documented defaults", async () => {
    const element = document.createElement("rowan-button");
    element.variant = "loud";
    element.size = "xl";
    element.type = "link";
    document.body.append(element);
    await nextMicrotask();

    expect(element.variant).to.equal("primary");
    expect(element.size).to.equal("md");
    expect(element.type).to.equal("button");
    expect(element.hasAttribute("variant")).to.equal(false);
    expect(element.hasAttribute("size")).to.equal(false);
    expect(element.hasAttribute("type")).to.equal(false);

    element.setAttribute("variant", " GHOST ");
    element.setAttribute("size", " SM ");
    element.setAttribute("type", " SUBMIT ");
    expect(element.variant).to.equal("ghost");
    expect(element.size).to.equal("sm");
    expect(element.type).to.equal("submit");
    expect(element.getAttribute("variant")).to.equal("ghost");
    expect(element.getAttribute("size")).to.equal("sm");
    expect(element.getAttribute("type")).to.equal("submit");
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
      await waitForComponentStyles(element, "rgb(12, 34, 56)");

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
      await waitForComponentStyles(element, "rgb(12, 34, 56)");

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

  it("forwards popup state from the host to its native control", async () => {
    const element = document.createElement("rowan-button");
    document.body.append(element);
    await nextMicrotask();

    const internalButton = element.shadowRoot.querySelector("button");
    element.setAttribute("aria-expanded", "false");
    element.setAttribute("aria-haspopup", "menu");
    await nextMicrotask();

    expect(internalButton.getAttribute("aria-expanded")).to.equal("false");
    expect(internalButton.getAttribute("aria-haspopup")).to.equal("menu");

    element.removeAttribute("aria-expanded");
    element.removeAttribute("aria-haspopup");
    await nextMicrotask();

    expect(internalButton.hasAttribute("aria-expanded")).to.equal(false);
    expect(internalButton.hasAttribute("aria-haspopup")).to.equal(false);
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

  it("submits and resets its associated light-DOM form", async () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const submit = document.createElement("rowan-button");
    const reset = document.createElement("rowan-button");
    input.defaultValue = "Pine";
    input.value = "Cedar";
    submit.type = "submit";
    reset.type = "reset";
    form.append(input, submit, reset);
    document.body.append(form);
    await nextMicrotask();

    let submitCount = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitCount += 1;
    });

    submit.shadowRoot.querySelector("button").click();
    reset.shadowRoot.querySelector("button").click();

    expect(submitCount).to.equal(1);
    expect(input.value).to.equal("Pine");
  });
});
