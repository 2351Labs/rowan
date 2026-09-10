import "./text-field.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Text Field",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    label: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel"],
    },
  },
  args: {
    value: "",
    placeholder: "Enter a value",
    label: "Field",
    required: false,
    disabled: false,
    type: "text",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Focus the field and type a value.",
      "Press Tab or click outside the field to commit the value.",
      "Review the latest rowan-change payload in Event Trace.",
    ],
    events: ["rowan-change"],
  }),
  render: ({ value, placeholder, label, required, disabled, type }) => {
    const el = document.createElement("rowan-text-field");
    el.value = value;
    el.placeholder = placeholder;
    el.label = label;
    el.type = type;
    if (required) el.setAttribute("required", "");
    if (disabled) el.setAttribute("disabled", "");
    return el;
  },
};
