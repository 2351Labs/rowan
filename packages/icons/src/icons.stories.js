import "../../../src/icon-button/icon-button.js";
import { ArrowRight } from "./icons/arrow-right.js";
import { CalendarDays } from "./icons/calendar-days.js";
import { CircleCheck } from "./icons/circle-check.js";
import { Download } from "./icons/download.js";
import { Menu } from "./icons/menu.js";
import { Search } from "./icons/search.js";
import { Settings2 } from "./icons/settings-2.js";
import { ShieldCheck } from "./icons/shield-check.js";
import { SlidersHorizontal } from "./icons/sliders-horizontal.js";
import { X } from "./icons/x.js";

const ICONS = [
  { create: ArrowRight, label: "Continue", name: "arrow-right" },
  { create: CalendarDays, label: "Schedule", name: "calendar-days" },
  { create: Download, label: "Download", name: "download" },
  { create: Menu, label: "Open navigation", name: "menu" },
  { create: Search, label: "Search", name: "search" },
  { create: Settings2, label: "Settings", name: "settings-2" },
  { create: ShieldCheck, label: "Security", name: "shield-check" },
  { create: SlidersHorizontal, label: "Adjust filters", name: "sliders-horizontal" },
  { create: X, label: "Close", name: "x" },
];

function createGallery() {
  const gallery = document.createElement("div");
  gallery.style.display = "grid";
  gallery.style.gap = "0.75rem";
  gallery.style.gridTemplateColumns = "repeat(auto-fill, minmax(8rem, 1fr))";

  for (const icon of ICONS) {
    const item = document.createElement("div");
    item.style.alignItems = "center";
    item.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
    item.style.borderRadius = "8px";
    item.style.display = "grid";
    item.style.gap = "0.45rem";
    item.style.justifyItems = "center";
    item.style.padding = "0.75rem";

    const button = document.createElement("rowan-icon-button");
    button.label = icon.label;
    button.title = icon.label;
    button.append(icon.create({ size: 22 }));

    const name = document.createElement("code");
    name.textContent = icon.name;
    name.style.fontSize = "0.75rem";
    name.style.overflowWrap = "anywhere";
    name.style.textAlign = "center";

    item.append(button, name);
    gallery.append(item);
  }

  return gallery;
}

export default {
  title: "Foundations/Icons",
  tags: ["autodocs"],
};

export const IconButtonComposition = {
  render: () => createGallery(),
};

export const MeaningfulIcon = {
  render: () => {
    const message = document.createElement("div");
    message.style.alignItems = "center";
    message.style.display = "flex";
    message.style.gap = "0.6rem";

    const icon = CircleCheck({ label: "Deployment completed", size: 28 });
    const text = document.createElement("span");
    text.textContent = "Deployment completed";

    message.append(icon, text);
    return message;
  },
};