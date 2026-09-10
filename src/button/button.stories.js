import "./button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

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
