import "./combobox.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Combobox",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "",
    label: "City",
    placeholder: "Search city",
    required: false,
    disabled: false,
  },
};

const OPTIONS = ["Portland", "Seattle", "Boise", "Bend", "Spokane"];

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Type or pick a suggested value and commit with enter/blur."],
    events: ["rowan-change"],
  }),
  render: ({ value, label, placeholder, required, disabled }) => {
    const combobox = document.createElement("rowan-combobox");
    combobox.options = OPTIONS;
    combobox.value = value;
    combobox.label = label;
    combobox.placeholder = placeholder;
    combobox.required = required;
    combobox.disabled = disabled;
    return combobox;
  },
};
