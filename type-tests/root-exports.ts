import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  RowanButton,
  RowanCarousel,
  RowanCommandItem,
  RowanCommandPalette,
  RowanRating,
  RowanRichTextEditor,
  RowanTable,
  RowanTrendChart,
  RowanTree,
  RowanTreeItem,
} from "@rowan-ui/core";
type Assert<T extends true> = T;
type RootExports = typeof import("@rowan-ui/core");
type BaseElementIsInternal = Assert<"BaseElement" extends keyof RootExports ? false : true>;
import {
  formatDate as formatDateFromSubpath,
  type CurrencyFormatConfig,
  type DateFormatConfig,
  type NumberFormatConfig,
  type RelativeTimeFormatConfig,
} from "@rowan-ui/core/format";
import {
  ROWAN_VALIDITY_MESSAGES,
  resetValidityMessages,
  setValidityMessageResolver,
  setValidityMessages,
  validityMessage,
} from "@rowan-ui/core/validity-messages";
// @ts-expect-error BaseElement is an internal implementation detail.
type InternalBaseElement = import("@rowan-ui/core/lib/base-element").BaseElement;
import { debounce } from "@rowan-ui/core/lib/debounce";
import { define } from "@rowan-ui/core/lib/define";
import { emit } from "@rowan-ui/core/lib/events";
import { keys } from "@rowan-ui/core/lib/keys";
import {
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
} from "@rowan-ui/core/lib/reflect";
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/dark";
import "@rowan-ui/core/tokens/ember";
import "@rowan-ui/core/tokens/lagoon";
import "@rowan-ui/core/tokens/light";

const rootButton: RowanButton = document.createElement("rowan-button");
const rootCarousel: RowanCarousel = document.createElement("rowan-carousel");
const rootCommandItem: RowanCommandItem = document.createElement("rowan-command-item");
const rootCommandPalette: RowanCommandPalette = document.createElement("rowan-command-palette");
const rootRating: RowanRating = document.createElement("rowan-rating");
const rootRichTextEditor: RowanRichTextEditor = document.createElement("rowan-rich-text-editor");
const rootTable: RowanTable = document.createElement("rowan-table");
const rootTrendChart: RowanTrendChart = document.createElement("rowan-trend-chart");
const rootTree: RowanTree = document.createElement("rowan-tree");
const rootTreeItem: RowanTreeItem = document.createElement("rowan-tree-item");
const numberFormat: NumberFormatConfig = { locale: "de-DE", options: { maximumFractionDigits: 1 } };
const currencyFormat: CurrencyFormatConfig = { currency: "USD", locale: "en-US" };
const dateFormat: DateFormatConfig = { locale: "en-GB", timeZone: "UTC" };
const relativeTimeFormat: RelativeTimeFormatConfig = { locale: "en-US", unit: "day" };
const formattedNumber: string = formatNumber(1234.5, numberFormat);
const formattedCurrency: string = formatCurrency(1234.5, currencyFormat);
const formattedDate: string = formatDate("2026-09-13T12:00:00Z", dateFormat);
const formattedSubpathDate: string = formatDateFromSubpath("2026-09-13T12:00:00Z", dateFormat);
const formattedRelativeTime: string = formatRelativeTime(-1, relativeTimeFormat);
const defaultCheckboxMessage: string = ROWAN_VALIDITY_MESSAGES["valueMissing.checkbox"];
const localizedCheckboxMessage: string = validityMessage("valueMissing.checkbox");
setValidityMessages({ "valueMissing.checkbox": "Cochez cette case." });
setValidityMessageResolver((key, fallback) => (key === "valueMissing.checkbox" ? fallback : null));
resetValidityMessages();

rootButton.disabled = true;
rootCarousel.activeIndex = 1;
rootCommandItem.label = "Open settings";
rootCommandPalette.open = true;
rootRating.value = 4;
rootRating.value = "";
rootRichTextEditor.value = {
  blocks: [{ type: "paragraph", children: [{ text: "Operational guidance", bold: true }] }],
};
rootTrendChart.series = [{ id: "incidents", label: "Incidents", values: [4, 8, 3] }];
rootTrendChart.labels = ["Mon", "Tue", "Wed"];
rootTrendChart.valueFormatter = (value) => `${value} incidents`;
rootTable.config = { columns: [], rows: [] };
rootTree.selected = ["guides"];
rootTreeItem.expanded = true;
const selectedTreeItems: HTMLElement[] = rootTree.selectedItems;
const rootRatingValue: number | "" = rootRating.value;
const rootRichText: string = rootRichTextEditor.text;

void [
  null as unknown as BaseElementIsInternal,
  formattedCurrency,
  formattedDate,
  formattedNumber,
  formattedRelativeTime,
  formattedSubpathDate,
  defaultCheckboxMessage,
  localizedCheckboxMessage,
  rootCommandItem,
  rootCarousel,
  rootCommandPalette,
  rootRating,
  rootRatingValue,
  rootRichTextEditor,
  rootRichText,
  rootTrendChart,
  rootTree,
  rootTreeItem,
  selectedTreeItems,
  debounce,
  define,
  emit,
  keys,
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
];
