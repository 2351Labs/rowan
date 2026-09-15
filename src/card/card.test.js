import { expect } from "@esm-bundle/chai";
import "./card.js";

const nextMicrotask = () => Promise.resolve();

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

function loadThemeStylesheets() {
  return Promise.all(
    ["../tokens/tokens.css", "../tokens/themes/light.css", "../tokens/themes/dark.css"].map(
      loadStylesheet,
    ),
  );
}

describe("rowan-card", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders named slots for composition", async () => {
    const card = document.createElement("rowan-card");

    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Camp Notes";

    const footer = document.createElement("span");
    footer.slot = "footer";
    footer.textContent = "Updated today";

    card.append(title, footer);
    document.body.append(card);
    await nextMicrotask();

    const titleSlot = card.shadowRoot.querySelector('slot[name="title"]');
    const footerSlot = card.shadowRoot.querySelector('slot[name="footer"]');

    expect(titleSlot.assignedElements().length).to.equal(1);
    expect(footerSlot.assignedElements().length).to.equal(1);
  });

  it("inherits dark component tokens from a theme wrapper", async () => {
    const themeStylesheets = await loadThemeStylesheets();

    try {
      const theme = document.createElement("div");
      theme.setAttribute("data-theme", "dark");
      const card = document.createElement("rowan-card");
      card.textContent = "Dark surface";
      theme.append(card);
      document.body.append(theme);
      await nextMicrotask();
      await waitForStyles(card);

      const styles = getComputedStyle(card.shadowRoot.querySelector(".card"));
      expect(styles.backgroundColor).to.equal("rgb(26, 34, 29)");
      expect(styles.color).to.equal("rgb(236, 240, 233)");
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
