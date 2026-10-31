/**
 * Enforce Storybook coverage for chart and KPI components.
 * Other components are listed in docs/STORY_COVERAGE.md and do not fail CI.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CHARTS = [
  ["rowan-area-chart", "src/area-chart/area-chart.js", "src/area-chart/area-chart.stories.js"],
  ["rowan-bar-chart", "src/bar-chart/bar-chart.js", "src/bar-chart/bar-chart.stories.js"],
  ["rowan-box-plot-chart", "src/box-plot-chart/box-plot-chart.js", "src/box-plot-chart/box-plot-chart.stories.js"],
  ["rowan-bullet-chart", "src/bullet-chart/bullet-chart.js", "src/bullet-chart/bullet-chart.stories.js"],
  ["rowan-column-sparkline", "src/column-sparkline/column-sparkline.js", "src/column-sparkline/column-sparkline.stories.js"],
  ["rowan-combo-chart", "src/combo-chart/combo-chart.js", "src/combo-chart/combo-chart.stories.js"],
  ["rowan-donut-chart", "src/donut-chart/donut-chart.js", "src/donut-chart/donut-chart.stories.js"],
  ["rowan-funnel-chart", "src/funnel-chart/funnel-chart.js", "src/funnel-chart/funnel-chart.stories.js"],
  ["rowan-gauge-chart", "src/gauge-chart/gauge-chart.js", "src/gauge-chart/gauge-chart.stories.js"],
  ["rowan-heatmap-chart", "src/heatmap-chart/heatmap-chart.js", "src/heatmap-chart/heatmap-chart.stories.js"],
  ["rowan-kpi-card", "src/kpi-card/kpi-card.js", "src/kpi-card/kpi-card.stories.js"],
  ["rowan-radar-chart", "src/radar-chart/radar-chart.js", "src/radar-chart/radar-chart.stories.js"],
  ["rowan-range-chart", "src/range-chart/range-chart.js", "src/range-chart/range-chart.stories.js"],
  ["rowan-scatter-chart", "src/scatter-chart/scatter-chart.js", "src/scatter-chart/scatter-chart.stories.js"],
  ["rowan-sparkline", "src/sparkline/sparkline.js", "src/sparkline/sparkline.stories.js"],
  ["rowan-stacked-area-chart", "src/stacked-area-chart/stacked-area-chart.js", "src/stacked-area-chart/stacked-area-chart.stories.js"],
  ["rowan-stacked-bar-chart", "src/stacked-bar-chart/stacked-bar-chart.js", "src/stacked-bar-chart/stacked-bar-chart.stories.js"],
  ["rowan-trend-chart", "src/trend-chart/trend-chart.js", "src/trend-chart/trend-chart.stories.js"],
  ["rowan-waterfall-chart", "src/waterfall-chart/waterfall-chart.js", "src/waterfall-chart/waterfall-chart.stories.js"],
];

/** Inherited form internals and host-managed fields stories do not author. */
const ALLOWLIST = new Set([
  "internals",
  "form",
  "validity",
  "validationMessage",
  "willValidate",
  "externalLabelText",
]);

const GALLERY_PATH = "stories/chart-galleries.js";

function read(path) {
  return readFileSync(resolve(rootDir, path), "utf8");
}

function camel(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function loadComponents() {
  const data = JSON.parse(read("custom-elements.json"));
  const byTag = new Map();
  for (const module of data.modules) {
    for (const declaration of module.declarations || []) {
      if (declaration.tagName) byTag.set(declaration.tagName, declaration);
    }
  }
  return byTag;
}

function galleryText() {
  return read(GALLERY_PATH);
}

function galleryPreamble() {
  const text = galleryText();
  const start = text.indexOf("export const coverageStories");
  return start < 0 ? text : text.slice(0, start);
}

function gallerySection(tag) {
  const text = galleryText();
  const start = text.indexOf(`"${tag}": {`);
  if (start < 0) return "";
  const next = text.indexOf('\n  "rowan-', start + tag.length);
  return text.slice(start, next === -1 ? text.length : next);
}

function mainStoryFile(path) {
  try {
    return execFileSync("git", ["show", `origin/main:${path}`], {
      cwd: rootDir,
      encoding: "utf8",
    });
  } catch {
    return "";
  }
}

function enumsFromSource(source) {
  const found = [];
  for (const line of source.split("\n")) {
    if (!line.includes("@attr {") || !line.includes('"')) continue;
    const values = [...line.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    if (values.length < 2) continue;
    const bracket = line.match(/\[([a-z-]+)/i);
    const plain = line.match(/\}\s+([a-z-]+)/i);
    const raw = bracket?.[1] || plain?.[1];
    if (!raw) continue;
    found.push({ name: camel(raw), values });
  }
  return found;
}

function hasWord(text, word) {
  return new RegExp(`\\b${word}\\b`).test(text);
}

function argTypesBlock(text) {
  const start = text.indexOf("argTypes:");
  if (start < 0) return "";
  const end = text.indexOf("};", start);
  return end < 0 ? text.slice(start) : text.slice(start, end);
}

function publicFields(declaration) {
  return (declaration.members || []).filter(
    (member) =>
      member.kind === "field" &&
      !member.static &&
      member.privacy !== "private" &&
      member.privacy !== "protected" &&
      member.name &&
      !ALLOWLIST.has(member.name) &&
      !(member.name === "labels" && !(member.type?.text || "").includes("string")),
  );
}

function analyze(tag, declaration, sourcePath, storyText, galleryText) {
  const combined = `${storyText}\n${galleryText}`;
  const missing = [];
  const fields = publicFields(declaration);
  const enums = enumsFromSource(read(sourcePath));
  const slots = declaration.slots || [];
  const events = (declaration.events || []).map((event) => event.name).filter(Boolean);
  const argBlock = argTypesBlock(storyText);
  let total = 0;
  let covered = 0;

  function expect(ok, item) {
    total += 1;
    if (ok) covered += 1;
    else missing.push(item);
  }

  for (const field of fields) {
    expect(hasWord(combined, field.name), `attribute ${field.name}`);
  }

  const controlNames = new Set(
    ["label", "description", "interactive", "locale"].filter((name) =>
      fields.some((field) => field.name === name),
    ),
  );
  for (const item of enums) controlNames.add(item.name);
  for (const name of ["value", "target", "min", "max", "delta", "deltaLabel", "loading", "scale"]) {
    if (fields.some((field) => field.name === name)) controlNames.add(name);
  }
  for (const name of controlNames) {
    expect(argBlock.includes(`${name}:`), `argType ${name}`);
  }

  for (const item of enums) {
    for (const value of item.values) {
      expect(combined.includes(`"${value}"`) || combined.includes(`'${value}'`), `enum ${item.name}=${value}`);
    }
  }

  for (const slot of slots) {
    if (!slot.name) expect(combined.includes("default slot"), "slot default");
    else {
      expect(
        combined.includes(`slot="${slot.name}"`) || combined.includes(`.slot = "${slot.name}"`),
        `slot ${slot.name}`,
      );
    }
  }

  for (const eventName of events) {
    expect(combined.includes(eventName), `event ${eventName}`);
  }

  for (const part of declaration.cssParts || []) {
    const sectionOnly = galleryText.slice(galleryText.indexOf(`"${tag}"`));
    expect(sectionOnly.includes(`"${part.name}"`), `part ${part.name}`);
  }

  expect(/"Empty"|name:\s*"Empty"/.test(combined), "state empty");
  expect(combined.includes("Unable to load chart data"), "state error");
  if (fields.some((field) => field.name === "loading")) {
    expect(/loading\s*[:=]\s*true/.test(combined), "state loading");
  }
  if (fields.some((field) => field.name === "referenceLines")) {
    expect(hasWord(combined, "referenceLines"), "thresholds referenceLines");
  }
  if (fields.some((field) => field.name === "valueFormatter")) {
    expect(hasWord(combined, "valueFormatter"), "formatting valueFormatter");
  }
  expect(combined.includes("fixtures/chart-data") || galleryText.includes("monthlyRevenue") || galleryText.includes("sparklineValues") || galleryText.includes("productSales") || galleryText.includes("conversionFunnel") || galleryText.includes("kpiValues") || galleryText.includes("weeklyActivity") || galleryText.includes("customerSegments") || galleryText.includes("productComparison") || galleryText.includes("profitBreakdown") || galleryText.includes("performanceStats") || galleryText.includes("regionalSales"), "realistic fixture data");
  expect(/keyboard|Arrow keys|Arrow, Home/.test(combined), "keyboard interaction");

  return {
    tag,
    total,
    covered,
    percent: total === 0 ? 100 : Math.round((covered / total) * 100),
    missing,
  };
}

function reportOnly(declaration) {
  const storyHint = declaration.tagName?.replace("rowan-", "") ?? "";
  return {
    tag: declaration.tagName,
    fields: publicFields(declaration).length,
    slots: (declaration.slots || []).length,
    events: (declaration.events || []).length,
    hinted: storyHint,
  };
}

function markdown(chartRows, others) {
  const lines = [];
  lines.push("# Storybook coverage");
  lines.push("");
  lines.push("Chart and KPI components are enforced by `scripts/check-story-coverage.mjs`.");
  lines.push("Other categories are report-only until their story PRs land.");
  lines.push("");
  lines.push("## Charts and data viz");
  lines.push("");
  lines.push("| Component | Before | After | Missing |");
  lines.push("| --- | ---: | ---: | --- |");
  for (const row of chartRows) {
    const missing = row.missing.length === 0 ? "—" : row.missing.join(", ");
    lines.push(`| \`${row.tag}\` | ${row.before}% | ${row.after}% | ${missing} |`);
  }
  lines.push("");
  lines.push("Before is the story file on `origin/main`, without shared fixture galleries.");
  lines.push("After includes `stories/chart-galleries.js` plus the story file.");
  lines.push("Allowlisted inherited fields: `internals`, `form`, `validity`, `validationMessage`, `willValidate`, `externalLabelText`, and form-associated `labels` where it is not the category `string[]`.");
  lines.push("Charts do not ship a `loading` attribute except `rowan-kpi-card`. Failed loads use the error story (`Unable to load chart data`) and an empty data set.");
  lines.push("");
  lines.push("## Other components (report only)");
  lines.push("");
  lines.push("| Component | Public fields | Slots | Events |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const row of others) {
    lines.push(`| \`${row.tag}\` | ${row.fields} | ${row.slots} | ${row.events} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const byTag = loadComponents();
  const chartTags = new Set(CHARTS.map(([tag]) => tag));
  const rows = [];
  const failures = [];

  for (const [tag, sourcePath, storyPath] of CHARTS) {
    const declaration = byTag.get(tag);
    if (!declaration) {
      failures.push(`${tag}: missing from custom-elements.json`);
      continue;
    }
    const storyText = read(storyPath);
    const section = gallerySection(tag);
    const galleryForChart = `${galleryPreamble()}\n${section}`;
    const after = analyze(tag, declaration, sourcePath, storyText, galleryForChart);
    const before = analyze(tag, declaration, sourcePath, mainStoryFile(storyPath), "");
    rows.push({ ...after, before: before.percent, after: after.percent });
    if (after.missing.length > 0) {
      failures.push(`${tag}: ${after.missing.join(", ")}`);
    }
  }

  const others = [...byTag.values()]
    .filter((declaration) => declaration.customElement && declaration.tagName?.startsWith("rowan-"))
    .filter((declaration) => !chartTags.has(declaration.tagName))
    .map(reportOnly)
    .sort((a, b) => a.tag.localeCompare(b.tag));

  const body = markdown(rows, others);
  const outputPath = resolve(rootDir, "docs/STORY_COVERAGE.md");
  const previous = existsSync(outputPath) ? readFileSync(outputPath, "utf8") : "";
  if (previous !== body) writeFileSync(outputPath, body);

  if (failures.length > 0) {
    console.error("Chart story coverage failed:\n");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Chart story coverage passed for ${rows.length} components.`);
  for (const row of rows) console.log(`  ${row.tag}: ${row.before}% -> ${row.after}%`);
}

main();
