import { expect } from "@esm-bundle/chai";

import "./app-layout.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-app-layout", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("composes named header and navigation slots with default main content", async () => {
    const layout = document.createElement("rowan-app-layout");
    const header = document.createElement("header");
    const navigation = document.createElement("nav");
    const content = document.createElement("article");
    header.slot = "header";
    navigation.slot = "navigation";
    layout.append(header, navigation, content);
    document.body.append(layout);
    await nextMicrotask();

    expect(
      layout.shadowRoot.querySelector('[part="header"] slot').assignedElements(),
    ).to.deep.equal([header]);
    expect(
      layout.shadowRoot.querySelector('[part="navigation"] slot').assignedElements(),
    ).to.deep.equal([navigation]);
    expect(
      layout.shadowRoot.querySelector('[part="content"] slot').assignedElements(),
    ).to.deep.equal([content]);
  });

  it("keeps property-driven navigation state silent and emits a composed change for toggle activation", async () => {
    const layout = document.createElement("rowan-app-layout");
    document.body.append(layout);
    await nextMicrotask();

    const toggle = layout.shadowRoot.querySelector(".navigation-toggle");
    const events = [];
    layout.addEventListener("rowan-change", (event) => {
      events.push({ detail: event.detail, bubbles: event.bubbles, composed: event.composed });
    });

    layout.navigationOpen = true;
    await nextMicrotask();
    expect(events).to.deep.equal([]);
    expect(toggle.getAttribute("aria-expanded")).to.equal("true");

    toggle.click();
    await nextMicrotask();

    expect(layout.navigationOpen).to.equal(false);
    expect(events).to.deep.equal([
      {
        detail: { navigationOpen: false, previousOpen: true },
        bubbles: true,
        composed: true,
      },
    ]);
  });

  it("makes compact navigation inert while closed and restores toggle focus after Escape", async () => {
    const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");
    const compactMedia = {
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: () => compactMedia,
    });

    try {
      const layout = document.createElement("rowan-app-layout");
      document.body.append(layout);
      await nextMicrotask();

      const navigation = layout.shadowRoot.querySelector(".navigation");
      const backdrop = layout.shadowRoot.querySelector(".backdrop");
      const toggle = layout.shadowRoot.querySelector(".navigation-toggle");
      toggle.style.display = "inline-flex";
      const events = [];
      layout.addEventListener("rowan-change", (event) => events.push(event.detail));

      expect(toggle.hidden).to.equal(false);
      expect(layout.shadowRoot.querySelector(".layout").classList.contains("is-compact")).to.equal(
        true,
      );
      expect(navigation.inert).to.equal(true);
      expect(navigation.getAttribute("aria-hidden")).to.equal("true");
      expect(backdrop.hidden).to.equal(true);
      expect(getComputedStyle(navigation).visibility).to.equal("hidden");
      expect(getComputedStyle(navigation).pointerEvents).to.equal("none");

      toggle.click();
      await nextMicrotask();
      expect(navigation.inert).to.equal(false);
      expect(navigation.getAttribute("aria-hidden")).to.equal("false");
      expect(backdrop.hidden).to.equal(false);

      toggle.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Escape" }),
      );
      await nextMicrotask();

      expect(layout.navigationOpen).to.equal(false);
      expect(navigation.inert).to.equal(true);
      expect(layout.shadowRoot.activeElement === toggle).to.equal(true);
      expect(events).to.deep.equal([
        { navigationOpen: true, previousOpen: false },
        { navigationOpen: false, previousOpen: true },
      ]);
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, "matchMedia", originalMatchMedia);
      } else {
        delete window.matchMedia;
      }
    }
  });

  it("reflects its navigation label into the navigation landmark and toggle name", async () => {
    const layout = document.createElement("rowan-app-layout");
    layout.navigationLabel = "Project sections";
    document.body.append(layout);
    await nextMicrotask();

    const navigation = layout.shadowRoot.querySelector(".navigation");
    const toggle = layout.shadowRoot.querySelector(".navigation-toggle");
    expect(layout.getAttribute("navigation-label")).to.equal("Project sections");
    expect(navigation.getAttribute("aria-label")).to.equal("Project sections");
    expect(toggle.getAttribute("aria-label")).to.equal("Toggle Project sections");
  });
});
