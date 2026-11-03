/**
 * Cartesian axis sanity.
 * Mounts every cartesian chart in light and dark and checks that the axes
 * it promises are present, that tick labels are separate elements, and that
 * those labels do not overlap or fall outside the chart.
 */

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

const PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/src/tokens/tokens.css" />
    <link rel="stylesheet" href="/src/tokens/themes/light.css" />
    <link rel="stylesheet" href="/src/tokens/themes/dark.css" />
    <style>
      body { margin: 0; background: var(--rowan-color-bg, #fff); color: var(--rowan-color-fg, #111); }
      #mount { display: grid; gap: 12px; padding: 16px; width: 640px; }
      .cell { width: 560px; }
    </style>
  </head>
  <body>
    <div id="mount"></div>
    <script type="module">
      import "/src/bar-chart/bar-chart.js";
      import "/src/trend-chart/trend-chart.js";
      import "/src/area-chart/area-chart.js";
      import "/src/stacked-area-chart/stacked-area-chart.js";
      import "/src/stacked-bar-chart/stacked-bar-chart.js";
      import "/src/combo-chart/combo-chart.js";
      import "/src/scatter-chart/scatter-chart.js";
      import "/src/heatmap-chart/heatmap-chart.js";
      import "/src/waterfall-chart/waterfall-chart.js";
      import "/src/range-chart/range-chart.js";
      import "/src/box-plot-chart/box-plot-chart.js";
      import "/src/funnel-chart/funnel-chart.js";

      const specs = [
        { id: "bar-chart", tag: "rowan-bar-chart", x: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed", "Thu"];
          el.series = [{ id: "in", label: "Incoming", values: [4, 8, 6, 9] }];
        }},
        { id: "trend-chart", tag: "rowan-trend-chart", x: true, y: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed"];
          el.series = [{ id: "incidents", label: "Incidents", values: [4, 8, 6] }];
        }},
        { id: "area-chart", tag: "rowan-area-chart", x: true, y: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed"];
          el.series = [{ id: "flow", label: "Flow", values: [4, 9, 6] }];
        }},
        { id: "stacked-area-chart", tag: "rowan-stacked-area-chart", x: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed"];
          el.series = [
            { id: "in", label: "Incoming", values: [4, 6, 5] },
            { id: "out", label: "Resolved", values: [1, 2, 3] },
          ];
        }},
        { id: "stacked-bar-chart", tag: "rowan-stacked-bar-chart", x: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed"];
          el.series = [
            { id: "in", label: "Incoming", values: [4, 6, 5] },
            { id: "out", label: "Resolved", values: [1, 2, 3] },
          ];
        }},
        { id: "combo-chart", tag: "rowan-combo-chart", x: true, y: true, y2: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
          el.series = [
            { id: "volume", label: "Volume", geometry: "bar", values: [180, 210, 164, 240, 198] },
            { id: "fill", label: "Fill rate", geometry: "line", axis: "secondary", values: [72, 81, 64, 88, 76] },
          ];
        }},
        { id: "scatter-chart", tag: "rowan-scatter-chart", x: true, y: true, apply(el) {
          el.series = [{ id: "north", label: "North", points: [
            { x: 12, y: 64, size: 8, label: "Dock 1" },
            { x: 18, y: 72, size: 14, label: "Dock 2" },
          ] }];
        }},
        { id: "heatmap-chart", tag: "rowan-heatmap-chart", x: true, y: true, apply(el) {
          el.rows = ["North", "South"];
          el.columns = ["Mon", "Tue", "Wed"];
          el.values = [[4, 9, 2], [1, 6, 8]];
        }},
        { id: "waterfall-chart", tag: "rowan-waterfall-chart", x: true, apply(el) {
          el.labels = ["Start", "In", "Out", "End"];
          el.series = [{ id: "cash", label: "Cash", values: [{ value: 20, type: "total" }, 10, -4, { value: 26, type: "total" }] }];
        }},
        { id: "range-chart", tag: "rowan-range-chart", x: true, y: true, apply(el) {
          el.labels = ["Mon", "Tue", "Wed"];
          el.series = [{ id: "dwell", label: "Dwell", values: [{ low: 4, high: 12 }, { low: 6, high: 10 }, { low: 7, high: 14 }] }];
        }},
        { id: "box-plot-chart", tag: "rowan-box-plot-chart", x: true, y: true, apply(el) {
          el.labels = ["North", "South"];
          el.series = [{ id: "dwell", label: "Dwell", values: [
            { min: 2, q1: 4, median: 6, q3: 9, max: 12 },
            { min: 3, q1: 5, median: 7, q3: 10, max: 14 },
          ] }];
        }},
        { id: "funnel-chart", tag: "rowan-funnel-chart", y: true, apply(el) {
          el.labels = ["Leads", "Qualified", "Won"];
          el.series = [{ id: "flow", label: "Flow", values: [40, 24, 10] }];
        }},
      ];

      function boxes(nodes) {
        return nodes
          .map((node) => {
            const box = node.getBoundingClientRect();
            return { text: node.textContent.trim(), left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
          })
          .filter((box) => box.width > 0 && box.height > 0 && box.text);
      }

      function separated(items, axis) {
        const sorted = [...items].sort((a, b) => (axis === "x" ? a.left - b.left : a.top - b.top));
        for (let index = 1; index < sorted.length; index += 1) {
          const previous = sorted[index - 1];
          const next = sorted[index];
          const overlap = axis === "x" ? previous.right - next.left : previous.bottom - next.top;
          if (overlap > 1) return previous.text + " overlaps " + next.text;
        }
        return "";
      }

      function inside(items, host) {
        for (const item of items) {
          if (item.left < host.left - 8 || item.right > host.right + 8 || item.top < host.top - 8 || item.bottom > host.bottom + 8) {
            return item.text;
          }
        }
        return "";
      }

      window.mount = (theme) => {
        document.documentElement.dataset.theme = theme;
        document.body.dataset.theme = theme;
        const mount = document.querySelector("#mount");
        mount.replaceChildren();
        for (const spec of specs) {
          const chart = document.createElement(spec.tag);
          chart.label = spec.id;
          spec.apply(chart);
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.dataset.chart = spec.id;
          cell.append(chart);
          mount.append(cell);
        }
      };

      window.inspect = () => {
        const failures = [];
        for (const spec of specs) {
          const chart = document.querySelector('[data-chart="' + spec.id + '"] > *');
          const root = chart?.shadowRoot;
          if (!root) {
            failures.push(spec.id + " did not render");
            continue;
          }
          const host = chart.getBoundingClientRect();
          const check = (name, selector, axis, required) => {
            const found = boxes([...root.querySelectorAll(selector)]);
            if (required && found.length < 2) {
              failures.push(spec.id + " " + name + " has " + found.length + " tick(s)");
              return;
            }
            if (!found.length) return;
            const hit = separated(found, axis);
            if (hit) failures.push(spec.id + " " + name + ": " + hit);
            const outside = inside(found, host);
            if (outside) failures.push(spec.id + " " + name + " tick outside the chart: " + outside);
            if (found.some((item) => item.text.length > 12 && !item.text.includes(" "))) {
              failures.push(spec.id + " " + name + " looks concatenated: " + found.map((item) => item.text).join("|"));
            }
          };
          check("x", ".x-axis span", "x", Boolean(spec.x));
          check("y", ".y-axis span", "y", Boolean(spec.y));
          check("y2", ".y-axis-secondary span", "y", Boolean(spec.y2));
          if (root.querySelector("svg.plot > .axis-pointer")) failures.push(spec.id + " shows a crosshair at rest");
        }
        return failures;
      };
    </script>
  </body>
</html>`;

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (request, response) => {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      if (url.pathname === "/axis-sanity.html") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(PAGE);
        return;
      }
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const filePath = normalize(join(rootDir, relative));
      if (filePath !== rootDir && !filePath.startsWith(`${rootDir}/`)) {
        response.writeHead(403);
        response.end();
        return;
      }
      try {
        const body = await readFile(filePath);
        response.writeHead(200, {
          "Content-Type": TYPES[extname(filePath)] || "application/octet-stream",
        });
        response.end(body);
      } catch {
        response.writeHead(404);
        response.end("missing");
      }
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const server = await startServer();
const { port } = server.address();
const browser = await chromium.launch();
const failures = [];

try {
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
  page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  await page.goto(`http://127.0.0.1:${port}/axis-sanity.html`, { waitUntil: "networkidle" });
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  for (const theme of ["light", "dark"]) {
    await page.evaluate((next) => window.mount(next), theme);
    await page.waitForFunction(() =>
      document.querySelector("rowan-scatter-chart")?.shadowRoot?.querySelector("circle.point"),
    );
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const themeFailures = await page.evaluate(() => window.inspect());
    for (const failure of themeFailures) failures.push(`${theme}: ${failure}`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("cartesian axis sanity passed in light and dark");
