import "./icon-button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createIconButton(label, icon, { variant = "ghost", size = "md", disabled = false } = {}) {
  const button = document.createElement("rowan-icon-button");
  button.label = label;
  button.textContent = icon;

  if (variant !== "ghost") button.variant = variant;
  if (size !== "md") button.size = size;
  button.disabled = disabled;
  return button;
}

function createShowcase() {
  const showcase = document.createElement("div");
  showcase.style.alignItems = "center";
  showcase.style.display = "flex";
  showcase.style.flexWrap = "wrap";
  showcase.style.gap = "0.75rem";
  return showcase;
}

export default {
  title: "Components/Icon Button",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    icon: { control: "text" },
  },
  args: {
    label: "Edit",
    variant: "ghost",
    size: "md",
    disabled: false,
    icon: "✎",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the icon button.", "Toggle Disabled and click again."],
    events: ["rowan-click"],
  }),
  render: ({ label, variant, size, disabled, icon }) => {
    const el = document.createElement("rowan-icon-button");
    el.label = label;
    if (variant !== "ghost") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    el.textContent = icon;
    return el;
  },
};

export const VisualStates = {
  render: () => {
    const showcase = createShowcase();
    showcase.append(
      createIconButton("Edit", "✎"),
      createIconButton("Add", "+", { variant: "primary" }),
      createIconButton("Open settings", "⚙", { variant: "secondary" }),
      createIconButton("Delete", "×", { variant: "danger" }),
      createIconButton("Unavailable", "⋯", { disabled: true }),
    );
    return showcase;
  },
};
