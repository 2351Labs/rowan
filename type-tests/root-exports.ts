import {
  RowanButton,
  RowanCommandItem,
  RowanCommandPalette,
  RowanTable,
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
const rootTable: RowanTable = document.createElement("rowan-table");
const rootTree: RowanTree = document.createElement("rowan-tree");
const rootTreeItem: RowanTreeItem = document.createElement("rowan-tree-item");
const baseElement: typeof BaseElement = BaseElement;

rootButton.disabled = true;
rootCommandItem.label = "Open settings";
rootCommandPalette.open = true;
rootTable.config = { columns: [], rows: [] };
rootTree.selected = ["guides"];
rootTreeItem.expanded = true;
const selectedTreeItems: HTMLElement[] = rootTree.selectedItems;

void [
  baseElement,
  rootCommandItem,
  rootCommandPalette,
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
