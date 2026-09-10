import "./switch.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Switch",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    label: { control: "text" },
    text: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: "Availability",
    text: "Available for scheduling",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Toggle the switch to fire a change event."],
    events: ["rowan-change"],
  }),
  render: ({ checked, disabled, required, label, text }) => {
    const el = document.createElement("rowan-switch");
    el.checked = checked;
    el.disabled = disabled;
    el.required = required;
    el.label = label;
    el.textContent = text;
    return el;
  },
};
