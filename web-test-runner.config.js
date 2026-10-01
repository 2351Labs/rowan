import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { nodeResolve, rollupBundlePlugin } from "@web/dev-server-rollup";
import svelte from "rollup-plugin-svelte";

function createBundledTestPlugin(input, external, transformPlugins = []) {
  return rollupBundlePlugin({
    rollupConfig: {
      input,
      external,
      output: { format: "es" },
      onwarn(warning, warn) {
        if (
          warning.code === "CIRCULAR_DEPENDENCY" &&
          warning.ids?.every((id) => id.includes("/node_modules/svelte/"))
        ) {
          return;
        }

        warn(warning);
      },
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            "process.env.NODE_ENV": JSON.stringify("development"),
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
          },
        }),
        ...transformPlugins,
        nodeResolve({ browser: true }),
        commonjs(),
      ],
    },
  });
}

export const frameworkTestPlugins = [
  createBundledTestPlugin("src/react/react.test.js", [
    "@esm-bundle/chai",
    "../table/table.js",
    "../status-indicator/status-indicator.js",
  ]),
  createBundledTestPlugin("test-fixtures/react-18/react-18-ssr.test.js", [
    "@esm-bundle/chai",
    "../../src/button/button.js",
  ]),
  createBundledTestPlugin("test-fixtures/vue/vue.test.js", [
    "@esm-bundle/chai",
    "../../src/button/button.js",
    "../../src/checkbox/checkbox.js",
    "../../src/table/table.js",
  ]),
  createBundledTestPlugin(
    "test-fixtures/svelte/svelte.test.js",
    [
      "@esm-bundle/chai",
      "../../src/button/button.js",
      "../../src/checkbox/checkbox.js",
      "../../src/table/table.js",
    ],
    [svelte({ compilerOptions: { dev: true } })],
  ),
  createBundledTestPlugin("test-fixtures/angular/angular.test.js", [
    "@esm-bundle/chai",
    "../../src/button/button.js",
    "../../src/checkbox/checkbox.js",
    "../../src/table/table.js",
  ]),
];

export default {
  plugins: frameworkTestPlugins,
};
