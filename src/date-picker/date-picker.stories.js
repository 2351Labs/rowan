import "./date-picker.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Date Picker",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "2026-09-15",
    label: "Start date",
    min: "2026-09-10",
    max: "2026-09-20",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Open the date picker and choose another date."],
    events: ["rowan-change"],
  }),
  render: ({ value, label, min, max, required, disabled }) => {
    const datePicker = document.createElement("rowan-date-picker");
    datePicker.value = value;
    datePicker.label = label;
    datePicker.min = min;
    datePicker.max = max;
    datePicker.required = required;
    datePicker.disabled = disabled;
    return datePicker;
  },
};