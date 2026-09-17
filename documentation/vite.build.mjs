import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const documentationRoot = fileURLToPath(new URL(".", import.meta.url));

export default {
  root: documentationRoot,
  base: "./",
  publicDir: resolve(documentationRoot, "../brand"),
  build: {
    outDir: resolve(documentationRoot, "documentation-static-check"),
    emptyOutDir: true,
  },
};
