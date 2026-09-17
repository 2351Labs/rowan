import { expect } from "@esm-bundle/chai";
import "axe-core";

const axe = globalThis.axe;

import "../alert/alert.js";
import "../badge/badge.js";
import "../button/button.js";
import "../checkbox/checkbox.js";
import "../chip/chip.js";
import "../icon-button/icon-button.js";
import "../radio-group/radio-group.js";
import "../radio/radio.js";
import "../switch/switch.js";
import "../text-field/text-field.js";

const nextMicrotask = () => Promise.resolve();

function formatViolations(violations) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  ${node.target.join(" ")} — ${node.failureSummary}`)
        .join("\n");
      return `${violation.id}: ${violation.help}\n${nodes}`;
    })
    .join("\n\n");
}

async function loadTheme() {
  const hrefs = [
    new URL("../tokens/tokens.css", import.meta.url).href,
    new URL("../tokens/themes/light.css", import.meta.url).href,
  ];

  await Promise.all(
    hrefs.map((href) => {
      if (
        [...document.querySelectorAll("link[rel='stylesheet']")].some((link) => link.href === href)
      ) {
        return undefined;
      }

      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = href;
      document.head.append(stylesheet);

      if (stylesheet.sheet) return undefined;

      return new Promise((resolve, reject) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", reject, { once: true });
      });
    }),
  );
}

function createCatalog() {
  const root = document.createElement("main");

  const heading = document.createElement("h1");
  heading.textContent = "Workspace";
  root.append(heading);

  const button = document.createElement("rowan-button");
  button.textContent = "Save";
  root.append(button);

  const iconButton = document.createElement("rowan-icon-button");
  iconButton.label = "Open calendar";
  root.append(iconButton);

  const field = document.createElement("rowan-text-field");
  field.label = "Workspace name";
  field.name = "workspace";
  root.append(field);

  const checkbox = document.createElement("rowan-checkbox");
  checkbox.label = "Subscribe";
  checkbox.name = "subscribe";
  root.append(checkbox);

  const toggle = document.createElement("rowan-switch");
  toggle.label = "Notifications";
  toggle.name = "notifications";
  root.append(toggle);

  const group = document.createElement("rowan-radio-group");
  group.name = "region";
  group.setAttribute("aria-label", "Region");
  const north = document.createElement("rowan-radio");
  north.value = "north";
  north.textContent = "North";
  const south = document.createElement("rowan-radio");
  south.value = "south";
  south.textContent = "South";
  group.append(north, south);
  root.append(group);

  const alert = document.createElement("rowan-alert");
  alert.textContent = "Backup completed.";
  root.append(alert);

  const badge = document.createElement("rowan-badge");
  badge.textContent = "Active";
  root.append(badge);

  const chip = document.createElement("rowan-chip");
  chip.textContent = "Design";
  root.append(chip);

  return root;
}

describe("catalog accessibility", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("has no WCAG A/AA violations on representative form and status widgets", async () => {
    await loadTheme();
    const root = createCatalog();
    document.body.append(root);
    await nextMicrotask();
    await nextMicrotask();

    const results = await axe.run(root, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });

    expect(results.violations, formatViolations(results.violations)).to.deep.equal([]);
  });
});
