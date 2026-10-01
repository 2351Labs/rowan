import { expect } from "@esm-bundle/chai";
import "../app-layout/app-layout.js";
import "../area-chart/area-chart.js";
import "../button/button.js";
import "../calendar/calendar.js";
import "../card/card.js";
import "../chip/chip.js";
import "../date-picker/date-picker.js";
import "../dialog/dialog.js";
import "../form-wizard/form-wizard.js";
import "../icon-button/icon-button.js";
import "../side-nav-item/side-nav-item.js";
import "../status-indicator/status-indicator.js";
import "../stepper/stepper.js";
import "../switch/switch.js";
import "../table-toolbar/table-toolbar.js";
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

  it("provides AA-contrast surfaces in shipped theme wrappers", async () => {
    const themeStylesheets = await Promise.all(
      [
        "./tokens.css",
        "./themes/light.css",
        "./themes/dark.css",
        "./themes/lagoon.css",
        "./themes/ember.css",
        "./themes/slate.css",
        "./themes/midnight.css",
      ].map(loadStylesheet),
    );

    try {
      for (const themeName of ["dark", "lagoon", "ember", "slate", "midnight"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);

        const chip = document.createElement("rowan-chip");
        chip.textContent = `${themeName} chip`;
        const card = document.createElement("rowan-card");
        card.textContent = `${themeName} card`;
        const datePicker = document.createElement("rowan-date-picker");
        datePicker.label = "Review date";
        const calendar = document.createElement("rowan-calendar");
        const dialog = document.createElement("rowan-dialog");
        dialog.textContent = `${themeName} dialog`;
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
          expect(contrastRatio(styles.color, styles.backgroundColor), themeName).to.be.at.least(
            4.5,
          );
        }

        theme.remove();
      }
    } finally {
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps the switch thumb distinguishable from its track in both themes", async () => {
    const themeStylesheets = await Promise.all(
      [
        "./tokens.css",
        "./themes/light.css",
        "./themes/dark.css",
        "./themes/lagoon.css",
        "./themes/ember.css",
        "./themes/slate.css",
        "./themes/midnight.css",
      ].map(loadStylesheet),
    );

    try {
      for (const themeName of ["light", "dark", "lagoon", "ember", "slate", "midnight"]) {
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

  it("keeps nested dark and midnight app shells readable against a light :root", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./themes/dark.css", "./themes/midnight.css"].map(
        loadStylesheet,
      ),
    );
    document.documentElement.setAttribute("data-theme", "light");

    try {
      for (const themeName of ["dark", "midnight"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);

        const layout = document.createElement("rowan-app-layout");
        layout.style.setProperty("--rowan-app-layout-min-block-size", "16rem");

        const header = document.createElement("div");
        header.slot = "header";
        const ghost = document.createElement("rowan-icon-button");
        ghost.variant = "ghost";
        ghost.label = "Jump to";
        header.append(ghost);

        const rail = document.createElement("div");
        rail.slot = "navigation";
        const item = document.createElement("rowan-side-nav-item");
        item.label = "Overview";
        item.append("Overview");
        rail.append(item);

        const heading = document.createElement("h2");
        heading.textContent = "Customers overview";
        const secondary = document.createElement("rowan-button");
        secondary.variant = "secondary";
        secondary.textContent = "Simulate unknown path";

        layout.append(header, rail, heading, secondary);
        theme.append(layout);
        document.body.append(theme);
        await nextTask();
        await Promise.all([layout, item, ghost, secondary].map(waitForStyles));

        const layoutSurface = layout.shadowRoot.querySelector(".layout");
        const headerSurface = layout.shadowRoot.querySelector(".header");
        const navigationSurface = layout.shadowRoot.querySelector(".navigation");
        const layoutStyles = getComputedStyle(layoutSurface);
        const headingStyles = getComputedStyle(heading);
        const itemStyles = getComputedStyle(item.shadowRoot.querySelector(".item"));
        const ghostStyles = getComputedStyle(ghost.shadowRoot.querySelector(".button"));
        const secondaryStyles = getComputedStyle(secondary.shadowRoot.querySelector(".button"));

        expect(relativeLuminance(layoutStyles.backgroundColor), themeName).to.be.below(0.2);
        expect(
          contrastRatio(headingStyles.color, layoutStyles.backgroundColor),
          themeName,
        ).to.be.at.least(4.5);
        expect(
          contrastRatio(itemStyles.color, getComputedStyle(navigationSurface).backgroundColor),
          themeName,
        ).to.be.at.least(4.5);
        expect(
          contrastRatio(ghostStyles.color, getComputedStyle(headerSurface).backgroundColor),
          themeName,
        ).to.be.at.least(3);
        expect(
          contrastRatio(secondaryStyles.color, secondaryStyles.backgroundColor),
          themeName,
        ).to.be.at.least(4.5);

        theme.remove();
      }
    } finally {
      document.documentElement.removeAttribute("data-theme");
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps nested dark form wizards and table toolbars readable against a light :root", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./themes/dark.css", "./themes/midnight.css"].map(
        loadStylesheet,
      ),
    );
    document.documentElement.setAttribute("data-theme", "light");

    try {
      for (const themeName of ["dark", "midnight"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);
        theme.style.background = "var(--rowan-color-bg)";
        theme.style.color = "var(--rowan-color-fg)";

        const wizard = document.createElement("rowan-form-wizard");
        wizard.steps = [
          { id: "details", label: "Details" },
          { id: "review", label: "Review" },
        ];
        const panel = document.createElement("section");
        panel.slot = "step-details";
        const copy = document.createElement("p");
        copy.textContent = "Capture the core account details before continuing.";
        panel.append(copy);
        wizard.append(panel);

        const toolbar = document.createElement("rowan-table-toolbar");
        const density = document.createElement("span");
        density.slot = "end";
        density.textContent = "Density stays on the toolbar.";
        toolbar.append(density);

        theme.append(wizard, toolbar);
        document.body.append(theme);
        await nextTask();
        await Promise.all([wizard, toolbar].map(waitForStyles));

        const previous = wizard.shadowRoot.querySelector(".previous-button");
        const next = wizard.shadowRoot.querySelector(".next-button");
        const toolbarSurface = toolbar.shadowRoot.querySelector(".toolbar");
        const themeBg = getComputedStyle(theme).backgroundColor;

        expect(contrastRatio(getComputedStyle(copy).color, themeBg), themeName).to.be.at.least(4.5);
        expect(contrastRatio(getComputedStyle(previous).color, themeBg), themeName).to.be.at.least(
          4.5,
        );
        expect(
          contrastRatio(getComputedStyle(next).color, getComputedStyle(next).backgroundColor),
          themeName,
        ).to.be.at.least(4.5);
        expect(
          contrastRatio(
            getComputedStyle(density).color,
            getComputedStyle(toolbarSurface).backgroundColor,
          ),
          themeName,
        ).to.be.at.least(4.5);

        theme.remove();
      }
    } finally {
      document.documentElement.removeAttribute("data-theme");
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps nested dark and midnight status-indicator labels readable against a light :root", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/light.css", "./themes/dark.css", "./themes/midnight.css"].map(
        loadStylesheet,
      ),
    );
    document.documentElement.setAttribute("data-theme", "light");

    try {
      for (const themeName of ["dark", "midnight"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);
        theme.style.backgroundColor = "var(--rowan-color-bg)";

        const indicator = document.createElement("rowan-status-indicator");
        indicator.label = "Live";
        theme.append(indicator);
        document.body.append(theme);
        await nextTask();
        await waitForStyles(indicator);

        const labelStyles = getComputedStyle(indicator.shadowRoot.querySelector(".status"));
        const surfaceStyles = getComputedStyle(theme);
        expect(relativeLuminance(surfaceStyles.backgroundColor), themeName).to.be.below(0.2);
        expect(
          contrastRatio(labelStyles.color, surfaceStyles.backgroundColor),
          themeName,
        ).to.be.at.least(4.5);

        theme.remove();
      }
    } finally {
      document.documentElement.removeAttribute("data-theme");
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps nested slate fields readable against a dark :root", async () => {
    const themeStylesheets = await Promise.all(
      ["./tokens.css", "./themes/dark.css", "./themes/slate.css"].map(loadStylesheet),
    );
    document.documentElement.setAttribute("data-theme", "dark");

    try {
      const theme = document.createElement("div");
      theme.setAttribute("data-theme", "slate");

      const datePicker = document.createElement("rowan-date-picker");
      datePicker.label = "Review date";
      const card = document.createElement("rowan-card");
      card.textContent = "Slate card";
      theme.append(datePicker, card);
      document.body.append(theme);
      await nextTask();
      await Promise.all([datePicker, card].map(waitForStyles));

      const input = getComputedStyle(datePicker.shadowRoot.querySelector(".input"));
      const cardSurface = getComputedStyle(card.shadowRoot.querySelector(".card"));
      expect(relativeLuminance(input.backgroundColor)).to.be.above(0.8);
      expect(contrastRatio(input.color, input.backgroundColor)).to.be.at.least(4.5);
      expect(contrastRatio(cardSurface.color, cardSurface.backgroundColor)).to.be.at.least(4.5);
    } finally {
      document.documentElement.removeAttribute("data-theme");
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });

  it("keeps nested dark and ember area-chart plots on the themed surface", async () => {
    const themeStylesheets = await Promise.all(
      [
        "./tokens.css",
        "./themes/light.css",
        "./themes/dark.css",
        "./themes/ember.css",
        "./themes/midnight.css",
      ].map(loadStylesheet),
    );
    document.documentElement.setAttribute("data-theme", "light");

    try {
      for (const themeName of ["dark", "ember", "midnight"]) {
        const theme = document.createElement("div");
        theme.setAttribute("data-theme", themeName);

        const chart = document.createElement("rowan-area-chart");
        chart.labels = ["Apr", "May"];
        chart.series = [{ name: "Revenue", values: [12, 18] }];
        theme.append(chart);
        document.body.append(theme);
        await nextTask();
        await waitForStyles(chart);
        const plotBg = await paintedBackground(chart, ".control");
        expect(relativeLuminance(plotBg), themeName).to.be.below(0.2);

        theme.remove();
      }
    } finally {
      document.documentElement.removeAttribute("data-theme");
      themeStylesheets.forEach((stylesheet) => stylesheet.remove());
    }
  });
});
