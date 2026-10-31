/**
 * Serves the built admin template and opens every route.
 * Fails on page errors, console errors, or a visible NaN.
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { SAMPLE_CUSTOMER_ID, SAMPLE_ORDER_ID } from "../src/fixtures.js";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

const ROUTES = [
  {
    hash: "#/",
    heading: "Overview",
    tags: ["rowan-app-layout", "rowan-kpi-card", "rowan-trend-chart"],
  },
  { hash: "#/orders", heading: "Orders", tags: ["rowan-table", "rowan-filter-builder"] },
  { hash: `#/orders/${SAMPLE_ORDER_ID}`, heading: "Order", tags: ["rowan-tabs", "rowan-stepper"] },
  { hash: "#/customers", heading: "Customers", tags: ["rowan-table"] },
  {
    hash: `#/customers/${SAMPLE_CUSTOMER_ID}`,
    heading: "Northwind",
    tags: ["rowan-tabs", "rowan-form-field"],
  },
  { hash: "#/settings", heading: "Settings", tags: ["rowan-switch", "rowan-dropzone"] },
  { hash: "#/map", heading: "Fulfillment map", tags: ["rowan-maplibre-map"] },
  { hash: "#/sign-in", heading: "Sign in", tags: ["rowan-text-field", "rowan-button"] },
  { hash: "#/sign-up", heading: "Create an account", tags: ["rowan-form-field"] },
  { hash: "#/forgot-password", heading: "Reset password", tags: ["rowan-text-field"] },
  { hash: "#/missing-page", heading: "Page not found", tags: ["rowan-empty-state"] },
];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function filePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const resolved = normalize(join(distDir, relative));
  if (resolved !== distDir && !resolved.startsWith(`${distDir}/`)) return null;
  return resolved;
}

function startServer() {
  const server = createServer((request, response) => {
    if (request.url === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }

    const path = filePath(request.url || "/");
    if (!path || !existsSync(path)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const stat = statSync(path);
    const resolved = stat.isDirectory() ? join(path, "index.html") : path;
    const type = CONTENT_TYPES[extname(resolved)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    createReadStream(resolved).pipe(response);
  });

  return new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolveListen(server));
  });
}

function isIgnorable(message) {
  return /favicon\.ico/i.test(message);
}

if (!existsSync(join(distDir, "index.html"))) {
  console.error(
    "Admin build output not found. Run: npm run build --workspace=@rowan-ui/admin-template",
  );
  process.exit(1);
}

const server = await startServer();
const { port } = server.address();
const browser = await chromium.launch();
const failures = [];

try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      if (!isIgnorable(text)) errors.push(text);
    });
    page.on("pageerror", (error) => {
      errors.push(error instanceof Error ? error.stack || error.message : String(error));
    });

    const url = `http://127.0.0.1:${port}/${route.hash}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("[data-ready='true']", { timeout: 20000 });
    await page.waitForTimeout(route.hash === "#/map" ? 2500 : 700);

    const text = await page.locator("body").innerText();
    if (/\bNaN\b/.test(text)) errors.push("Visible NaN in the page");
    if (!text.includes(route.heading)) errors.push(`Missing heading text: ${route.heading}`);

    const missing = await page.evaluate((tags) => {
      return tags.filter((tag) => document.querySelector(tag) == null);
    }, route.tags);
    if (missing.length) errors.push(`Missing elements: ${missing.join(", ")}`);

    if (errors.length) {
      failures.push({ route: route.hash, errors });
      console.error(`\n❌ ${route.hash}`);
      for (const error of errors) console.error(`   ${error}`);
    } else {
      console.log(`✓ ${route.hash}`);
    }

    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

if (failures.length) {
  console.error(`\nAdmin smoke failed on ${failures.length} route(s).`);
  process.exit(1);
}

console.log(`\nAdmin smoke passed (${ROUTES.length} routes).`);
