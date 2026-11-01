import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CHART_CSS_IMPORT = /@import\s+["'](\.\.\/chart\/[^"']+\.css)["'];?/g;

function inlineChartImports(css) {
  if (!css.includes("../chart/")) return css;
  return css.replace(CHART_CSS_IMPORT, (_match, specifier) => {
    const file = resolve(process.cwd(), "src/chart", specifier.slice("../chart/".length));
    return `${readFileSync(file, "utf8")}\n`;
  });
}

function inlineCssDataUrls(code) {
  return code.replace(/data:text\/css(?:;charset=[^;,]+)?;base64,([A-Za-z0-9+/=]+)/g, (match, encoded) => {
    const css = Buffer.from(encoded, "base64").toString("utf8");
    const next = inlineChartImports(css);
    if (next === css) return match;
    return `data:text/css;base64,${Buffer.from(next).toString("base64")}`;
  });
}

function inlineChartCssImports() {
  return {
    name: "inline-chart-css-imports",
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === "chunk") {
          item.code = inlineCssDataUrls(item.code);
          continue;
        }
        if (item.type !== "asset" || !String(item.fileName).endsWith(".css")) continue;
        const source =
          typeof item.source === "string" ? item.source : Buffer.from(item.source).toString("utf8");
        item.source = inlineChartImports(source);
      }
    },
  };
}

function withTrailingSlash(value) {
  const base = String(value || "/");
  if (base === "/") return "/";
  return base.endsWith("/") ? base : `${base}/`;
}

/**
 * GitHub Pages serves this repo at `/<repo>/` and copies the Storybook build to
 * `/<repo>/storybook/`. A base of `/<repo>/` requests scripts from `/<repo>/assets/`,
 * which 404s. `STORYBOOK_BASE` overrides the path (CI sets `/rowan/storybook/`).
 */
function storybookBase() {
  if (process.env.STORYBOOK_BASE) return withTrailingSlash(process.env.STORYBOOK_BASE);

  if (process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REPOSITORY) {
    const repository = process.env.GITHUB_REPOSITORY.split("/")[1];
    return `/${repository}/storybook/`;
  }

  return "/";
}

export default {
  staticDirs: [{ from: "../brand", to: "/brand" }],
  stories: [
    "../src/**/*.stories.js",
    "../src/**/*.stories.jsx",
    "../packages/*/src/**/*.stories.js",
    "../stories/**/*.stories.js",
    "../stories/**/*.mdx",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  core: {
    disableProjectJson: true,
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    config.base = storybookBase();
    config.plugins = [...(config.plugins || []), inlineChartCssImports()];
    config.esbuild = {
      ...config.esbuild,
      jsx: "automatic",
      jsxImportSource: "react",
    };
    return config;
  },
};
