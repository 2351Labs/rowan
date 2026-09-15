import { expect } from "@esm-bundle/chai";
import "./skeleton.js";

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

function firstStopBrightness(backgroundImage) {
  const srgbStop = backgroundImage.match(
    /color\(srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/,
  );
  if (srgbStop) {
    return (Number(srgbStop[1]) + Number(srgbStop[2]) + Number(srgbStop[3])) / 3;
  }

  const rgbStop = backgroundImage.match(/rgba?\(([^)]+)\)/);
  const channels = rgbStop[1]
    .split(",")
    .slice(0, 3)
    .map((channel) => Number(channel.trim()) / 255);

  return (channels[0] + channels[1] + channels[2]) / 3;
}

function shimmerImage(element) {
  return getComputedStyle(element.shadowRoot.querySelector(".skeleton")).backgroundImage;
}

function appendThemedSkeleton(theme, parent = document.body) {
  const themeWrapper = document.createElement("div");
  themeWrapper.setAttribute("data-theme", theme);
  const skeleton = document.createElement("rowan-skeleton");
  themeWrapper.append(skeleton);
  parent.append(themeWrapper);

  return { themeWrapper, skeleton };
}

describe("rowan-skeleton", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("applies width and shape attributes", async () => {
    const el = document.createElement("rowan-skeleton");
    el.shape = "circle";
    el.width = "2rem";

    document.body.append(el);
    await nextMicrotask();

    const skeleton = el.shadowRoot.querySelector(".skeleton");
    expect(el.getAttribute("shape")).to.equal("circle");
    expect(skeleton.style.width).to.equal("2rem");
  });

  it("uses public surface and motion tokens", async () => {
    const el = document.createElement("rowan-skeleton");
    el.style.setProperty("--rowan-skeleton-base", "rgb(24, 48, 32)");
    el.style.setProperty("--rowan-skeleton-highlight", "rgb(52, 68, 58)");
    el.style.setProperty("--rowan-skeleton-shimmer-duration", "2s");
    document.body.append(el);
    await nextMicrotask();
    await waitForStyles(el);

    const styles = getComputedStyle(el.shadowRoot.querySelector(".skeleton"));

    expect(styles.backgroundImage).to.include("rgb(24, 48, 32)");
    expect(styles.backgroundImage).to.include("rgb(52, 68, 58)");
    expect(styles.animationDuration).to.equal("2s");
  });

  it("inherits dark shimmer surfaces from the shipped theme", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const { skeleton: darkSkeleton } = appendThemedSkeleton("dark");
      const { skeleton: lightSkeleton } = appendThemedSkeleton("light");
      await nextMicrotask();
      await Promise.all([darkSkeleton, lightSkeleton].map(waitForStyles));

      const darkImage = shimmerImage(darkSkeleton);
      const lightImage = shimmerImage(lightSkeleton);

      expect(darkImage).to.not.equal(lightImage);
      expect(firstStopBrightness(darkImage)).to.be.below(firstStopBrightness(lightImage));
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("lets a nested light theme override dark shimmer tokens", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const { themeWrapper: darkTheme } = appendThemedSkeleton("dark");
      const { skeleton: nestedSkeleton } = appendThemedSkeleton("light", darkTheme);
      const { skeleton: referenceSkeleton } = appendThemedSkeleton("light");
      await nextMicrotask();
      await Promise.all([nestedSkeleton, referenceSkeleton].map(waitForStyles));

      expect(shimmerImage(nestedSkeleton)).to.equal(shimmerImage(referenceSkeleton));
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
