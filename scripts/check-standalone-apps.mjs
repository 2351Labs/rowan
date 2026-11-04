#!/usr/bin/env node
/**
 * Install templates/admin and the starters outside the monorepo and smoke-test
 * them against the npm registry, which is what StackBlitz does.
 *
 * Inside this repo, npm workspaces link @rowan-ui/* to the local sources, and
 * Vite does not prebundle those links. A copied folder installs published
 * `@rowan-ui/*@^0.23.0` with Vite's default config (no optimizeDeps.exclude).
 * Component CSS is embedded in the module, so the prebundle still paints.
 * This script fails if a config excludes those packages, if the registry
 * install is older than 0.23.0, or if dev or preview renders unstyled.
 *
 * It also packs this repo and installs those tarballs into a Vite app with
 * the default config. Embedded component CSS must style that app in dev and
 * in the production preview.
 */

import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const shotsDir = process.env.ROWAN_STANDALONE_SHOTS || "";

const PROJECTS = [
  { name: "admin", source: "templates/admin" },
  { name: "vite", source: "starters/vite" },
  { name: "react", source: "starters/react" },
  { name: "vue", source: "starters/vue" },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code} in ${cwd}`));
    });
  });
}

function startServer(dir, args) {
  const vite = join(dir, "node_modules", "vite", "bin", "vite.js");
  let log = "";
  const child = spawn(process.execPath, [vite, ...args], {
    cwd: dir,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const append = (chunk) => {
    log += chunk.toString();
    if (log.length > 20000) log = log.slice(-20000);
  };
  child.stdout.on("data", append);
  child.stderr.on("data", append);
  return {
    child,
    log: () => log,
  };
}

function stopServer(server) {
  const child = server?.child;
  if (!child?.pid || child.exitCode != null) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      // The process already exited.
    }
  }
}

async function waitForHttp(url, server) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (server.child.exitCode != null) {
      throw new Error(`Vite exited ${server.child.exitCode} before ${url} was ready.\n${server.log()}`);
    }
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${url}.\n${server.log()}`);
}

function copyProject(source, dest) {
  cpSync(source, dest, {
    recursive: true,
    filter(path) {
      const name = basename(path);
      return name !== "node_modules" && name !== "dist";
    },
  });
}

function atLeast(version, minimum) {
  const parse = (value) => value.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const left = parse(version);
  const right = parse(minimum);
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return true;
    if (left[index] < right[index]) return false;
  }
  return true;
}

function assertRegistryInstall(dir) {
  const app = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const names = Object.keys(app.dependencies || {}).filter((name) => name.startsWith("@rowan-ui/"));
  const versions = {};
  for (const name of names) {
    const manifest = join(dir, "node_modules", name, "package.json");
    if (!existsSync(manifest)) {
      throw new Error(`${dir} did not install ${name}`);
    }
    const resolved = realpathSync(manifest);
    if (resolved === repoRoot || resolved.startsWith(`${repoRoot}${sep}`)) {
      throw new Error(`${name} resolved to the workspace at ${resolved}`);
    }
    const version = JSON.parse(readFileSync(resolved, "utf8")).version;
    if (!atLeast(version, "0.23.0")) {
      throw new Error(`${dir} resolved ${name}@${version}; expected >= 0.23.0`);
    }
    versions[name] = version;
  }
  return versions;
}

/**
 * Runs in the browser. Returns a report; `ok` means the published packages
 * upgraded and their shadow styles actually applied.
 */
function collectReport() {
  const problems = [];
  const details = {};
  const rowan = [...document.querySelectorAll("*")].filter((element) =>
    element.localName.startsWith("rowan-"),
  );
  const missing = [
    ...new Set(
      rowan
        .filter((element) => customElements.get(element.localName) == null)
        .map((element) => element.localName),
    ),
  ];
  details.elements = rowan.length;
  if (rowan.length === 0) problems.push("no Rowan elements were rendered");
  if (missing.length > 0) problems.push(`not upgraded: ${missing.join(", ")}`);

  const tokenBg = getComputedStyle(document.documentElement).getPropertyValue("--rowan-color-bg").trim();
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  details.tokenBg = tokenBg;
  details.bodyBg = bodyBg;
  if (!tokenBg) problems.push("missing custom property --rowan-color-bg");
  if (bodyBg === "rgba(0, 0, 0, 0)" || bodyBg === "transparent") {
    problems.push("body background did not use the Rowan token");
  }

  const layout = document.querySelector("rowan-app-layout");
  const layoutDisplay = layout ? getComputedStyle(layout).display : "";
  details.layoutDisplay = layoutDisplay;
  if (layoutDisplay !== "grid") problems.push(`rowan-app-layout display is ${layoutDisplay || "missing"}`);

  const spark = document.querySelector("rowan-sparkline");
  const link = spark?.shadowRoot?.querySelector("link[rel='stylesheet']");
  let rules = 0;
  try {
    rules = link?.sheet?.cssRules?.length ?? 0;
  } catch {
    rules = 0;
  }
  if (!rules && spark?.shadowRoot) {
    for (const sheet of spark.shadowRoot.adoptedStyleSheets || []) {
      try {
        rules += sheet.cssRules.length;
      } catch {
        // Ignore cross-origin sheets.
      }
    }
  }
  const plot = spark?.shadowRoot?.querySelector(".plot");
  const plotHeight = plot ? plot.getBoundingClientRect().height : 0;
  const mark = spark?.shadowRoot?.querySelector(".line, .area");
  const paint = mark ? getComputedStyle(mark) : null;
  const paintColor = mark?.classList.contains("area") ? paint?.fill : paint?.stroke;
  details.sparkHref = link?.href ?? "";
  details.sparkRules = rules;
  details.plotHeight = plotHeight;
  details.sparkPaint = paintColor ?? "";
  if (rules < 5 || (link?.href || "").includes("/.vite/deps/")) {
    problems.push(`sparkline stylesheet did not apply (${link?.href || "adopted"}, ${rules} rules)`);
  }
  if (plotHeight < 12 || plotHeight > 64) problems.push(`sparkline plot height is ${plotHeight}`);
  if (!mark || !paintColor || paintColor === "none" || paintColor === "rgb(0, 0, 0)") {
    problems.push(`sparkline paint is ${paintColor || "missing"}`);
  }

  const trend = document.querySelector("rowan-trend-chart");
  const paths = trend?.shadowRoot ? [...trend.shadowRoot.querySelectorAll("path")] : [];
  const drawn = paths.some((path) => {
    const box = path.getBoundingClientRect();
    const stroke = getComputedStyle(path).stroke;
    return box.width > 8 && stroke && stroke !== "none" && stroke !== "rgb(0, 0, 0)";
  });
  details.trendPaths = paths.length;
  if (!drawn) problems.push("trend chart has no painted series");

  if (/\bNaN\b/.test(document.body.innerText)) problems.push("visible NaN");

  return { ok: problems.length === 0, problems, details };
}

function isIgnorable(url, text) {
  return /favicon\.ico/i.test(url) || /favicon\.ico/i.test(text);
}

async function smoke(page, url, label, shotsName) {
  const errors = [];
  const onConsole = (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    const location = message.location()?.url ?? "";
    if (isIgnorable(location, text)) return;
    errors.push(text);
  };
  const onPageError = (error) => {
    errors.push(error instanceof Error ? error.message : String(error));
  };
  const onResponse = (response) => {
    if (response.status() < 400) return;
    const responseUrl = response.url();
    if (isIgnorable(responseUrl, "")) return;
    errors.push(`${response.status()} ${responseUrl}`);
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const deadline = Date.now() + 20000;
    let report = await page.evaluate(collectReport);
    while (!report.ok && Date.now() < deadline) {
      await delay(200);
      report = await page.evaluate(collectReport);
    }
    await delay(200);
    if (shotsDir && shotsName) {
      mkdirSync(shotsDir, { recursive: true });
      await page.screenshot({ path: join(shotsDir, shotsName), fullPage: false });
    }
    if (!report.ok || errors.length > 0) {
      const detail = [
        `${label} is not styled.`,
        report.problems.length ? `checks: ${report.problems.join("; ")}` : "",
        `details: ${JSON.stringify(report.details)}`,
        errors.length ? `console: ${errors.slice(0, 12).join(" | ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      throw new Error(detail);
    }
    console.log(`  ✓ ${label}`);
    console.log(`    ${JSON.stringify(report.details)}`);
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("response", onResponse);
  }
}

async function exercise(project, dir, context, index) {
  const devPort = 49120 + index * 2;
  const previewPort = devPort + 1;
  const viteBin = join(dir, "node_modules", "vite", "bin", "vite.js");
  console.log(`\n▶ ${project.name}: dev server`);
  const dev = startServer(dir, ["--host", "127.0.0.1", "--port", String(devPort), "--strictPort"]);
  try {
    await waitForHttp(`http://127.0.0.1:${devPort}/`, dev);
    const page = await context.newPage();
    try {
      await smoke(page, `http://127.0.0.1:${devPort}/`, `${project.name} dev`, `${project.name}-dev.png`);
    } finally {
      await page.close();
    }
  } finally {
    stopServer(dev);
  }

  console.log(`▶ ${project.name}: production build`);
  await run(process.execPath, [viteBin, "build"], dir);

  console.log(`▶ ${project.name}: preview`);
  const preview = startServer(dir, [
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    String(previewPort),
    "--strictPort",
  ]);
  try {
    await waitForHttp(`http://127.0.0.1:${previewPort}/`, preview);
    const page = await context.newPage();
    try {
      await smoke(page, `http://127.0.0.1:${previewPort}/`, `${project.name} preview`, "");
    } finally {
      await page.close();
    }
  } finally {
    stopServer(preview);
  }
}

async function smokePackedDefaultVite(sandbox, context) {
  const packDir = join(sandbox, "packs");
  mkdirSync(packDir, { recursive: true });
  console.log("\n▶ packed library: npm pack");
  await run("npm", ["pack", "--pack-destination", packDir], repoRoot);
  await run("npm", ["pack", "--pack-destination", packDir, "--workspace=@rowan-ui/icons"], repoRoot);

  const dir = join(sandbox, "packed-vite");
  mkdirSync(join(dir, "src"), { recursive: true });
  const corePack = join(packDir, "rowan-ui-core-0.23.3.tgz");
  const iconPack = join(packDir, "rowan-ui-icons-0.23.3.tgz");
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: "rowan-default-vite",
        private: true,
        type: "module",
        dependencies: {
          "@rowan-ui/core": `file:${corePack}`,
          "@rowan-ui/icons": `file:${iconPack}`,
        },
        devDependencies: { vite: "^5.4.10" },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(dir, "vite.config.js"),
    `import { defineConfig } from "vite";
export default defineConfig({
  server: { host: "127.0.0.1", port: 49240, strictPort: true },
  preview: { host: "127.0.0.1", port: 49241, strictPort: true },
});
`,
  );
  writeFileSync(
    join(dir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Packed Rowan</title></head>
  <body>
    <style>
      body { background: var(--rowan-color-bg); color: var(--rowan-color-fg); font-family: var(--rowan-font-family, sans-serif); margin: 0; }
    </style>
    <div id="app"></div><script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
  );
  writeFileSync(
    join(dir, "src", "main.js"),
    `import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/app-layout";
import "@rowan-ui/core/button";
import "@rowan-ui/core/sparkline";
import "@rowan-ui/core/trend-chart";
import "@rowan-ui/icons/elements/sun";

document.documentElement.dataset.theme = "light";
const app = document.querySelector("#app");
const layout = document.createElement("rowan-app-layout");
const nav = document.createElement("div");
nav.slot = "navigation";
const icon = document.createElement("rowan-icon");
icon.name = "sun";
nav.append(icon);
const main = document.createElement("div");
const button = document.createElement("rowan-button");
button.textContent = "Save";
const spark = document.createElement("rowan-sparkline");
spark.label = "Weekly revenue";
spark.variant = "area";
spark.tone = "success";
spark.values = [4, 8, 6, 9, 7, 11];
const trend = document.createElement("rowan-trend-chart");
trend.label = "Revenue";
trend.labels = ["Mon", "Tue", "Wed", "Thu"];
trend.series = [{ id: "web", label: "Web", values: [3, 5, 4, 8] }];
main.append(button, spark, trend);
layout.append(nav, main);
app.append(layout);
app.dataset.ready = "true";
`,
  );

  if (readFileSync(join(dir, "vite.config.js"), "utf8").includes("optimizeDeps")) {
    throw new Error("packed Vite app must use the default config");
  }

  console.log("Installing packed tarballs");
  await run("npm", ["install", "--no-audit", "--no-fund"], dir);
  const sparklineSource = readFileSync(
    join(dir, "node_modules", "@rowan-ui", "core", "src", "sparkline", "sparkline.js"),
    "utf8",
  );
  if (!sparklineSource.includes("static styles = componentStyles")) {
    throw new Error("packed @rowan-ui/core still loads sparkline CSS from a URL");
  }
  if (sparklineSource.includes("styleUrl")) {
    throw new Error("packed sparkline.js still sets styleUrl");
  }
  const resolved = realpathSync(join(dir, "node_modules", "@rowan-ui", "core", "package.json"));
  if (resolved.startsWith(`${repoRoot}${sep}`)) {
    throw new Error(`packed core resolved into the workspace: ${resolved}`);
  }

  await exercise({ name: "packed-vite" }, dir, context, 20);
}

async function main() {
  const sandbox = realpathSync(mkdtempSync(join(tmpdir(), "rowan-standalone-")));
  if (sandbox === repoRoot || sandbox.startsWith(`${repoRoot}${sep}`)) {
    throw new Error(`Refusing to install inside the repo (${sandbox})`);
  }
  console.log(`Standalone sandbox: ${sandbox}`);

  let browser = null;
  try {
    const installed = PROJECTS.map((project) => {
      const dir = join(sandbox, project.name);
      copyProject(join(repoRoot, project.source), dir);
      return { ...project, dir };
    });

    await Promise.all(
      installed.map((project) => {
        console.log(`Installing registry dependencies in ${project.name}`);
        return run("npm", ["install", "--no-audit", "--no-fund"], project.dir);
      }),
    );

    for (const project of installed) {
      const config = readFileSync(join(project.dir, "vite.config.js"), "utf8");
      if (config.includes("optimizeDeps")) {
        throw new Error(`${project.name} vite.config.js must use Vite's default prebundle`);
      }
      const versions = assertRegistryInstall(project.dir);
      console.log(`${project.name} resolved ${JSON.stringify(versions)}`);
    }

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      colorScheme: "light",
    });
    try {
      for (const [index, project] of installed.entries()) {
        await exercise(project, project.dir, context, index);
      }
      await smokePackedDefaultVite(sandbox, context);
    } finally {
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    rmSync(sandbox, { recursive: true, force: true });
  }

  console.log("\n✓ Standalone registry apps render with Rowan styles");
}

main().catch((error) => {
  console.error("\n❌ Standalone registry smoke failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
