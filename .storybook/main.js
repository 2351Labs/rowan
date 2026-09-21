function storybookBase() {
  if (process.env.STORYBOOK_BASE) return process.env.STORYBOOK_BASE;

  if (process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REPOSITORY) {
    const repository = process.env.GITHUB_REPOSITORY.split("/")[1];
    return `/${repository}/`;
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
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y", "storybook-addon-playground"],
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
    config.esbuild = {
      ...config.esbuild,
      jsx: "automatic",
      jsxImportSource: "react",
    };
    return config;
  },
};
