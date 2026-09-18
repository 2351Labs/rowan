import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Rowan",
    brandUrl: "./",
    brandImage: "./brand/rowan.png",
    brandTarget: "_self",
    colorPrimary: "#7fc095",
    colorSecondary: "#7fc095",
    appBg: "#111714",
    appContentBg: "#1a221d",
    appPreviewBg: "#111714",
    appBorderColor: "#2f3d35",
    barBg: "#1a221d",
    barTextColor: "#bec7bc",
    barSelectedColor: "#7fc095",
    textColor: "#ecf0e9",
    textMutedColor: "#bec7bc",
    inputBg: "#111714",
    inputBorder: "#2f3d35",
    inputTextColor: "#ecf0e9",
  }),
});
