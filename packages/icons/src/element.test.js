import { expect } from "@esm-bundle/chai";
import "../../../src/icon-button/icon-button.js";
import { createIcon } from "@rowan-ui/icons";
import { registerIcon, RowanIcon } from "@rowan-ui/icons/element";
import "@rowan-ui/icons/elements/calendar-days";

const nextMicrotask = () => Promise.resolve();

describe("rowan-icon", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a directly registered icon inside rowan-icon-button", async () => {
    const button = document.createElement("rowan-icon-button");
    const icon = document.createElement("rowan-icon");
    button.label = "Schedule";
    icon.name = "calendar-days";
    icon.size = 22;
    button.append(icon);
    document.body.append(button);
    await nextMicrotask();

    expect(icon).to.be.instanceOf(RowanIcon);
    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("data-icon")).to.equal(
      "calendar-days",
    );
    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("width")).to.equal("22");
    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("aria-hidden")).to.equal("true");
    expect(button.shadowRoot.querySelector("button")?.getAttribute("aria-label")).to.equal(
      "Schedule",
    );
  });

  it("renders an icon-button shorthand despite formatted light DOM whitespace", async () => {
    document.body.innerHTML = `
      <rowan-icon-button icon="calendar-days" label="Schedule">
      </rowan-icon-button>
    `;
    await nextMicrotask();

    const button = document.querySelector("rowan-icon-button");
    const icon = button.shadowRoot.querySelector('rowan-icon[part="icon"]');

    expect(icon?.shadowRoot.querySelector("svg")?.getAttribute("data-icon")).to.equal(
      "calendar-days",
    );
    expect(icon?.shadowRoot.querySelector("svg")?.getAttribute("aria-hidden")).to.equal("true");
    expect(button.shadowRoot.querySelector("slot")?.hidden).to.equal(true);
  });

  it("loads a button shorthand after a late icon-module import and restores custom content", async () => {
    const button = document.createElement("rowan-icon-button");
    const customIcon = document.createElement("span");
    customIcon.dataset.icon = "custom";
    button.icon = "coffee";
    button.append(customIcon);
    document.body.append(button);
    await nextMicrotask();

    const slot = button.shadowRoot.querySelector("slot");
    const icon = button.shadowRoot.querySelector('rowan-icon[part="icon"]');
    expect(icon?.shadowRoot.querySelector("svg")).to.equal(null);

    await import("@rowan-ui/icons/elements/coffee");

    expect(icon?.shadowRoot.querySelector("svg")?.getAttribute("data-icon")).to.equal("coffee");

    button.icon = "";
    await nextMicrotask();
    button.remove();
    document.body.append(button);
    await nextMicrotask();

    expect(slot?.hidden).to.equal(false);
    expect(icon?.hidden).to.equal(true);
    expect(slot?.assignedElements()[0]?.dataset.icon).to.equal("custom");
  });

  it("reflects icon options and keeps a labeled standalone icon meaningful", () => {
    const icon = document.createElement("rowan-icon");
    icon.name = "calendar-days";
    icon.strokeWidth = 1.5;
    icon.label = "Schedule";
    document.body.append(icon);

    const svg = icon.shadowRoot.querySelector("svg");
    expect(icon.getAttribute("stroke-width")).to.equal("1.5");
    expect(svg?.getAttribute("stroke-width")).to.equal("1.5");
    expect(svg?.getAttribute("role")).to.equal("img");
    expect(svg?.getAttribute("aria-label")).to.equal("Schedule");
  });

  it("refreshes connected icons when an application registers a factory", () => {
    const icon = document.createElement("rowan-icon");
    icon.name = "application-check";
    document.body.append(icon);

    expect(icon.shadowRoot.querySelector("svg")).to.equal(null);

    registerIcon("application-check", () =>
      createIcon({
        name: "application-check",
        nodes: [["path", { d: "m5 12 4 4L19 6" }]],
      }),
    );

    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("data-icon")).to.equal(
      "application-check",
    );
  });

  it("restores registered icon updates after reconnecting", () => {
    const icon = document.createElement("rowan-icon");
    icon.name = "reconnect-check";
    document.body.append(icon);
    icon.remove();
    document.body.append(icon);

    registerIcon("reconnect-check", () =>
      createIcon({
        name: "reconnect-check",
        nodes: [["path", { d: "m5 12 4 4L19 6" }]],
      }),
    );

    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("data-icon")).to.equal(
      "reconnect-check",
    );
  });

  it("rejects invalid declarative registrations", () => {
    expect(() => registerIcon("", () => document.createElementNS("", "svg"))).to.throw(
      TypeError,
      "An icon name is required",
    );
    expect(() => registerIcon("invalid", /** @type {any} */ (null))).to.throw(
      TypeError,
      "An icon factory function is required",
    );
  });
});
