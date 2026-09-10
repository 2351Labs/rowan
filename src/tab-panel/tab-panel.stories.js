import "./tab-panel.js";

export default {
  title: "Components/Tab Panel",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    active: { control: "boolean" },
    content: { control: "text" },
  },
  args: {
    value: "overview",
    active: true,
    content: "Panel content",
  },
};

export const Playground = {
  render: ({ value, active, content }) => {
    const panel = document.createElement("rowan-tab-panel");
    panel.value = value;
    if (active) panel.setAttribute("active", "");
    panel.textContent = content;
    return panel;
  },
};
