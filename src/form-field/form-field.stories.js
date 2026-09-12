import "./form-field.js";
import "../checkbox/checkbox.js";
import "../radio/radio.js";
import "../radio-group/radio-group.js";
import "../text-field/text-field.js";

function createTextField() {
  const field = document.createElement("rowan-text-field");
  field.name = "workspace";
  field.placeholder = "northstar";
  return field;
}

export default {
  title: "Forms/Form Field",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    labelPosition: { control: "inline-radio", options: ["top", "start"] },
    required: { control: "boolean" },
  },
  args: {
    label: "Workspace name",
    hint: "Used in workspace URLs.",
    description: "Choose a concise, recognizable name.",
    error: "",
    labelPosition: "top",
    required: false,
  },
};

export const Playground = {
  render: ({ label, hint, description, error, labelPosition, required }) => {
    const formField = document.createElement("rowan-form-field");
    formField.label = label;
    formField.hint = hint;
    formField.description = description;
    formField.error = error;
    formField.labelPosition = labelPosition;
    formField.required = required;
    formField.append(createTextField());
    return formField;
  },
};

export const GroupedControl = {
  render: () => {
    const formField = document.createElement("rowan-form-field");
    formField.label = "Default visibility";
    formField.hint = "You can change this per project later.";

    const group = document.createElement("rowan-radio-group");
    group.name = "visibility";
    ["Private", "Team", "Public"].forEach((label, index) => {
      const radio = document.createElement("rowan-radio");
      radio.value = label.toLowerCase();
      radio.checked = index === 1;
      radio.textContent = label;
      group.append(radio);
    });

    formField.append(group);
    return formField;
  },
};

export const SlottedContent = {
  render: () => {
    const formField = document.createElement("rowan-form-field");
    formField.required = true;

    const label = document.createElement("span");
    label.slot = "label";
    label.textContent = "Security contact";

    const hint = document.createElement("span");
    hint.slot = "hint";
    hint.textContent = "Use a monitored team address.";

    const control = createTextField();
    control.type = "email";
    control.name = "security-contact";

    formField.append(label, control, hint);
    return formField;
  },
};
