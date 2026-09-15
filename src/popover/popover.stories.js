import "./popover.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Overlays & Menus/Popover",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    open: true,
    label: "Popover",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the trigger to open and close the popover."],
    events: ["rowan-change", "rowan-click"],
  }),
  render: ({ open, label }) => {
    const popover = document.createElement("rowan-popover");
    popover.label = label;
    if (open) popover.setAttribute("open", "");

    const trigger = document.createElement("rowan-button");
    trigger.slot = "trigger";
    trigger.textContent = "Open popover";

    const text = document.createElement("p");
    text.textContent = "Popover content can hold actions, text, or filters.";
    text.style.margin = "0";

    popover.append(trigger, text);
    return popover;
  },
};
