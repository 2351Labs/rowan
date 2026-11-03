#!/usr/bin/env node
/**
 * Run the chart accessibility audit in Chromium and write the report.
 * `--check` fails when the committed report does not match a fresh run.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { chromium } from "playwright";
import { renderEvidence, renderMarkdown, renderPageModule } from "./chart-a11y-render.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const markdownPath = join(rootDir, "docs/CHART_ACCESSIBILITY.md");
const evidencePath = join(rootDir, "docs/chart-accessibility.evidence.json");
const pagePath = join(rootDir, "documentation/chart-accessibility.js");
const shotDir = join("/tmp/chart-a11y-shots");

const STATES = [
  { name: "default", media: { colorScheme: "light", forcedColors: "none", contrast: "no-preference" }, theme: "" },
  { name: "interactive", media: { colorScheme: "light", forcedColors: "none", contrast: "no-preference" }, theme: "" },
  { name: "hidden-series", media: { colorScheme: "light", forcedColors: "none", contrast: "no-preference" }, theme: "" },
  { name: "forced-colors", media: { colorScheme: "light", forcedColors: "active", contrast: "more" }, theme: "" },
  { name: "dark", media: { colorScheme: "dark", forcedColors: "none", contrast: "no-preference" }, theme: "dark" },
];

const SHOTS = ["bar-chart", "donut-chart", "heatmap-chart", "gauge-chart", "trend-chart"];

function assertAudit(charts) {
  const errors = [];
  if (charts.length !== 18) errors.push(`expected 18 charts, got ${charts.length}`);
  for (const chart of charts) {
    for (const state of STATES) {
      const probe = chart.states[state.name];
      if (!probe) {
        errors.push(`${chart.id} missing ${state.name}`);
        continue;
      }
      if (!probe.axe || !probe.table || !probe.keyboard || !probe.contrast) {
        errors.push(`${chart.id} ${state.name} is missing a probe`);
      }
      const unexpected = (probe.axe?.violations || []).filter((violation) => violation.id !== "target-size");
      if (unexpected.length) {
        errors.push(`${chart.id} ${state.name} axe: ${unexpected.map((violation) => violation.id).join(", ")}`);
      }
      if (probe.table?.missing?.length) {
        errors.push(`${chart.id} ${state.name} table missing ${probe.table.missing.join(", ")}`);
      }
    }
    const keyboardState = chart.keyboard === "points" ? "interactive" : "default";
    const keyboard = chart.states[keyboardState]?.keyboard;
    if (!keyboard?.focus?.visible) errors.push(`${chart.id} focus indicator not visible`);
    if (chart.keyboard === "points" && !keyboard?.arrowMoves) errors.push(`${chart.id} arrow did not move`);
    if (chart.expectActivate && !keyboard?.enterActivates) errors.push(`${chart.id} Enter did not activate`);
    if (chart.expectArrow && chart.keyboard !== "points" && !keyboard?.arrowAnnounces) {
      errors.push(`${chart.id} arrow did not announce`);
    }
    if (keyboard?.tab && !keyboard.tab.inside) errors.push(`${chart.id} Tab did not enter the chart`);
  }
  return errors;
}

async function tabAndTree(page, spec, stateName) {
  await page.evaluate(
    async ({ id, state }) => window.mountChart(id, state),
    { id: spec.id, state: stateName },
  );
  await page.locator("#before").focus();
  await page.keyboard.press("Tab");
  const tab = await page.evaluate(() => {
    const chart = document.querySelector("#mount")?.firstElementChild;
    const inner = chart?.shadowRoot?.activeElement;
    if (!inner) return { inside: false, target: document.activeElement?.id || "outside" };
    const label = inner.getAttribute("aria-label") || inner.textContent?.trim().slice(0, 80) || "";
    const className = String(inner.className || "").split(/\s+/)[0];
    return { inside: true, target: `${inner.localName}${className ? `.${className}` : ""} ${label}`.trim() };
  });
  let ariaSnapshot = "";
  try {
    ariaSnapshot = await page.locator("#mount > *").ariaSnapshot();
  } catch (_error) {
    ariaSnapshot = "";
  }
  ariaSnapshot = ariaSnapshot
    .split("\n")
    .slice(0, 40)
    .join("\n")
    .replace(/#rowan-[a-z0-9-]+-\d+/g, "#chart");
  return { tab, ariaSnapshot };
}

async function run() {
  const server = await createServer({
    configFile: false,
    root: rootDir,
    server: { host: "127.0.0.1", port: 0 },
    logLevel: "error",
  });
  await server.listen();
  const address = server.httpServer.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 800 } });
  try {
    await page.goto(`${origin}/test/chart-a11y/harness.html`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => typeof window.auditCharts === "function");
    const byId = new Map();

    for (const state of STATES) {
      await page.emulateMedia(state.media);
      await page.evaluate((theme) => {
        if (theme) document.documentElement.dataset.theme = theme;
        else document.documentElement.removeAttribute("data-theme");
      }, state.theme);
      const results = await page.evaluate(async (name) => window.auditCharts(name), state.name);
      for (const result of results) {
        if (!byId.has(result.id)) byId.set(result.id, { ...result, states: {} });
        byId.get(result.id).states[state.name] = result.probe;
      }
      console.log(`audited ${state.name}`);
    }

    mkdirSync(shotDir, { recursive: true });
    const charts = [...byId.values()].map(({ probe: _probe, ...chart }) => chart);
    for (const spec of charts) {
      const stateName = spec.keyboard === "points" ? "interactive" : "default";
      const extra = await tabAndTree(page, spec, stateName);
      const probe = spec.states[stateName];
      probe.keyboard.tab = extra.tab;
      probe.ariaSnapshot = extra.ariaSnapshot;
    }

    for (const spec of charts.filter((item) => SHOTS.includes(item.id))) {
      for (const state of [STATES[0], STATES[3], STATES[4]]) {
        await page.emulateMedia(state.media);
        await page.evaluate((theme) => {
          if (theme) document.documentElement.dataset.theme = theme;
          else document.documentElement.removeAttribute("data-theme");
        }, state.theme);
        await page.evaluate(
          async ({ id, name }) => window.mountChart(id, name),
          { id: spec.id, name: state.name },
        );
        await page.locator("#mount > *").screenshot({
          path: join(shotDir, `${spec.id}-${state.name}.png`),
        });
      }
    }

    const errors = assertAudit(charts);
    const markdown = renderMarkdown(charts);
    const evidence = renderEvidence(charts);
    const pageModule = renderPageModule(charts);
    if (check) {
      const mismatches = [];
      if (readFileSync(markdownPath, "utf8") !== markdown) mismatches.push(markdownPath);
      if (readFileSync(evidencePath, "utf8") !== evidence) mismatches.push(evidencePath);
      if (readFileSync(pagePath, "utf8") !== pageModule) mismatches.push(pagePath);
      if (mismatches.length || errors.length) {
        console.error(errors.join("\n"));
        console.error(mismatches.map((path) => `stale ${path}`).join("\n"));
        process.exitCode = 1;
      } else {
        console.log("chart accessibility report is current");
      }
    } else {
      writeFileSync(markdownPath, markdown);
      writeFileSync(evidencePath, evidence);
      writeFileSync(pagePath, pageModule);
      console.log(`wrote ${markdownPath}`);
      if (errors.length) {
        console.error(errors.join("\n"));
        process.exitCode = 1;
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
