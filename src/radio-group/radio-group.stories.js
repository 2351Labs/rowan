import "./radio-group.js";
import "../radio/radio.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Radio Group",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    name: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "team",
    name: "audience",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Choose an option to update group value."],
    events: ["rowan-change"],
  }),
  render: ({ value, name, required, disabled }) => {
    const group = document.createElement("rowan-radio-group");
    group.value = value;
    group.name = name;
    group.required = required;
    group.disabled = disabled;

    const options = [
      { label: "Team", value: "team" },
      { label: "Department", value: "department" },
      { label: "Company", value: "company" },
    ];

    for (const option of options) {
      const radio = document.createElement("rowan-radio");
      radio.value = option.value;
      radio.textContent = option.label;
      group.append(radio);
    }

    return group;
  },
};
