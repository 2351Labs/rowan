import {
  RowanButton,
  RowanCommandItem,
  RowanCommandPalette,
  RowanRating,
  RowanRichTextEditor,
  RowanTable,
  RowanTrendChart,
  RowanTree,
  RowanTreeItem,
} from "@rowan-ui/core";
import { BaseElement } from "@rowan-ui/core/lib/base-element";
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
import "@rowan-ui/core/tokens/light";

const rootButton: RowanButton = document.createElement("rowan-button");
const rootCommandItem: RowanCommandItem = document.createElement("rowan-command-item");
const rootCommandPalette: RowanCommandPalette = document.createElement("rowan-command-palette");
const rootRating: RowanRating = document.createElement("rowan-rating");
const rootRichTextEditor: RowanRichTextEditor = document.createElement("rowan-rich-text-editor");
const rootTable: RowanTable = document.createElement("rowan-table");
const rootTrendChart: RowanTrendChart = document.createElement("rowan-trend-chart");
const rootTree: RowanTree = document.createElement("rowan-tree");
const rootTreeItem: RowanTreeItem = document.createElement("rowan-tree-item");
const baseElement: typeof BaseElement = BaseElement;

rootButton.disabled = true;
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
  baseElement,
  rootCommandItem,
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
