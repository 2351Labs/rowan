import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const templateRoot = dirname(fileURLToPath(import.meta.url));

// Relative build URLs so `dist/` works at the site root and at `/rowan/admin/`.
export default defineConfig(({ command }) => ({
  root: templateRoot,
  // Vite's dep prebundle rewrites `new URL("./x.css", import.meta.url)` to
  // `/node_modules/.vite/deps/*.css`, which is never emitted. Rowan loads each
  // component stylesheet from that URL, so a registry install (StackBlitz)
  // renders with no shadow styles. Leave the packages unbundled.
  optimizeDeps: {
    exclude: ["@rowan-ui/core", "@rowan-ui/icons", "@rowan-ui/maplibre"],
  },
  base: command === "build" ? "./" : "/",
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
