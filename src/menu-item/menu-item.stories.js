import "./menu-item.js";

export default {
  title: "Components/Menu Item",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    value: "edit",
    disabled: false,
    label: "Edit",
  },
};

export const Playground = {
  render: ({ value, disabled, label }) => {
    const item = document.createElement("rowan-menu-item");
    item.value = value;
    if (disabled) item.setAttribute("disabled", "");
    item.textContent = label;
    return item;
  },
};
