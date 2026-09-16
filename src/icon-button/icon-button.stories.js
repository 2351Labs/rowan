import "./icon-button.js";
import "@rowan-ui/icons/elements/calendar-days";
import "@rowan-ui/icons/elements/menu";
import "@rowan-ui/icons/elements/search";
import "@rowan-ui/icons/elements/settings-2";
import "@rowan-ui/icons/elements/x";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createIconButton(label, icon, { variant = "ghost", size = "md", disabled = false } = {}) {
  const button = document.createElement("rowan-icon-button");
  button.label = label;
  button.icon = icon;

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

const PLAYGROUND_PARAMETERS = createEventScriptParameters({
  steps: ["Click the icon button.", "Toggle Disabled and click again."],
  events: ["rowan-click"],
});

const PLAYGROUND_SOURCE = `import "@rowan-ui/core/icon-button";
import "@rowan-ui/icons/elements/calendar-days";

document.body.innerHTML = \`
  <rowan-icon-button icon="calendar-days" label="Schedule"></rowan-icon-button>
\`;`;

const VISUAL_STATES_SOURCE = `import "@rowan-ui/core/icon-button";
import "@rowan-ui/icons/elements/calendar-days";
import "@rowan-ui/icons/elements/menu";
import "@rowan-ui/icons/elements/search";
import "@rowan-ui/icons/elements/settings-2";
import "@rowan-ui/icons/elements/x";

document.body.innerHTML = \`
  <rowan-icon-button icon="calendar-days" label="Schedule"></rowan-icon-button>
  <rowan-icon-button icon="search" label="Search" variant="primary"></rowan-icon-button>
  <rowan-icon-button icon="settings-2" label="Open settings" variant="secondary"></rowan-icon-button>
  <rowan-icon-button icon="x" label="Close" variant="danger"></rowan-icon-button>
  <rowan-icon-button icon="menu" label="Open navigation" disabled></rowan-icon-button>
\`;`;

export default {
  title: "Components/Actions & Feedback/Icon Button",
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
    icon: {
      control: "select",
      options: ["calendar-days", "menu", "search", "settings-2", "x"],
    },
  },
  args: {
    label: "Schedule",
    variant: "ghost",
    size: "md",
    disabled: false,
    icon: "calendar-days",
  },
};

export const Playground = {
  parameters: {
    ...PLAYGROUND_PARAMETERS,
    docs: {
      ...PLAYGROUND_PARAMETERS.docs,
      source: {
        code: PLAYGROUND_SOURCE,
        language: "js",
      },
    },
  },
  render: ({ label, variant, size, disabled, icon }) => {
    const el = document.createElement("rowan-icon-button");
    el.label = label;
    if (variant !== "ghost") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    el.icon = icon;
    return el;
  },
};

export const VisualStates = {
  parameters: {
    docs: {
      source: {
        code: VISUAL_STATES_SOURCE,
        language: "js",
      },
    },
  },
  render: () => {
    const showcase = createShowcase();
    showcase.append(
      createIconButton("Schedule", "calendar-days"),
      createIconButton("Search", "search", { variant: "primary" }),
      createIconButton("Open settings", "settings-2", { variant: "secondary" }),
      createIconButton("Close", "x", { variant: "danger" }),
      createIconButton("Open navigation", "menu", { disabled: true }),
    );
    return showcase;
  },
};
