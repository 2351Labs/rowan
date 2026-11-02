#!/usr/bin/env node
/**
 * Install templates/admin and the starters outside the monorepo and smoke-test
 * them against the npm registry, which is what StackBlitz does.
 *
 * Inside this repo, npm workspaces link @rowan-ui/* to the local sources, and
 * Vite does not prebundle those links. A copied folder resolves the published
 * packages. Vite then prebundles them and rewrites
 * `new URL("./component.css", import.meta.url)` to a CSS file it never emits,
 * so shadow styles 404 and the page renders unstyled. Each app excludes those
 * packages from optimizeDeps. This script fails if that regresses.
 */

import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
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

function assertRegistryInstall(dir) {
  const versions = {};
  for (const name of ["@rowan-ui/core", "@rowan-ui/icons"]) {
    const manifest = join(dir, "node_modules", name, "package.json");
    if (!existsSync(manifest)) {
      throw new Error(`${dir} did not install ${name}`);
    }
    const resolved = realpathSync(manifest);
    if (resolved === repoRoot || resolved.startsWith(`${repoRoot}${sep}`)) {
      throw new Error(`${name} resolved to the workspace at ${resolved}`);
    }
    versions[name] = JSON.parse(readFileSync(resolved, "utf8")).version;
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
  const plot = spark?.shadowRoot?.querySelector(".plot");
  const plotHeight = plot ? plot.getBoundingClientRect().height : 0;
  const mark = spark?.shadowRoot?.querySelector(".line, .area");
  const paint = mark ? getComputedStyle(mark) : null;
  const paintColor = mark?.classList.contains("area") ? paint?.fill : paint?.stroke;
  details.sparkHref = link?.href ?? "";
  details.sparkRules = rules;
  details.plotHeight = plotHeight;
  details.sparkPaint = paintColor ?? "";
  if (!link || rules < 5 || link.href.includes("/.vite/deps/")) {
    problems.push(`sparkline stylesheet did not apply (${link?.href || "no link"}, ${rules} rules)`);
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
