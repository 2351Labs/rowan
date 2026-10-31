import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const templateRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(templateRoot, "../..");

// Chart stylesheets @import "../chart/hover.css" from the component file.
// Vite emits the component CSS under /assets, so that relative URL no longer
// points at the source tree. Copy the two sheets to dist/chart/, which is
// where /assets/*.css resolves "../chart/*.css".
function copyChartStyleSheets() {
  return {
    name: "rowan-chart-css-imports",
    apply: "build",
    closeBundle() {
      const target = resolve(templateRoot, "dist/chart");
      mkdirSync(target, { recursive: true });
      for (const name of ["hover.css", "point-controls.css"]) {
        copyFileSync(resolve(repoRoot, "src/chart", name), resolve(target, name));
      }
    },
  };
}

// Relative build URLs so `dist/` works at the site root and at `/rowan/admin/`.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [copyChartStyleSheets()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
}));
