/**
 * Documentation demo smoke test.
 * Serves the built docs site and opens every component page.
 * Fails when the primary demo is missing, tiny, or has no slotted content.
 */

import { chromium } from "playwright";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const docsDir = join(rootDir, "documentation/documentation-static-check");
const catalog = JSON.parse(readFileSync(join(rootDir, "documentation/generated/api-reference.json"), "utf8"));
const COMPONENT_PAGES = catalog.components.map((component) => component.tagName.replace(/^rowan-/, ""));

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

function inspectPrimaryDemo() {
  const main = document.querySelector("#docs-main");
  const apiTag = main?.querySelector("[data-api-tag]")?.getAttribute("data-api-tag") || "";
  if (!apiTag) return ["component page did not render an API reference"];

  const region =
    main.querySelector("[data-docs-primary-demo]") ||
    main.querySelector(
      ".demo-row, .docs-alert-showcase, .table-shell, .docs-app-layout-frame, .docs-selection-control, .docs-workflow-canvas, .docs-carousel-demo, .docs-image-grid, .docs-component-demo",
    );

  if (!region) {
    const code = [...main.querySelectorAll("pre code")].map((node) => node.textContent || "").join("\n");
    const compact = code.replace(/\s+/g, "");
    if (!code.includes(apiTag)) return [`${apiTag} has no live demo or copyable example`];
    if (compact === `<${apiTag}></${apiTag}>` || compact.includes(`<${apiTag}></${apiTag}>`) && compact.length < apiTag.length + 40) {
      return [`${apiTag} example is an empty element`];
    }
    return [];
  }

  const box = region.getBoundingClientRect();
  const hosts = [...region.querySelectorAll("*")].filter((el) => el.localName?.startsWith("rowan-"));

  function walk(node, visit) {
    if (!node) return;
    visit(node);
    if (node.shadowRoot) walk(node.shadowRoot, visit);
    for (const child of node.childNodes || []) walk(child, visit);
  }

  let text = "";
  let graphic = false;
  walk(region, (node) => {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent || "";
    if (node.nodeType === Node.ELEMENT_NODE && node.matches?.("svg, img, canvas")) graphic = true;
  });
  text = text.replace(/\s+/g, " ").trim();

  const problems = [];
  if (box.width < 48 || box.height < 12) {
    problems.push(`primary demo is ${Math.round(box.width)}×${Math.round(box.height)}`);
  }
  const painted = box.width >= 160 && box.height >= 64;
  if (text.length < 2 && !graphic && !painted) {
    problems.push("primary demo has no slotted or visible content");
  }
  if (hosts.length === 0 && !graphic) problems.push("primary demo does not render a component");
  return problems;
}

async function runDocsDemoSmoke() {
  if (!existsSync(join(docsDir, "index.html"))) {
    console.error("Documentation not built. Run `npm run documentation:build` first.");
    process.exit(1);
  }

  const port = Number(process.env.DOCS_DEMO_SMOKE_PORT || 4175);
  const server = await startServer(port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const failures = [];

  try {
    for (const pageId of COMPONENT_PAGES) {
      const url = `http://127.0.0.1:${port}/#${pageId}`;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 30000 });
        await page.waitForSelector("#docs-main .doc-page", { timeout: 10000 });
        await page.waitForTimeout(50);
        const problems = await page.evaluate(inspectPrimaryDemo);
        if (problems.length > 0) {
          failures.push({ pageId, problems });
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

  console.log(`\n\n${COMPONENT_PAGES.length - failures.length} passed, ${failures.length} failed\n`);
  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`❌ #${failure.pageId}`);
      for (const problem of failure.problems) console.error(`   ${problem}`);
    }
    process.exit(1);
  }

  console.log(`✅ ${COMPONENT_PAGES.length} component docs demos have visible content\n`);
}

runDocsDemoSmoke().catch((error) => {
  console.error("Documentation demo smoke test failed:", error);
  process.exit(1);
});
