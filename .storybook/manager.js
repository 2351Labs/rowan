import { addons } from "@storybook/manager-api";

import { rowanManagerTheme } from "./rowan-theme.js";

addons.setConfig({
  theme: rowanManagerTheme,
});
