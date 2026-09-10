import "./number-field.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Number Field",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "number" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "10",
    label: "Units",
    placeholder: "Enter units",
    min: "0",
    max: "100",
    step: 1,
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Type a number and commit the value.",
      "Use increment and decrement controls.",
      "Inspect rowan-change payloads in Event Trace.",
    ],
    events: ["rowan-change"],
  }),
  render: ({ value, label, placeholder, min, max, step, required, disabled }) => {
    const field = document.createElement("rowan-number-field");
    field.value = value;
    field.label = label;
    field.placeholder = placeholder;
    field.min = min;
    field.max = max;
    field.step = step;
    field.required = required;
    field.disabled = disabled;
    return field;
  },
};

export const ReportCriteria = {
  args: {
    value: "25",
    label: "Minimum order quantity",
    min: "0",
    max: "500",
    step: 5,
  },
  render: ({ value, label, min, max, step }) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "0.75rem";
    wrapper.style.maxWidth = "22rem";

    const hint = document.createElement("p");
    hint.style.margin = "0";
    hint.style.fontSize = "0.875rem";
    hint.style.color = "var(--rowan-color-muted)";
    hint.textContent = "Tune report thresholds with keypad-friendly numeric entry.";

    const field = document.createElement("rowan-number-field");
    field.value = value;
    field.label = label;
    field.min = min;
    field.max = max;
    field.step = step;

    wrapper.append(hint, field);
    return wrapper;
  },
};