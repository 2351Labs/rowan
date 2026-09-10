import "./time-picker.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Time Picker",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "number" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "09:30",
    label: "Start time",
    min: "08:00",
    max: "18:00",
    step: 900,
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Open the time picker and choose another time."],
    events: ["rowan-change"],
  }),
  render: ({ value, label, min, max, step, required, disabled }) => {
    const timePicker = document.createElement("rowan-time-picker");
    timePicker.value = value;
    timePicker.label = label;
    timePicker.min = min;
    timePicker.max = max;
    timePicker.step = step;
    timePicker.required = required;
    timePicker.disabled = disabled;
    return timePicker;
  },
};