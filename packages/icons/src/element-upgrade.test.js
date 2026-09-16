import { expect } from "@esm-bundle/chai";
import "../../../src/icon-button/icon-button.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-icon late custom-element upgrade", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("upgrades a core-only icon-button shorthand when an icon module loads later", async () => {
    expect(customElements.get("rowan-icon")).to.equal(undefined);

    document.body.innerHTML = `
      <rowan-icon-button icon="coffee" label="Brew coffee"></rowan-icon-button>
    `;
    await nextMicrotask();

    const button = document.querySelector("rowan-icon-button");
    const pendingIcon = button.shadowRoot.querySelector('rowan-icon[part="icon"]');
    expect(pendingIcon?.shadowRoot).to.equal(null);

    await import("@rowan-ui/icons/elements/coffee");
    await customElements.whenDefined("rowan-icon");
    await nextMicrotask();

    const upgradedIcon = button.shadowRoot.querySelector('rowan-icon[part="icon"]');
    expect(upgradedIcon?.shadowRoot?.querySelector("svg")?.getAttribute("data-icon")).to.equal(
      "coffee",
    );
    expect(button.shadowRoot.querySelector("slot")?.hidden).to.equal(true);
  });
});