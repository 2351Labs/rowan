import { expect } from "@esm-bundle/chai";
import "../../../src/icon-button/icon-button.js";
import { createIcon } from "@rowan-ui/icons";
import { registerIcon, RowanIcon } from "@rowan-ui/icons/element";
import "@rowan-ui/icons/elements/calendar-days";
import "@rowan-ui/icons/elements/triangle-alert";

const nextMicrotask = () => Promise.resolve();

function luminance(color) {
  const channels = color
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map((channel) => {
      const normalized = Number(channel) / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

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

  it("applies tone through currentColor and keeps stroke-width", async () => {
    const icon = document.createElement("rowan-icon");
    icon.name = "calendar-days";
    icon.tone = "danger";
    icon.strokeWidth = 1.5;
    document.body.append(icon);
    await nextMicrotask();

    const stylesheet = icon.shadowRoot.querySelector('link[rel="stylesheet"]');
    if (stylesheet && !stylesheet.sheet) {
      await new Promise((resolve, reject) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", reject, { once: true });
      });
    }

    expect(icon.getAttribute("tone")).to.equal("danger");
    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("stroke")).to.equal("currentColor");
    expect(icon.shadowRoot.querySelector("svg")?.getAttribute("stroke-width")).to.equal("1.5");
    expect(getComputedStyle(icon).color).to.equal("rgb(180, 57, 45)");

    icon.tone = "none";
    expect(icon.hasAttribute("tone")).to.equal(false);
  });

  it("keeps toned icons readable on light and dark surfaces", async () => {
    const sheets = await Promise.all(
      ["../../../src/tokens/tokens.css", "../../../src/tokens/themes/dark.css"].map((path) => {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = new URL(path, import.meta.url).href;
        document.head.append(stylesheet);
        if (stylesheet.sheet) return Promise.resolve(stylesheet);
        return new Promise((resolve, reject) => {
          stylesheet.addEventListener("load", () => resolve(stylesheet), { once: true });
          stylesheet.addEventListener("error", reject, { once: true });
        });
      }),
    );

    try {
      for (const [theme, background] of [
        ["light", "rgb(248, 247, 242)"],
        ["dark", "rgb(17, 23, 20)"],
      ]) {
        for (const tone of ["info", "success", "warning", "danger"]) {
          const surface = document.createElement("div");
          if (theme === "dark") surface.dataset.theme = "dark";
          surface.style.background = "var(--rowan-color-bg)";
          surface.style.padding = "8px";
          const icon = document.createElement("rowan-icon");
          icon.name = "triangle-alert";
          icon.tone = tone;
          surface.append(icon);
          document.body.append(surface);
          await nextMicrotask();
          const stylesheet = icon.shadowRoot.querySelector('link[rel="stylesheet"]');
          if (stylesheet && !stylesheet.sheet) {
            await new Promise((resolve, reject) => {
              stylesheet.addEventListener("load", resolve, { once: true });
              stylesheet.addEventListener("error", reject, { once: true });
            });
          }
          expect(
            contrast(getComputedStyle(icon).color, background),
            `${theme} ${tone}`,
          ).to.be.at.least(3);
          surface.remove();
        }
      }
    } finally {
      sheets.forEach((sheet) => sheet.remove());
    }
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
