import "./listbox.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createOption(value, label, selected = false) {
  const option = document.createElement("rowan-option");
  option.value = value;
  option.label = label;
  option.selected = selected;
  return option;
}

export default {
  title: "Components/Listbox",
  tags: ["autodocs"],
  argTypes: {
    selection: { control: "select", options: ["single", "multiple"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    selection: "single",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Use Arrow keys to move, then Space or Enter to select an option."],
    events: ["rowan-change"],
  }),
  render: ({ selection, required, disabled }) => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";
    listbox.selection = selection;
    listbox.required = required;
    listbox.disabled = disabled;
    listbox.append(
      createOption("design", "Design", true),
      createOption("engineering", "Engineering"),
      createOption("operations", "Operations"),
    );
    return listbox;
  },
};

export const Multiple = {
  parameters: createEventScriptParameters({
    steps: ["Select or clear several teams with Space."],
    events: ["rowan-change"],
  }),
  render: () => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";
    listbox.selection = "multiple";
    listbox.selected = ["design", "operations"];
    listbox.append(
      createOption("design", "Design"),
      createOption("engineering", "Engineering"),
      createOption("operations", "Operations"),
    );
    return listbox;
  },
};
