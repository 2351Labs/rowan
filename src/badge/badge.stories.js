import "./badge.js";

export default {
  title: "Components/Badge",
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
    label: "Info",
  },
};

export const Playground = {
  render: ({ tone, size, label }) => {
    const el = document.createElement("rowan-badge");
    if (tone !== "info") el.setAttribute("tone", tone);
    if (size !== "md") el.setAttribute("size", size);
    el.textContent = label;
    return el;
  },
};
