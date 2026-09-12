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
});
