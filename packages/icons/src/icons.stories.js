import "../../../src/icon-button/icon-button.js";
import "./elements/arrow-right.js";
import "./elements/calendar-days.js";
import "./elements/circle-check.js";
import "./elements/download.js";
import "./elements/menu.js";
import "./elements/search.js";
import "./elements/settings-2.js";
import "./elements/shield-check.js";
import "./elements/sliders-horizontal.js";
import "./elements/x.js";

const ICONS = [
  { label: "Continue", name: "arrow-right" },
  { label: "Schedule", name: "calendar-days" },
  { label: "Download", name: "download" },
  { label: "Open navigation", name: "menu" },
  { label: "Search", name: "search" },
  { label: "Settings", name: "settings-2" },
  { label: "Security", name: "shield-check" },
  { label: "Adjust filters", name: "sliders-horizontal" },
  { label: "Close", name: "x" },
];

const ICON_BUTTON_COMPOSITION_SOURCE = `import "@rowan-ui/core/icon-button";
import "@rowan-ui/icons/elements/calendar-days";

document.body.innerHTML = \`
  <rowan-icon-button icon="calendar-days" label="Schedule" title="Schedule"></rowan-icon-button>
\`;`;

const MEANINGFUL_ICON_SOURCE = `import "@rowan-ui/icons/elements/circle-check";

document.body.innerHTML = \`
  <div>
    <rowan-icon name="circle-check" size="28" label="Deployment completed"></rowan-icon>
    <span>Deployment completed</span>
  </div>
\`;`;

function createGallery() {
  const gallery = document.createElement("div");
  gallery.style.display = "grid";
  gallery.style.gap = "0.75rem";
  gallery.style.gridTemplateColumns = "repeat(auto-fill, minmax(8rem, 1fr))";

  for (const iconDefinition of ICONS) {
    const item = document.createElement("div");
    item.style.alignItems = "center";
    item.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
    item.style.borderRadius = "8px";
    item.style.display = "grid";
    item.style.gap = "0.45rem";
    item.style.justifyItems = "center";
    item.style.padding = "0.75rem";

    const button = document.createElement("rowan-icon-button");
    button.label = iconDefinition.label;
    button.title = iconDefinition.label;
    button.icon = iconDefinition.name;

    const name = document.createElement("code");
    name.textContent = iconDefinition.name;
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
  parameters: {
    docs: {
      source: {
        code: ICON_BUTTON_COMPOSITION_SOURCE,
        language: "js",
      },
    },
  },
  render: () => createGallery(),
};

export const MeaningfulIcon = {
  parameters: {
    docs: {
      source: {
        code: MEANINGFUL_ICON_SOURCE,
        language: "js",
      },
    },
  },
  render: () => {
    const message = document.createElement("div");
    message.style.alignItems = "center";
    message.style.display = "flex";
    message.style.gap = "0.6rem";

    const icon = document.createElement("rowan-icon");
    icon.name = "circle-check";
    icon.label = "Deployment completed";
    icon.size = 28;
    const text = document.createElement("span");
    text.textContent = "Deployment completed";

    message.append(icon, text);
    return message;
  },
};
