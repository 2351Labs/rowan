// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.
import * as multiSelectComboboxTokens0 from "./parts/multi-select-combobox.js";
import * as segmentedControlTokens1 from "./parts/segmented-control.js";
import * as richTextEditorTokens2 from "./parts/rich-text-editor.js";
import * as sideNavSectionTokens3 from "./parts/side-nav-section.js";
import * as statusIndicatorTokens4 from "./parts/status-indicator.js";
import * as confirmDialogTokens5 from "./parts/confirm-dialog.js";
import * as sideNavItemTokens6 from "./parts/side-nav-item.js";
import * as colorPickerTokens7 from "./parts/color-picker.js";
import * as contextMenuTokens8 from "./parts/context-menu.js";
import * as virtualListTokens9 from "./parts/virtual-list.js";
import * as formLayoutTokens10 from "./parts/form-layout.js";
import * as trendChartTokens11 from "./parts/trend-chart.js";
import * as appLayoutTokens12 from "./parts/app-layout.js";
import * as formFieldTokens13 from "./parts/form-field.js";
import * as splitPaneTokens14 from "./parts/split-pane.js";
import * as carouselTokens15 from "./parts/carousel.js";
import * as sideNavTokens16 from "./parts/side-nav.js";
import * as skeletonTokens17 from "./parts/skeleton.js";
import * as listboxTokens18 from "./parts/listbox.js";
import * as buttonTokens19 from "./parts/button.js";
import * as optionTokens20 from "./parts/option.js";
import * as ratingTokens21 from "./parts/rating.js";
import * as sliderTokens22 from "./parts/slider.js";
import * as imageTokens23 from "./parts/image.js";
import * as tableTokens24 from "./parts/table.js";
import * as chipTokens25 from "./parts/chip.js";
import * as sharedTokens from "./parts/shared.js";
export { tokenPropertiesRegistered, tokenPropertyDefinitions } from "./foundation.js";
export { probeNames, rowanTokenStyleSheet, tokenCssText } from "./legacy-sheet.js";

const componentTokenParts = [
  multiSelectComboboxTokens0,
  segmentedControlTokens1,
  richTextEditorTokens2,
  sideNavSectionTokens3,
  statusIndicatorTokens4,
  confirmDialogTokens5,
  sideNavItemTokens6,
  colorPickerTokens7,
  contextMenuTokens8,
  virtualListTokens9,
  formLayoutTokens10,
  trendChartTokens11,
  appLayoutTokens12,
  formFieldTokens13,
  splitPaneTokens14,
  carouselTokens15,
  sideNavTokens16,
  skeletonTokens17,
  listboxTokens18,
  buttonTokens19,
  optionTokens20,
  ratingTokens21,
  sliderTokens22,
  imageTokens23,
  tableTokens24,
  chipTokens25,
  sharedTokens,
];

export const componentTokenDeclarations = componentTokenParts.flatMap((part) => part.declarations);

export const unregisteredTokenNames = componentTokenDeclarations.map(([name]) => name);

export function componentTokenCssFor(prefixes = []) {
  const declarations = componentTokenDeclarations
    .filter(([name]) => prefixes.some((prefix) => name.startsWith(prefix)))
    .map(([name, value]) => "  " + name + ": " + value + ";");

  return declarations.length === 0 ? "" : ":host {\n" + declarations.join("\n") + "\n}";
}
