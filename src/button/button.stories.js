import "./button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createButton(
  label,
  { variant = "primary", size = "md", disabled = false, loading = false, prefix, suffix } = {},
) {
  const button = document.createElement("rowan-button");
  button.textContent = label;

  if (prefix) {
    const prefixElement = document.createElement("span");
    prefixElement.setAttribute("aria-hidden", "true");
    prefixElement.slot = "prefix";
    prefixElement.textContent = prefix;
    button.append(prefixElement);
  }

  if (suffix) {
    const suffixElement = document.createElement("span");
    suffixElement.setAttribute("aria-hidden", "true");
    suffixElement.slot = "suffix";
    suffixElement.textContent = suffix;
    button.append(suffixElement);
  }

  if (variant !== "primary") button.variant = variant;
  if (size !== "md") button.size = size;
  button.disabled = disabled;
  button.loading = loading;
  return button;
}

function createShowcase() {
  const showcase = document.createElement("div");
  showcase.style.display = "flex";
  showcase.style.flexWrap = "wrap";
  showcase.style.gap = "0.75rem";
  showcase.style.alignItems = "center";
  return showcase;
}

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    label: "Continue",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Click the button once while enabled.",
      "Turn on Disabled and click again to confirm no event fires.",
      "Turn off Disabled and click once more.",
    ],
    events: ["rowan-click"],
  }),
  render: ({ variant, size, disabled, loading, label }) => {
    const el = document.createElement("rowan-button");
    if (variant !== "primary") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    if (loading) el.setAttribute("loading", "");
    el.textContent = label;
    return el;
  },
};

export const VisualStates = {
  render: () => {
    const showcase = createShowcase();
    showcase.append(
      createButton("Primary"),
      createButton("Secondary", { variant: "secondary" }),
      createButton("Ghost", { variant: "ghost" }),
      createButton("Danger", { variant: "danger" }),
      createButton("Create project", { prefix: "+" }),
      createButton("Continue", { suffix: ">", variant: "secondary" }),
      createButton("Saving", { loading: true }),
      createButton("Disabled", { disabled: true }),
      createButton("Disabled secondary", { disabled: true, variant: "secondary" }),
    );
    return showcase;
  },
};
