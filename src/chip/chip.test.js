import { expect } from "@esm-bundle/chai";
import "./chip.js";

const nextMicrotask = () => Promise.resolve();

async function waitForStyles(element) {
  const styleLink = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (styleLink.sheet) return;

  await new Promise((resolve, reject) => {
    styleLink.addEventListener("load", resolve, { once: true });
    styleLink.addEventListener("error", reject, { once: true });
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

function loadThemeStylesheets() {
  return Promise.all(
    ["../tokens/tokens.css", "../tokens/themes/light.css", "../tokens/themes/dark.css"].map(
      loadStylesheet,
    ),
  );
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

describe("rowan-chip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects tone and size", async () => {
    const el = document.createElement("rowan-chip");
    document.body.append(el);
    await nextMicrotask();

    el.tone = "warning";
    el.size = "lg";

    expect(el.getAttribute("tone")).to.equal("warning");
    expect(el.getAttribute("size")).to.equal("lg");
  });

  it("normalizes unsupported tone and size to documented defaults", async () => {
    const el = document.createElement("rowan-chip");
    el.tone = "loud";
    el.size = "xl";
    document.body.append(el);
    await nextMicrotask();

    expect(el.tone).to.equal("info");
    expect(el.size).to.equal("md");
    expect(el.hasAttribute("tone")).to.equal(false);
    expect(el.hasAttribute("size")).to.equal(false);

    el.setAttribute("tone", " DANGER ");
    el.setAttribute("size", " SM ");
    expect(el.tone).to.equal("danger");
    expect(el.size).to.equal("sm");
    expect(el.getAttribute("tone")).to.equal("danger");
    expect(el.getAttribute("size")).to.equal("sm");
  });

  it("uses public tokens for its rendered surfaces", async () => {
    const el = document.createElement("rowan-chip");
    el.style.setProperty("--rowan-chip-bg", "rgb(24, 48, 32)");
    el.style.setProperty("--rowan-chip-border", "rgb(72, 96, 80)");
    el.style.setProperty("--rowan-chip-fg", "rgb(240, 244, 238)");
    document.body.append(el);
    await nextMicrotask();
    await waitForStyles(el);

    const chip = el.shadowRoot.querySelector(".chip");
    const styles = getComputedStyle(chip);

    expect(styles.backgroundColor).to.equal("rgb(24, 48, 32)");
    expect(styles.borderTopColor).to.equal("rgb(72, 96, 80)");
    expect(styles.color).to.equal("rgb(240, 244, 238)");
  });

  it("inherits AA-contrast surfaces from the shipped dark theme", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const theme = document.createElement("div");
      theme.setAttribute("data-theme", "dark");
      const chips = ["info", "success", "warning", "danger"].map((tone) => {
        const chip = document.createElement("rowan-chip");
        chip.tone = tone;
        theme.append(chip);
        return chip;
      });
      document.body.append(theme);
      await nextMicrotask();
      await Promise.all(chips.map(waitForStyles));

      for (const chip of chips) {
        const styles = getComputedStyle(chip.shadowRoot.querySelector(".chip"));
        expect(contrastRatio(styles.color, styles.backgroundColor)).to.be.at.least(4.5);
      }
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("lets a nested light theme override dark Chip tokens", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const darkTheme = document.createElement("div");
      darkTheme.setAttribute("data-theme", "dark");
      const lightTheme = document.createElement("div");
      lightTheme.setAttribute("data-theme", "light");
      const nestedChip = document.createElement("rowan-chip");
      lightTheme.append(nestedChip);
      darkTheme.append(lightTheme);

      const referenceTheme = document.createElement("div");
      referenceTheme.setAttribute("data-theme", "light");
      const referenceChip = document.createElement("rowan-chip");
      referenceTheme.append(referenceChip);

      document.body.append(darkTheme, referenceTheme);
      await nextMicrotask();
      await Promise.all([nestedChip, referenceChip].map(waitForStyles));

      const nestedStyles = getComputedStyle(nestedChip.shadowRoot.querySelector(".chip"));
      const referenceStyles = getComputedStyle(referenceChip.shadowRoot.querySelector(".chip"));

      expect(nestedStyles.backgroundColor).to.equal(referenceStyles.backgroundColor);
      expect(nestedStyles.borderTopColor).to.equal(referenceStyles.borderTopColor);
      expect(nestedStyles.color).to.equal(referenceStyles.color);
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
