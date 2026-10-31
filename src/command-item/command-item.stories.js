import "./command-item.js";

export default {
  title: "Components/Overlays & Menus/Command Item",
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
    item.keywords = "settings preferences";
    item.setAttribute("tabindex", "0");
    item.disabled = disabled;
    return item;
  },
};

export const Slotted = {
  name: "Slotted content",
  render: () => {
    const item = document.createElement("rowan-command-item");
    item.value = "open-settings";
    item.keywords = "settings";
    const prefix = document.createElement("span");
    prefix.slot = "prefix";
    prefix.textContent = "⌘";
    const description = document.createElement("span");
    description.slot = "description";
    description.textContent = "Update workspace preferences";
    const shortcut = document.createElement("span");
    shortcut.slot = "shortcut";
    shortcut.textContent = "G S";
    item.append(prefix, "Open settings", description, shortcut);
    return item;
  },
};
