import "./popover.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Overlays & Menus/Popover",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
    trigger: {
      control: "select",
      options: ["click", "manual"],
    },
  },
  args: {
    open: true,
    label: "Popover",
    trigger: "click",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the trigger to open and close the popover."],
    events: ["rowan-change", "rowan-click"],
  }),
  render: ({ open, label, trigger }) => {
    const popover = document.createElement("rowan-popover");
    popover.label = label;
    popover.trigger = trigger;
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

export const Manual = {
  parameters: createEventScriptParameters({
    steps: [
      "Click Open. The host sets open; the slotted trigger does not toggle.",
      "Click the trigger. The panel stays open.",
      "Press Escape or click outside to dismiss.",
    ],
    events: ["rowan-change", "rowan-click"],
  }),
  render: () => {
    const root = document.createElement("div");
    root.style.display = "flex";
    root.style.gap = "var(--rowan-space-3)";

    const openButton = document.createElement("rowan-button");
    openButton.variant = "secondary";
    openButton.textContent = "Open";

    const popover = document.createElement("rowan-popover");
    popover.trigger = "manual";
    popover.label = "Filters";

    const trigger = document.createElement("rowan-button");
    trigger.slot = "trigger";
    trigger.textContent = "Filters";

    const text = document.createElement("p");
    text.textContent = "App code sets open. Hover and delay stay on rowan-tooltip.";
    text.style.margin = "0";

    popover.append(trigger, text);
    openButton.addEventListener("rowan-click", () => {
      popover.open = true;
    });

    root.append(openButton, popover);
    return root;
  },
};
