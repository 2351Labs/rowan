/**
 * Documentation chart smoke test.
 * Serves the built docs site and opens every chart demo.
 * Fails when a demo does not upgrade, draws no data marks, or shows the
 * empty-state message outside its data table.
 */

import { chromium } from "playwright";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CHART_RENDER_CONFIG, inspectRenderedCharts } from "./chart-render-check.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "../documentation/documentation-static-check");

const DOC_CHART_PAGES = [
  "theming",
  "kpi-card",
  "sparkline",
  "column-sparkline",
  "bullet-chart",
  "gauge-chart",
  "chart-interactivity",
  "bar-chart",
  "area-chart",
  "stacked-area-chart",
  "stacked-bar-chart",
  "combo-chart",
  "donut-chart",
  "scatter-chart",
  "heatmap-chart",
  "funnel-chart",
  "waterfall-chart",
  "range-chart",
  "box-plot-chart",
  "radar-chart",
  "trend-chart",
  "dashboard-drill-down",
];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
  ".ico": "image/x-icon",
};

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = normalize(join(docsDir, relative));
  if (filePath !== docsDir && !filePath.startsWith(`${docsDir}/`)) return null;
  return filePath;
}

function startServer(port) {
  const server = createServer((req, res) => {
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

async function runDocsChartSmoke() {
  if (!existsSync(join(docsDir, "index.html"))) {
    console.error("Documentation not built. Run `npm run documentation:build` first.");
    process.exit(1);
  }

  const port = Number(process.env.DOCS_SMOKE_PORT || 4173);
  const server = await startServer(port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const failures = [];

  try {
    for (const pageId of DOC_CHART_PAGES) {
      const url = `http://127.0.0.1:${port}/#${pageId}`;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 30000 });
        await page.waitForSelector("#docs-main .doc-page", { timeout: 10000 });

        const deadline = Date.now() + 8000;
        let result = await page.evaluate(inspectRenderedCharts, CHART_RENDER_CONFIG);
        while (result.problems.length > 0 && Date.now() < deadline) {
          await page.waitForTimeout(100);
          result = await page.evaluate(inspectRenderedCharts, CHART_RENDER_CONFIG);
        }
        if (result.problems.length > 0) {
          failures.push({ pageId, problems: result.problems });
          process.stdout.write("F");
        } else {
          process.stdout.write(".");
        }
      } catch (error) {
        failures.push({ pageId, problems: [error.message] });
        process.stdout.write("F");
      }
    }
  } finally {
    await browser.close();
    await new Promise((done) => server.close(done));
  }

  console.log(`\n\n${DOC_CHART_PAGES.length - failures.length} passed, ${failures.length} failed\n`);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`❌ #${failure.pageId}`);
      for (const problem of failure.problems) console.error(`   ${problem}`);
    }
    process.exit(1);
  }

  console.log("✅ Documentation chart demos rendered with data\n");
}

runDocsChartSmoke().catch((error) => {
  console.error("Documentation chart smoke test failed:", error);
  process.exit(1);
});
