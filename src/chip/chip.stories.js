import "./chip.js";

export default {
  title: "Components/Chip",
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
  },
  args: {
    tone: "info",
    size: "md",
    label: "Platform",
  },
};

export const Playground = {
  render: ({ tone, size, label }) => {
    const el = document.createElement("rowan-chip");
    if (tone !== "info") el.setAttribute("tone", tone);
    if (size !== "md") el.setAttribute("size", size);
    el.textContent = label;
    return el;
  },
};
