import { expect } from "@esm-bundle/chai";
import "../calendar/calendar.js";
import "../card/card.js";
import "../chip/chip.js";
import "../date-picker/date-picker.js";
import "../dialog/dialog.js";
import "../stepper/stepper.js";
import "../switch/switch.js";
import { componentTokenCssFor } from "./sheet.js";

const nextTask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

// Waits for the shadow tree to exist and for style recalc to land, not just for the link.
async function waitForStyles(element) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const stylesheet = element.shadowRoot?.querySelector('link[rel="stylesheet"]');

    if (stylesheet?.sheet) {
      await nextFrame();
      return;
    }

    if (stylesheet) {
      await new Promise((resolve, reject) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", reject, { once: true });
      });
      await nextFrame();
      return;
    }

    await nextFrame();
  }

  throw new Error(`stylesheet never loaded for <${element.localName}>`);
}

// Waits for the value the assertion reads, rather than for a proxy like the link's sheet.
async function paintedBackground(element, selector) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const { backgroundColor } = getComputedStyle(element.shadowRoot.querySelector(selector));

    if (backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
      return backgroundColor;
    }

    await nextFrame();
  }

  throw new Error(`background never painted for <${element.localName}> ${selector}`);
}

async function loadStylesheet(path) {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL(path, import.meta.url).href;
  document.head.append(stylesheet);

  if (!stylesheet.sheet) {
    await new Promise((resolve, reject) => {
      stylesheet.addEventListener("load", resolve, { once: true });
      stylesheet.addEventListener("error", reject, { once: true });
    });
  }

  return stylesheet;
}

function parseColorChannels(color) {
  const srgbMatch = color.match(/^color\(srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/);
  if (srgbMatch) {
    return srgbMatch.slice(1, 4).map((channel) => Number(channel) * 255);
  }

  return color
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number);
}

function relativeLuminance(color) {
  const [red, green, blue] = parseColorChannels(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Rowan themes", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("scopes standalone component defaults to declared token prefixes", () => {
    const buttonTokens = componentTokenCssFor(["--rowan-button-"]);

    expect(buttonTokens).to.include("--rowan-button-bg");
    expect(buttonTokens).to.not.include("--rowan-card-bg");
    expect(componentTokenCssFor([])).to.equal("");
  });

  it("provides AA-contrast surfaces to components in a dark theme wrapper", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./themes/dark.css"].map(loadStylesheet),
    );

    try {
      const theme = document.createElement("div");
      theme.setAttribute("data-theme", "dark");

      const chip = document.createElement("rowan-chip");
      chip.textContent = "Dark chip";
      const card = document.createElement("rowan-card");
      card.textContent = "Dark card";
      const datePicker = document.createElement("rowan-date-picker");
      datePicker.label = "Review date";
      const calendar = document.createElement("rowan-calendar");
      const dialog = document.createElement("rowan-dialog");
      dialog.textContent = "Dark dialog";
      const stepper = document.createElement("rowan-stepper");
      stepper.steps = ["One", "Two"];

      theme.append(chip, card, datePicker, calendar, dialog, stepper);
      document.body.append(theme);
      await nextTask();
      await Promise.all([chip, card, datePicker, calendar, dialog, stepper].map(waitForStyles));

      for (const [element, selector] of [
        [chip, ".chip"],
        [card, ".card"],
        [datePicker, ".input"],
        [calendar, ".calendar"],
        [dialog, ".panel"],
        [stepper, ".step.is-current .step-button"],
      ]) {
        const styles = getComputedStyle(element.shadowRoot.querySelector(selector));
        expect(contrastRatio(styles.color, styles.backgroundColor)).to.be.at.least(4.5);
      }
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps the switch thumb distinguishable from its track in both themes", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./themes/dark.css"].map(loadStylesheet),
    );

    try {
      for (const themeName of ["light", "dark"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);

        const off = document.createElement("rowan-switch");
        const on = document.createElement("rowan-switch");
        on.checked = true;

        theme.append(off, on);
        document.body.append(theme);
        await nextTask();

        // SC 1.4.11: the thumb is the affordance that conveys state, so it needs 3:1 on its track.
        for (const element of [off, on]) {
          const track = await paintedBackground(element, ".track");
          const thumb = await paintedBackground(element, ".thumb");
          expect(contrastRatio(thumb, track)).to.be.at.least(3);
        }

        theme.remove();
      }
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("stays readable when a consumer themes only the semantic layer", async () => {
    const themeStylesheet = await loadStylesheet("./tokens.css");
    const consumerTheme = document.createElement("style");
    consumerTheme.textContent = `
      [data-theme="consumer-dark"] {
        --rowan-color-bg: #111714;
        --rowan-color-fg: #ecf0e9;
        --rowan-color-muted: #bec7bc;
        --rowan-color-accent: #7fc095;
        --rowan-color-border: #2f3d35;
        --rowan-color-danger: #e37f74;
      }
    `;
    document.head.append(consumerTheme);
    document.documentElement.setAttribute("data-theme", "consumer-dark");

    try {
      const chip = document.createElement("rowan-chip");
      chip.textContent = "Dark chip";
      const card = document.createElement("rowan-card");
      card.textContent = "Dark card";
      const datePicker = document.createElement("rowan-date-picker");
      datePicker.label = "Review date";
      const dialog = document.createElement("rowan-dialog");
      dialog.textContent = "Dark dialog";

      document.body.append(chip, card, datePicker, dialog);
      await nextTask();
      await Promise.all([chip, card, datePicker, dialog].map(waitForStyles));

      for (const [element, selector] of [
        [chip, ".chip"],
        [card, ".card"],
        [datePicker, ".input"],
        [dialog, ".panel"],
      ]) {
        const styles = getComputedStyle(element.shadowRoot.querySelector(selector));
        expect(contrastRatio(styles.color, styles.backgroundColor)).to.be.at.least(4.5);
      }
    } finally {
      document.documentElement.removeAttribute("data-theme");
      consumerTheme.remove();
      themeStylesheet.remove();
    }
  });
});
