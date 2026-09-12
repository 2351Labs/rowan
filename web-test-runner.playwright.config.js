import { playwrightLauncher } from "@web/test-runner-playwright";

import { reactTestPlugins } from "./web-test-runner.config.js";

const browser = process.env.ROWAN_BROWSER ?? "chromium";
const supportedBrowsers = new Set(["chromium", "firefox", "webkit"]);

if (!supportedBrowsers.has(browser)) {
  throw new Error(`Unsupported ROWAN_BROWSER "${browser}". Use chromium, firefox, or webkit.`);
}

export default {
  browsers: [playwrightLauncher({ product: browser })],
  plugins: reactTestPlugins,
};
