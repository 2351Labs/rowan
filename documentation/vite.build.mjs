import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const documentationRoot = fileURLToPath(new URL(".", import.meta.url));

function copyLlmsFiles() {
  return {
    name: "rowan-llms-txt",
    closeBundle() {
      const repoRoot = resolve(documentationRoot, "..");
      const outDir = resolve(documentationRoot, "documentation-static-check");
      for (const name of ["llms.txt", "llms-full.txt"]) {
        copyFileSync(resolve(repoRoot, name), resolve(outDir, name));
      }
    },
  };
}

export default {
  root: documentationRoot,
  base: "./",
  publicDir: resolve(documentationRoot, "../brand"),
  plugins: [copyLlmsFiles()],
  build: {
    outDir: resolve(documentationRoot, "documentation-static-check"),
    emptyOutDir: true,
  },
};
