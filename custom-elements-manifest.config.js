import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** @type {import("@custom-elements-manifest/analyzer").Config} */
export default {
  globs: ["src/**/*.js"],
  exclude: ["src/**/*.stories.js", "src/**/*.test.js"],
  outdir: ".",
  overrideModuleCreation({ ts, globs }) {
    return [...globs]
      .sort((left, right) => left.localeCompare(right))
      .map((glob) =>
        ts.createSourceFile(
          glob,
          readFileSync(resolve(process.cwd(), glob), "utf8"),
          ts.ScriptTarget.ES2015,
          true,
        ),
      );
  },
};
