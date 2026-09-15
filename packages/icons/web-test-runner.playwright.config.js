import { playwrightLauncher } from "@web/test-runner-playwright";

const product = process.env.ROWAN_BROWSER || "chromium";

export default {
  browsers: [playwrightLauncher({ product })],
};
