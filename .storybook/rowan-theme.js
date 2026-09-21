import { create, themes } from "@storybook/theming/create";

const brand = {
  brandTitle: "Rowan",
  brandUrl: "./",
  brandImage: "./brand/rowan_icon.svg",
  brandTarget: "_self",
  appBorderRadius: 6,
  inputBorderRadius: 4,
};

/** Sidebar and manager chrome. Spread themes.dark so missing keys do not fall back to light. */
export const rowanManagerTheme = create({
  ...themes.dark,
  ...brand,
  base: "dark",
  colorPrimary: "#7fc095",
  colorSecondary: "#7fc095",
  appBg: "#111714",
  appContentBg: "#1a221d",
  appPreviewBg: "#111714",
  appBorderColor: "#2f3d35",
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
});

/** Docs page and canvas. White surface; toolbar theme still paints the story. */
export const rowanDocsTheme = create({
  ...themes.light,
  ...brand,
  base: "light",
  colorPrimary: "#1d432f",
  colorSecondary: "#1d432f",
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#d8dcd5",
  barBg: "#ffffff",
  barTextColor: "#3d4a41",
  barSelectedColor: "#1d432f",
  barHoverColor: "#1d432f",
  textColor: "#1a221d",
  textMutedColor: "#5f6d62",
  textInverseColor: "#ffffff",
  inputBg: "#ffffff",
  inputBorder: "#d8dcd5",
  inputTextColor: "#1a221d",
});
