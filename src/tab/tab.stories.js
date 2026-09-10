import "./tab.js";

export default {
  title: "Components/Tab",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    active: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    value: "overview",
    active: true,
    label: "Overview",
  },
};

export const Playground = {
  render: ({ value, active, label }) => {
    const tab = document.createElement("rowan-tab");
    tab.value = value;
    if (active) tab.setAttribute("active", "");
    tab.textContent = label;
    return tab;
  },
};
