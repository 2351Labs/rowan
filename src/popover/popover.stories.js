import "./popover.js";
import "../button/button.js";

export default {
  title: "Components/Popover",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    open: true,
  },
};

export const Playground = {
  render: ({ open }) => {
    const popover = document.createElement("rowan-popover");
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
