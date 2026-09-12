import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { nodeResolve, rollupBundlePlugin } from "@web/dev-server-rollup";

export const reactTestPlugins = [
  rollupBundlePlugin({
    rollupConfig: {
      input: "src/react/react.test.js",
      external: [
        "@esm-bundle/chai",
        "../table/table.js",
        "../status-indicator/status-indicator.js",
      ],
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
  }),
];

export default {
  plugins: reactTestPlugins,
};
