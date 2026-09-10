import "./dropdown.js";
import "../menu/menu.js";
import "../menu-item/menu-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Dropdown",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    open: false,
    label: "Actions",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the trigger button to open and close."],
    events: ["rowan-change", "rowan-click"],
  }),
  render: ({ open, label }) => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.label = label;
    if (open) dropdown.setAttribute("open", "");

    const menu = document.createElement("rowan-menu");
    for (const value of ["Edit", "Archive"]) {
      const item = document.createElement("rowan-menu-item");
      item.value = value.toLowerCase();
      item.textContent = value;
      menu.append(item);
    }

    dropdown.append(menu);
    return dropdown;
  },
};
