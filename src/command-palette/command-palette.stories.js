import "./command-palette.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function addCommand(
  palette,
  { value, label, description, group, shortcut, keywords, disabled = false },
) {
  const item = document.createElement("rowan-command-item");
  item.value = value;
  item.label = label;
  item.description = description;
  item.group = group;
  item.shortcut = shortcut;
  item.keywords = keywords;
  item.disabled = disabled;
  palette.append(item);
}

function addWorkspaceCommands(palette) {
  addCommand(palette, {
    value: "open-settings",
    label: "Open settings",
    description: "Update workspace preferences",
    group: "Workspace",
    shortcut: "G S",
    keywords: "workspace preferences account",
  });
  addCommand(palette, {
    value: "invite-member",
    label: "Invite member",
    description: "Send a workspace invitation",
    group: "Workspace",
    shortcut: "I",
    keywords: "team people invite",
  });
  addCommand(palette, {
    value: "open-reports",
    label: "Open reports",
    description: "Review workspace activity",
    group: "Navigation",
    shortcut: "G R",
    keywords: "analytics activity usage",
  });
  addCommand(palette, {
    value: "delete-workspace",
    label: "Delete workspace",
    description: "Unavailable in this story",
    group: "Workspace",
    shortcut: "",
    keywords: "remove",
    disabled: true,
  });
}

export default {
  title: "Components/Command Palette",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    emptyLabel: { control: "text" },
  },
  args: {
    label: "Workspace commands",
    placeholder: "Search commands",
    emptyLabel: "No workspace commands found.",
  },
};

export const OpenPalette = {
  parameters: createEventScriptParameters({
    steps: [
      "Filter commands, move with Arrow Up or Arrow Down, then press Enter.",
      "Dismiss the palette with Escape, the backdrop, or the close control.",
    ],
    events: ["rowan-command", "rowan-close"],
  }),
  render: ({ label, placeholder, emptyLabel }) => {
    const palette = document.createElement("rowan-command-palette");
    palette.label = label;
    palette.placeholder = placeholder;
    palette.emptyLabel = emptyLabel;
    palette.open = true;
    addWorkspaceCommands(palette);
    return palette;
  },
};

export const TriggeredPalette = {
  parameters: createEventScriptParameters({
    steps: ["Open the command surface, then activate a command."],
    events: ["rowan-command", "rowan-close"],
  }),
  render: () => {
    const wrapper = document.createElement("div");
    const trigger = document.createElement("rowan-button");
    const palette = document.createElement("rowan-command-palette");

    trigger.textContent = "Open commands";
    trigger.addEventListener("rowan-click", () => palette.show());
    addWorkspaceCommands(palette);
    wrapper.append(trigger, palette);
    return wrapper;
  },
};
