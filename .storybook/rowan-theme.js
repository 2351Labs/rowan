import { create, themes } from "@storybook/theming/create";

/** Manager + Docs chrome. Spread themes.dark so missing keys do not fall back to light. */
export const rowanManagerTheme = create({
  ...themes.dark,
  base: "dark",
  brandTitle: "Rowan",
  brandUrl: "./",
  brandImage: "./brand/rowan_icon.svg",
  brandTarget: "_self",
  colorPrimary: "#7fc095",
  colorSecondary: "#7fc095",
  appBg: "#111714",
  appContentBg: "#1a221d",
  appPreviewBg: "#111714",
  appBorderColor: "#2f3d35",
  appBorderRadius: 6,
  barBg: "#1a221d",
  barTextColor: "#bec7bc",
  barSelectedColor: "#7fc095",
  barHoverColor: "#7fc095",
  textColor: "#ecf0e9",
  textMutedColor: "#bec7bc",
  textInverseColor: "#111714",
  inputBg: "#111714",
  inputBorder: "#2f3d35",
  inputTextColor: "#ecf0e9",
  inputBorderRadius: 4,
});
