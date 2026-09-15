import "./context-menu.js";
import "../menu-item/menu-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createContextMenu() {
  const wrapper = document.createElement("div");
  wrapper.style.display = "grid";
  wrapper.style.gap = "var(--rowan-space-3)";
  wrapper.style.maxInlineSize = "24rem";

  const target = document.createElement("button");
  target.type = "button";
  target.textContent = "Right-click this project";
  target.style.background = "var(--rowan-color-bg)";
  target.style.border = "1px solid var(--rowan-color-border)";
  target.style.borderRadius = "var(--rowan-radius-md)";
  target.style.color = "var(--rowan-color-fg)";
  target.style.cursor = "context-menu";
  target.style.font = "inherit";
  target.style.padding = "var(--rowan-space-4)";
  target.style.textAlign = "start";

  const menu = document.createElement("rowan-context-menu");
  menu.label = "Project actions";
  menu.target = target;

  for (const [value, label] of [
    ["rename", "Rename"],
    ["duplicate", "Duplicate"],
    ["archive", "Archive"],
  ]) {
    const item = document.createElement("rowan-menu-item");
    item.value = value;
    item.textContent = label;
    menu.append(item);
  }

  wrapper.append(target, menu);
  return wrapper;
}

export default {
  title: "Components/Overlays & Menus/Context Menu",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Right-click the project, or focus it and press Shift+F10."],
    events: ["rowan-change", "rowan-close"],
  }),
  render: () => createContextMenu(),
};
