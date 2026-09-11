import "./command-item.js";

export default {
  title: "Components/Command Item",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    group: { control: "text" },
    shortcut: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Open settings",
    description: "Update workspace preferences",
    group: "Workspace",
    shortcut: "G S",
    disabled: false,
  },
};

export const Metadata = {
  render: ({ label, description, group, shortcut, disabled }) => {
    const item = document.createElement("rowan-command-item");
    item.value = "open-settings";
    item.label = label;
    item.description = description;
    item.group = group;
    item.shortcut = shortcut;
    item.disabled = disabled;
    return item;
  },
};
