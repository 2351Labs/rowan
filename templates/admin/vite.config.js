import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const templateRoot = dirname(fileURLToPath(import.meta.url));

// Relative build URLs so `dist/` works at the site root and at `/rowan/admin/`.
export default defineConfig(({ command }) => ({
  root: templateRoot,
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
