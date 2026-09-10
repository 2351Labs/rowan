import "./select.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Select",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "editor",
    label: "Role",
    placeholder: "Choose role",
    required: false,
    disabled: false,
  },
};

const OPTIONS = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Open the list and choose another option."],
    events: ["rowan-change"],
  }),
  render: ({ value, label, placeholder, required, disabled }) => {
    const select = document.createElement("rowan-select");
    select.options = OPTIONS;
    select.value = value;
    select.label = label;
    select.placeholder = placeholder;
    select.required = required;
    select.disabled = disabled;
    return select;
  },
};
