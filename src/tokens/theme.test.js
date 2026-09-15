import { expect } from "@esm-bundle/chai";
import "../calendar/calendar.js";
import "../card/card.js";
import "../chip/chip.js";
import "../date-picker/date-picker.js";
import "../dialog/dialog.js";
import { componentTokenCssFor } from "./sheet.js";

const nextTask = () => Promise.resolve();

async function waitForStyles(element) {
  const stylesheet = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (stylesheet.sheet) return;

  await new Promise((resolve, reject) => {
    stylesheet.addEventListener("load", resolve, { once: true });
    stylesheet.addEventListener("error", reject, { once: true });
  });
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

function relativeLuminance(color) {
  const channels = color
    .match(/\d+(?:\.\d+)?/g)
    .slice(0, 3)
    .map(Number);
  const [red, green, blue] = channels.map((channel) => {
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

      theme.append(chip, card, datePicker, calendar, dialog);
      document.body.append(theme);
      await nextTask();
      await Promise.all([chip, card, datePicker, calendar, dialog].map(waitForStyles));

      for (const [element, selector] of [
        [chip, ".chip"],
        [card, ".card"],
        [datePicker, ".input"],
        [calendar, ".calendar"],
        [dialog, ".panel"],
      ]) {
        const styles = getComputedStyle(element.shadowRoot.querySelector(selector));
        expect(contrastRatio(styles.color, styles.backgroundColor)).to.be.at.least(4.5);
      }
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
