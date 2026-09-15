import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { nodeResolve, rollupBundlePlugin } from "@web/dev-server-rollup";

function createReactTestPlugin(input, external) {
  return rollupBundlePlugin({
    rollupConfig: {
      input,
      external,
      output: { format: "es" },
      plugins: [
        replace({
          preventAssignment: true,
          values: { "process.env.NODE_ENV": JSON.stringify("development") },
        }),
        nodeResolve({ browser: true }),
        commonjs(),
      ],
    },
  });
}

export const reactTestPlugins = [
  createReactTestPlugin("src/react/react.test.js", [
    "@esm-bundle/chai",
    "../table/table.js",
    "../status-indicator/status-indicator.js",
  ]),
  createReactTestPlugin("test-fixtures/react-18/react-18-ssr.test.js", [
    "@esm-bundle/chai",
    "../../src/button/button.js",
  ]),
];

export default {
  plugins: reactTestPlugins,
};
