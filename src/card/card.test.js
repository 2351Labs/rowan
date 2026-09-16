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

  it("projects media, header, title, body, footer, and actions into their documented parts", async () => {
    const card = document.createElement("rowan-card");
    const media = document.createElement("img");
    media.slot = "media";
    const header = document.createElement("div");
    header.slot = "header";
    const title = document.createElement("h3");
    title.slot = "title";
    const body = document.createElement("p");
    const footer = document.createElement("small");
    footer.slot = "footer";
    const actions = document.createElement("button");
    actions.slot = "actions";
    card.append(media, header, title, body, footer, actions);
    document.body.append(card);
    await nextMicrotask();

    const partSlot = (part) => card.shadowRoot.querySelector(`[part="${part}"] slot`);
    expect(partSlot("media").assignedElements()[0] === media).to.equal(true);
    expect(partSlot("header").assignedElements()[0] === header).to.equal(true);
    expect(partSlot("title").assignedElements()[0] === title).to.equal(true);
    expect(partSlot("body").assignedElements()[0] === body).to.equal(true);
    expect(partSlot("footer").assignedElements()[0] === footer).to.equal(true);
    expect(partSlot("actions").assignedElements()[0] === actions).to.equal(true);
    expect(card.shadowRoot.querySelector("article").getAttribute("part")).to.equal("card");
  });

  it("does not render while its host is hidden", async () => {
    const card = document.createElement("rowan-card");
    document.body.append(card);
    await nextMicrotask();
    await waitForStyles(card);

    card.hidden = true;

    expect(getComputedStyle(card).display).to.equal("none");
  });
});
