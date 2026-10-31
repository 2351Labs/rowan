/**
 * Test documentation sidebar navigation scrolling at various viewport sizes.
 * Verifies that when all navigation groups are expanded, the last item is
 * fully reachable by scrolling the sidebar independently of the page.
 */

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join, extname } from "node:path";
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "../documentation/documentation-static-check");

// Simple static file server for testing
function createStaticServer(rootDir, port) {
  const server = createServer((req, res) => {
    let filePath = join(rootDir, req.url === "/" ? "index.html" : req.url);

    try {
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        filePath = join(filePath, "index.html");
      }

      const ext = extname(filePath);
      const contentTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
      };

      const contentType = contentTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({ server, url: `http://localhost:${port}` });
    });
  });
}

async function testSidebarScroll() {
  // Start local server
  const { server, url } = await createStaticServer(docsDir, 8765);
  console.log(`Started test server at ${url}`);

  const browser = await chromium.launch({ headless: true });
  const testResults = [];

  const viewports = [
    { width: 1280, height: 720, name: "1280x720 (laptop)" },
    { width: 1440, height: 900, name: "1440x900 (desktop)" },
    { width: 1920, height: 1080, name: "1920x1080 (full HD)" },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
    });
    const page = await context.newPage();

    try {
      // Listen to console and errors
      page.on("console", (msg) => console.log(`PAGE LOG [${viewport.name}]:`, msg.text()));
      page.on("pageerror", (error) => console.error(`PAGE ERROR [${viewport.name}]:`, error));

      // Load the documentation site
      await page.goto(url, { waitUntil: "networkidle" });

      // Wait for navigation to be populated (not just present)
      await page.waitForSelector(".nav-link", { timeout: 10000 });

      // Expand all navigation sections
      const sections = await page.locator(".nav-section").all();
      for (const section of sections) {
        const toggle = section.locator(".nav-section-toggle");
        const isOpen = await section.getAttribute("data-open");
        if (isOpen === "false") {
          await toggle.click();
          // Wait for animation/expansion
          await page.waitForTimeout(100);
        }
      }

      // Get the sidebar navigation element
      const sidebarNav = page.locator(".sidebar-nav");

      // Get all nav links
      const navLinks = await page.locator(".nav-link").all();
      if (navLinks.length === 0) {
        throw new Error("No navigation links found");
      }

      const lastLink = navLinks[navLinks.length - 1];
      const lastLinkText = await lastLink.textContent();

      // Scroll the sidebar navigation to the bottom
      await sidebarNav.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });

      // Wait for scroll to settle
      await page.waitForTimeout(200);

      // Check if the last link is visible in the sidebar viewport
      const sidebarBox = await sidebarNav.boundingBox();
      const lastLinkBox = await lastLink.boundingBox();

      if (!sidebarBox || !lastLinkBox) {
        throw new Error("Could not get bounding boxes for sidebar or last link");
      }

      // Calculate if the last link is fully visible within the sidebar
      const isFullyVisible =
        lastLinkBox.y >= sidebarBox.y &&
        lastLinkBox.y + lastLinkBox.height <= sidebarBox.y + sidebarBox.height;

      // Also check if at least the top of the last link is visible
      const isPartiallyVisible =
        lastLinkBox.y + lastLinkBox.height >= sidebarBox.y &&
        lastLinkBox.y <= sidebarBox.y + sidebarBox.height;

      testResults.push({
        viewport: viewport.name,
        passed: isFullyVisible || isPartiallyVisible,
        lastLinkText: lastLinkText.trim(),
        sidebarHeight: sidebarBox.height,
        lastLinkY: lastLinkBox.y - sidebarBox.y,
        lastLinkHeight: lastLinkBox.height,
        isFullyVisible,
        isPartiallyVisible,
      });
    } catch (error) {
      testResults.push({
        viewport: viewport.name,
        passed: false,
        error: error.message,
      });
    } finally {
      await context.close();
    }
  }

  await browser.close();
  server.close();

  // Print results
  console.log("\n=== Documentation Sidebar Scroll Test Results ===\n");

  let allPassed = true;
  for (const result of testResults) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${result.viewport}`);

    if (result.error) {
      console.log(`  Error: ${result.error}`);
      allPassed = false;
    } else if (result.passed) {
      console.log(`  Last item: "${result.lastLinkText}"`);
      console.log(`  Sidebar height: ${result.sidebarHeight.toFixed(1)}px`);
      console.log(
        `  Last link position: ${result.lastLinkY.toFixed(1)}px (height: ${result.lastLinkHeight.toFixed(1)}px)`,
      );
      console.log(
        `  Visibility: ${result.isFullyVisible ? "fully visible" : "partially visible"}`,
      );
    } else {
      console.log(`  Last item: "${result.lastLinkText}" is not reachable`);
      allPassed = false;
    }
    console.log("");
  }

  if (allPassed) {
    console.log("✅ All viewport tests passed!\n");
    process.exit(0);
  } else {
    console.log("❌ Some tests failed\n");
    process.exit(1);
  }
}

testSidebarScroll().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
