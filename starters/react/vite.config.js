import { defineConfig } from "vite";

export default defineConfig({
  // Vite's dep prebundle rewrites `new URL("./x.css", import.meta.url)` to
  // `/node_modules/.vite/deps/*.css`, which is never emitted. Rowan loads each
  // component stylesheet from that URL, so a registry install (StackBlitz)
  // renders with no shadow styles. Leave the packages unbundled.
  optimizeDeps: {
    exclude: ["@rowan-ui/core", "@rowan-ui/icons"],
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  server: {
    host: "127.0.0.1",
    port: 5176,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
