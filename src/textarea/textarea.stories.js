import "./textarea.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Forms & Input/Textarea",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 2, max: 10 } },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  args: {
    label: "Notes",
    value: "",
    placeholder: "Add project notes",
    rows: 4,
    required: false,
    disabled: false,
    invalid: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Type in the field and blur it to trigger change."],
    events: ["rowan-change"],
  }),
  render: ({ label, value, placeholder, rows, required, disabled, invalid }) => {
    const textarea = document.createElement("rowan-textarea");
    textarea.label = label;
    textarea.value = value;
    textarea.placeholder = placeholder;
    textarea.rows = rows;
    textarea.required = required;
    textarea.disabled = disabled;
    textarea.invalid = invalid;
    return textarea;
  },
};

export const NamedNotes = {
  name: "Named notes",
  render: () => {
    const textarea = document.createElement("rowan-textarea");
    textarea.name = "project-notes";
    textarea.label = "Notes";
    textarea.placeholder = "Add project notes";
    textarea.rows = 4;
    textarea.value = "Ship the October audit before Friday.";
    return textarea;
  },
};
