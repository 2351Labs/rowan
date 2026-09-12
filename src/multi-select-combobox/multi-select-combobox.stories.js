import "./multi-select-combobox.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const OPTIONS = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "operations", label: "Operations" },
  { value: "support", label: "Support" },
];

export default {
  title: "Components/Multi-select combobox",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Teams",
    placeholder: "Search teams",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Search teams, select an option, or remove a selected chip."],
    events: ["rowan-change"],
  }),
  render: ({ label, placeholder, required, disabled }) => {
    const combobox = document.createElement("rowan-multi-select-combobox");
    combobox.label = label;
    combobox.placeholder = placeholder;
    combobox.required = required;
    combobox.disabled = disabled;
    combobox.options = OPTIONS;
    combobox.selected = ["design", "operations"];
    return combobox;
  },
};

export const Required = {
  parameters: createEventScriptParameters({
    steps: ["Choose at least one team to satisfy the required field."],
    events: ["rowan-change"],
  }),
  render: () => {
    const combobox = document.createElement("rowan-multi-select-combobox");
    combobox.label = "Assigned teams";
    combobox.placeholder = "Find a team";
    combobox.required = true;
    combobox.options = OPTIONS;
    return combobox;
  },
};
