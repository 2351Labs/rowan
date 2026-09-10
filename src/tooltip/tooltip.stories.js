import "./tooltip.js";
import "../button/button.js";

export default {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
  },
  args: {
    text: "Save to favorites",
  },
};

export const Playground = {
  render: ({ text }) => {
    const tooltip = document.createElement("rowan-tooltip");
    tooltip.text = text;

    const button = document.createElement("rowan-button");
    button.textContent = "Hover me";

    tooltip.append(button);
    return tooltip;
  },
};
