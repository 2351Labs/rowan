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
      const theme = document.createElement("div");
      theme.setAttribute("data-theme", "dark");
      const el = document.createElement("rowan-skeleton");
      theme.append(el);
      document.body.append(theme);
      await nextMicrotask();
      await waitForStyles(el);

      const styles = getComputedStyle(el.shadowRoot.querySelector(".skeleton"));
      expect(styles.backgroundImage).to.include("rgb(36, 48, 41)");
      expect(styles.backgroundImage).to.include("rgb(52, 68, 58)");
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("lets a nested light theme override dark shimmer tokens", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const darkTheme = document.createElement("div");
      darkTheme.setAttribute("data-theme", "dark");
      const lightTheme = document.createElement("div");
      lightTheme.setAttribute("data-theme", "light");
      const el = document.createElement("rowan-skeleton");
      lightTheme.append(el);
      darkTheme.append(lightTheme);
      document.body.append(darkTheme);
      await nextMicrotask();
      await waitForStyles(el);

      const styles = getComputedStyle(el.shadowRoot.querySelector(".skeleton"));
      expect(styles.backgroundImage).to.include("rgb(230, 235, 229)");
      expect(styles.backgroundImage).to.include("rgb(244, 247, 242)");
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
