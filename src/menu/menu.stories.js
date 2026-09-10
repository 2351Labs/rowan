import "./menu.js";
import "../menu-item/menu-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Menu",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click any menu item."],
    events: ["rowan-change"],
  }),
  render: () => {
    const menu = document.createElement("rowan-menu");

    const items = ["Edit", "Duplicate", "Archive"];
    for (const value of items) {
      const item = document.createElement("rowan-menu-item");
      item.value = value.toLowerCase();
      item.textContent = value;
      menu.append(item);
    }

    return menu;
  },
};
