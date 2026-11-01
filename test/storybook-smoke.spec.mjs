/**
 * Storybook smoke test. Serves storybook-static and opens every story.
 *
 * Fails when a story throws, logs a console error, renders NaN/undefined
 * text, or a chart story draws no data marks or an empty-state message.
 * Empty, loading, error, disabled, and "No data" stories are exempt.
 */

import { chromium } from "playwright";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CHART_RENDER_CONFIG, inspectRenderedCharts } from "./chart-render-check.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const storybookDir = resolve(__dirname, "../storybook-static");
const indexPath = resolve(storybookDir, "index.json");

const CHART_DIRS = new Set([
  "area-chart",
  "bar-chart",
  "box-plot-chart",
  "bullet-chart",
  "column-sparkline",
  "combo-chart",
  "donut-chart",
  "funnel-chart",
  "gauge-chart",
  "heatmap-chart",
  "kpi-card",
  "radar-chart",
  "range-chart",
  "scatter-chart",
  "sparkline",
  "stacked-area-chart",
  "stacked-bar-chart",
  "trend-chart",
  "waterfall-chart",
]);

// Longest prefix first. CI builds Storybook with base `/rowan/storybook/`.
const SITE_BASES = ["rowan/storybook/", "rowan/"];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

const NO_MARK_STORY = /\b(empty|loading|error|disabled|no data)\b/i;

function isChartStory(story) {
  const match = String(story.importPath || "").match(/(?:^|\/)src\/([^/]+)\//);
  return Boolean(match && CHART_DIRS.has(match[1]));
}

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  // The Pages build requests assets from `/rowan/storybook/`. This server hosts
  // storybook-static at the site root, so strip that prefix when it is present.
  for (const base of SITE_BASES) {
    if (relative === base.slice(0, -1) || relative.startsWith(base)) {
      relative = relative.slice(base.length) || "index.html";
      break;
    }
  }
  const filePath = normalize(join(storybookDir, relative));
  if (filePath !== storybookDir && !filePath.startsWith(`${storybookDir}/`)) {
    return null;
  }
  return filePath;
}

function startServer(port) {
  const server = createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }

    const filePath = safeFilePath(req.url || "/");
    if (!filePath) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    try {
      let resolved = filePath;
      const stat = statSync(resolved);
      if (stat.isDirectory()) resolved = join(resolved, "index.html");
      const contentType = CONTENT_TYPES[extname(resolved)] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      createReadStream(resolved).pipe(res);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolveListen(server));
  });
}

async function waitForChartRender(page) {
  const deadline = Date.now() + 5000;
  let result = await page.evaluate(inspectRenderedCharts, CHART_RENDER_CONFIG);
  while (result.problems.length > 0 && Date.now() < deadline) {
    await page.waitForTimeout(100);
    result = await page.evaluate(inspectRenderedCharts, CHART_RENDER_CONFIG);
  }
  return result;
}

async function runSmokeTests() {
  if (!existsSync(indexPath)) {
    console.error("Storybook not built. Run `npm run build-storybook` first.");
    process.exit(1);
  }

  const indexData = JSON.parse(readFileSync(indexPath, "utf-8"));
  let stories = Object.entries(indexData.entries || {})
    .filter(([, entry]) => entry.type === "story")
    .map(([id, entry]) => ({ id, ...entry }));

  const filter = process.env.SMOKE_FILTER;
  if (filter) {
    const pattern = new RegExp(filter, "i");
    stories = stories.filter(
      (story) => pattern.test(story.id) || pattern.test(story.title) || pattern.test(story.importPath || ""),
    );
  }

  const limit = Number(process.env.SMOKE_LIMIT || 0);
  if (limit > 0) stories = stories.slice(0, limit);

  console.log(`\nTesting ${stories.length} stories...\n`);

  const port = Number(process.env.SMOKE_PORT || 6006);
  const server = await startServer(port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const httpFailures = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Resource 404s are tracked from responses so intentional image fallbacks
    // do not fail the run. Script and stylesheet misses still fail below.
    if (msg.text().startsWith("Failed to load resource:")) return;
    consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    let pathname = response.url();
    try {
      const url = new URL(response.url());
      if (url.origin !== `http://127.0.0.1:${port}`) return;
      pathname = url.pathname;
    } catch {
      return;
    }
    if (/\.(avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|otf)$/i.test(pathname)) return;
    httpFailures.push(`${response.status()} ${pathname}`);
  });

  const results = [];
  let passed = 0;
  let failed = 0;

  try {
    for (const story of stories) {
      consoleErrors.length = 0;
      pageErrors.length = 0;
      httpFailures.length = 0;
      const errors = [];
      const url = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForSelector("#storybook-root", { timeout: 10000 });
        if (isChartStory(story) && !NO_MARK_STORY.test(story.name)) {
          const rendered = await waitForChartRender(page);
          for (const problem of rendered.problems) errors.push(problem);
        } else {
          await page.waitForTimeout(200);
        }

        const hasInvalidText = await page.evaluate(() => {
          const text = document.body?.innerText || "";
          return /\bNaN\b/.test(text) || /\bundefined\b/.test(text);
        });
        if (hasInvalidText) errors.push("Found NaN or undefined in rendered text");
      } catch (error) {
        errors.push(error.message);
      }

      const storyConsoleErrors = [...consoleErrors];
      const storyPageErrors = [...pageErrors];
      const storyHttpFailures = [...httpFailures];
      if (storyPageErrors.length) errors.push(...storyPageErrors);
      if (storyHttpFailures.length) {
        errors.push(`Failed resources: ${storyHttpFailures.join(", ")}`);
      }

      if (errors.length === 0 && storyConsoleErrors.length === 0) {
        passed += 1;
        process.stdout.write(".");
      } else {
        failed += 1;
        process.stdout.write("F");
        results.push({
          story: `${story.title} / ${story.name}`,
          id: story.id,
          errors,
          consoleErrors: storyConsoleErrors,
        });
      }
    }
  } finally {
    await browser.close();
    await new Promise((done) => server.close(done));
  }

  console.log(`\n\n${passed} passed, ${failed} failed\n`);

  if (results.length > 0) {
    console.log("Failed stories:\n");
    for (const result of results) {
      console.log(`❌ ${result.story}`);
      if (result.errors.length > 0) console.log(`   Errors: ${result.errors.join(" | ")}`);
      if (result.consoleErrors.length > 0) {
        console.log(`   Console errors: ${result.consoleErrors.join(" | ")}`);
      }
    }
    process.exit(1);
  }

  console.log("✅ All stories passed smoke tests!\n");
}

runSmokeTests().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
