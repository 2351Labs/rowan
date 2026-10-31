import { frameworkTestPlugins, testTimeouts } from "./web-test-runner.config.js";

/**
 * Same unit-test run as `npm test`, with Chromium V8 coverage over `src/`.
 * Firefox and WebKit do not expose this coverage API; behavior on those
 * browsers stays in the browser-compatibility job.
 * Thresholds here stay at zero. `scripts/report-test-coverage.mjs` enforces
 * the floor in `scripts/coverage-floors.json` and writes the summary.
 */
export default {
  ...testTimeouts,
  testsFinishTimeout: 300000,
  plugins: frameworkTestPlugins,
  coverage: true,
  coverageConfig: {
    include: ["src/**/*.js"],
    exclude: ["src/**/*.test.js", "src/**/*.stories.js", "src/storybook/**", "**/node_modules/**"],
    nativeInstrumentation: true,
    report: true,
    reportDir: "coverage",
    reporters: ["json-summary", "json", "text-summary"],
    threshold: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
