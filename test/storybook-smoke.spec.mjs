/**
 * Storybook smoke test. Serves storybook-static and opens every story.
 *
 * Fails when a story throws, logs a console error, renders NaN/undefined
 * text, or a chart story draws no data marks. Empty, loading, error, and
 * disabled stories are allowed to draw no marks.
 */

import { chromium } from "playwright";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
  "radar-chart",
  "range-chart",
  "scatter-chart",
  "sparkline",
  "stacked-area-chart",
  "stacked-bar-chart",
  "trend-chart",
  "waterfall-chart",
]);

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
  // CI builds Storybook with base `/rowan/`. The smoke server still hosts the
  // static output at the site root, so strip that prefix when it is present.
  if (relative === "rowan" || relative.startsWith("rowan/")) {
    relative = relative.slice("rowan/".length) || "index.html";
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

async function storyHasDataMarks(page) {
  return page.evaluate((dirs) => {
    const charts = [...document.querySelectorAll("*")].filter((node) => {
      const tag = node.localName || "";
      return dirs.some((dir) => tag === `rowan-${dir}`);
    });

    for (const chart of charts) {
      const svg = chart.shadowRoot?.querySelector("svg");
      if (!svg) continue;
      const marks = [...svg.querySelectorAll("path, circle, rect, polygon, polyline, line")].filter(
        (mark) => {
          const role = `${mark.getAttribute("class") || ""} ${mark.getAttribute("part") || ""}`;
          if (/axis|grid|tick|frame|border|guide/.test(role)) return false;
          return true;
        },
      );
      if (marks.length > 0) return true;
    }
    return false;
  }, [...CHART_DIRS]);
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
          await page
            .waitForFunction(
              (dirs) =>
                dirs.some((dir) => {
                  const chart = document.querySelector(`rowan-${dir}`);
                  return chart?.shadowRoot?.querySelector("svg");
                }),
              [...CHART_DIRS],
              { timeout: 3000 },
            )
            .catch(() => {});
        } else {
          await page.waitForTimeout(200);
        }

        if (isChartStory(story) && !NO_MARK_STORY.test(story.name)) {
          const hasMarks = await storyHasDataMarks(page);
          if (!hasMarks) errors.push("Chart rendered with no visible data marks");
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
