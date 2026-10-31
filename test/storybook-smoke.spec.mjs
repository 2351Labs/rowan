/**
 * Storybook smoke test - validates all stories render without errors.
 * 
 * For charts specifically, checks that data marks are rendered (not empty).
 * Fails on console errors or missing chart elements.
 */

import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const storybookDir = resolve(__dirname, "../storybook-static");
const indexPath = resolve(storybookDir, "index.json");

const CHART_COMPONENTS = new Set([
  "rowan-area-chart",
  "rowan-bar-chart",
  "rowan-box-plot-chart",
  "rowan-bullet-chart",
  "rowan-column-sparkline",
  "rowan-combo-chart",
  "rowan-donut-chart",
  "rowan-funnel-chart",
  "rowan-gauge-chart",
  "rowan-heatmap-chart",
  "rowan-radar-chart",
  "rowan-range-chart",
  "rowan-scatter-chart",
  "rowan-sparkline",
  "rowan-stacked-area-chart",
  "rowan-stacked-bar-chart",
  "rowan-trend-chart",
  "rowan-waterfall-chart",
]);

async function testStory(page, story, url) {
  const errors = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 10000 });
    await page.waitForTimeout(1000); // Let story render

    // Check if this is a chart story
    const isChartStory = Array.from(CHART_COMPONENTS).some((tag) =>
      story.title.toLowerCase().includes(tag.replace("rowan-", "")),
    );

    if (isChartStory && !story.name.toLowerCase().includes("empty")) {
      // For non-empty chart stories, verify chart content exists
      const hasChartContent = await page.evaluate((chartTags) => {
        for (const tag of chartTags) {
          const chart = document.querySelector(tag);
          if (!chart) continue;

          const shadowRoot = chart.shadowRoot;
          if (!shadowRoot) continue;

          // Check for SVG content (most charts use SVG)
          const svg = shadowRoot.querySelector("svg");
          if (svg) {
            // Check for data marks (paths, circles, rects, lines)
            const marks = svg.querySelectorAll("path, circle, rect, line");
            if (marks.length > 0) return true;
          }

          // Check for canvas (some charts might use canvas)
          const canvas = shadowRoot.querySelector("canvas");
          if (canvas) return true;
        }
        return false;
      }, Array.from(CHART_COMPONENTS));

      if (!hasChartContent) {
        errors.push("Chart rendered with no visible data marks");
      }
    }

    // Check for NaN or undefined in text content
    const hasInvalidText = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("NaN") || text.includes("undefined");
    });

    if (hasInvalidText) {
      errors.push("Found NaN or undefined in rendered text");
    }

    return {
      success: errors.length === 0 && consoleErrors.length === 0,
      errors,
      consoleErrors,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
      consoleErrors,
    };
  }
}

async function runSmokeTests() {
  if (!require("fs").existsSync(indexPath)) {
    console.error("Storybook not built. Run `npm run build-storybook` first.");
    process.exit(1);
  }

  const indexData = JSON.parse(readFileSync(indexPath, "utf-8"));
  const stories = Object.entries(indexData.entries || {})
    .filter(([_, entry]) => entry.type === "story")
    .map(([id, entry]) => ({ id, ...entry }));

  console.log(`\nTesting ${stories.length} stories...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const baseUrl = `http://localhost:6006`;

  // Start simple HTTP server for storybook
  const { createServer } = await import("http");
  const { createReadStream, statSync } = await import("fs");
  const { join, extname } = await import("path");

  const server = createServer((req, res) => {
    let filePath = join(storybookDir, req.url === "/" ? "index.html" : req.url);
    try {
      const stat = statSync(filePath);
      if (stat.isDirectory()) filePath = join(filePath, "index.html");
      const ext = extname(filePath);
      const contentTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".woff2": "font/woff2",
      };
      const contentType = contentTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(6006, resolve));

  let passed = 0;
  let failed = 0;

  for (const story of stories) {
    const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
    const result = await testStory(page, story, url);

    if (result.success) {
      passed++;
      process.stdout.write(".");
    } else {
      failed++;
      process.stdout.write("F");
      results.push({
        story: `${story.title} / ${story.name}`,
        id: story.id,
        ...result,
      });
    }
  }

  await browser.close();
  server.close();

  console.log(`\n\n${passed} passed, ${failed} failed\n`);

  if (results.length > 0) {
    console.log("Failed stories:\n");
    for (const result of results) {
      console.log(`❌ ${result.story}`);
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(", ")}`);
      }
      if (result.consoleErrors.length > 0) {
        console.log(`   Console errors: ${result.consoleErrors.join(", ")}`);
      }
    }
    process.exit(1);
  }

  console.log("✅ All stories passed smoke tests!\n");
  process.exit(0);
}

runSmokeTests().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
