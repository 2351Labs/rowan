import "./radio.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Radio",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    label: { control: "text" },
    text: { control: "text" },
    value: { control: "text" },
    name: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: "Role",
    text: "Editor",
    value: "editor",
    name: "role",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Select the radio option."],
    events: ["rowan-change"],
  }),
  render: ({ checked, disabled, required, label, text, value, name }) => {
    const radio = document.createElement("rowan-radio");
    radio.checked = checked;
    radio.disabled = disabled;
    radio.required = required;
    radio.label = label;
    radio.value = value;
    radio.name = name;
    radio.textContent = text;
    return radio;
  },
};
