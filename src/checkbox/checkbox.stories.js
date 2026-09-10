import "./checkbox.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: "Receive updates",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Click the checkbox control to toggle it.",
      "Focus the checkbox and press Space to toggle again.",
      "Toggle Disabled on, then interact again to confirm no new event fires.",
    ],
    events: ["rowan-change"],
  }),
  render: ({ checked, disabled, required, label }) => {
    const el = document.createElement("rowan-checkbox");
    if (checked) el.setAttribute("checked", "");
    if (disabled) el.setAttribute("disabled", "");
    if (required) el.setAttribute("required", "");
    el.textContent = label;
    return el;
  },
};
