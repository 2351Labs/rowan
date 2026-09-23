import { expect } from "@esm-bundle/chai";
import "../button/button.js";
import "../kpi-card/kpi-card.js";
import "../gauge-chart/gauge-chart.js";

const nextTask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

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

function rgb(color) {
  return parseColorChannels(color)
    .slice(0, 3)
    .map((channel) => Math.round(channel));
}

function samplePalette(root) {
  const button = document.createElement("rowan-button");
  button.textContent = "Save";
  const card = document.createElement("rowan-kpi-card");
  card.label = "Utilization";
  card.tone = "warning";
  card.value = 72;
  card.delta = -8;
  const chart = document.createElement("rowan-gauge-chart");
  chart.ranges = [{ from: 80, to: 100, label: "Good", tone: "success" }];
  chart.value = 90;
  root.append(button, card, chart);
  return { button, card, chart };
}

describe("vibrant chart palette", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("recolors chart tones without changing UI chrome", async () => {
    const sheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./charts-vibrant.css"].map(loadStylesheet),
    );

    try {
      const rowan = document.createElement("div");
      const vibrant = document.createElement("div");
      vibrant.dataset.rowanCharts = "vibrant";

      const rowanParts = samplePalette(rowan);
      const vibrantParts = samplePalette(vibrant);
      document.body.append(rowan, vibrant);
      await nextTask();
      await Promise.all(
        [
          rowanParts.button,
          rowanParts.card,
          rowanParts.chart,
          vibrantParts.button,
          vibrantParts.card,
          vibrantParts.chart,
        ].map(waitForStyles),
      );
      await nextTask();
      await nextFrame();

      const rowanButton = getComputedStyle(rowanParts.button.shadowRoot.querySelector(".button"));
      const vibrantButton = getComputedStyle(
        vibrantParts.button.shadowRoot.querySelector(".button"),
      );
      expect(rgb(vibrantButton.backgroundColor)).to.deep.equal(rgb(rowanButton.backgroundColor));

      const rowanDelta = getComputedStyle(rowanParts.card.shadowRoot.querySelector(".delta"));
      const vibrantDelta = getComputedStyle(vibrantParts.card.shadowRoot.querySelector(".delta"));
      expect(rgb(vibrantDelta.color)).to.not.deep.equal(rgb(rowanDelta.color));

      const rowanBand = getComputedStyle(
        rowanParts.chart.shadowRoot.querySelector(".range[data-tone='success']"),
      );
      const vibrantBand = getComputedStyle(
        vibrantParts.chart.shadowRoot.querySelector(".range[data-tone='success']"),
      );
      expect(rgb(vibrantBand.stroke)).to.not.deep.equal(rgb(rowanBand.stroke));

      const cardBg = getComputedStyle(vibrantParts.card.shadowRoot.querySelector(".card"));
      expect(contrastRatio(vibrantDelta.color, cardBg.backgroundColor)).to.be.at.least(4.5);
    } finally {
      sheets.forEach((sheet) => sheet.remove());
    }
  });

  it("keeps vibrant KPI deltas readable on dark surfaces", async () => {
    const sheets = await Promise.all(
      ["./tokens.css", "./themes/dark.css", "./charts-vibrant.css"].map(loadStylesheet),
    );

    try {
      const theme = document.createElement("div");
      theme.dataset.theme = "dark";
      theme.dataset.rowanCharts = "vibrant";

      const card = document.createElement("rowan-kpi-card");
      card.label = "Open incidents";
      card.tone = "danger";
      card.value = 19;
      card.delta = -4;
      theme.append(card);
      document.body.append(theme);
      await nextTask();
      await waitForStyles(card);

      const delta = getComputedStyle(card.shadowRoot.querySelector(".delta"));
      const surface = getComputedStyle(card.shadowRoot.querySelector(".card"));
      expect(contrastRatio(delta.color, surface.backgroundColor)).to.be.at.least(4.5);
    } finally {
      sheets.forEach((sheet) => sheet.remove());
    }
  });
});
