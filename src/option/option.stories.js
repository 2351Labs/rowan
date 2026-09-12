import "../listbox/listbox.js";
import "./option.js";

export default {
  title: "Components/Option",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "engineering",
    label: "Engineering",
    selected: false,
    disabled: false,
  },
};

export const InListbox = {
  render: ({ value, label, selected, disabled }) => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";

    const option = document.createElement("rowan-option");
    option.value = value;
    option.label = label;
    option.selected = selected;
    option.disabled = disabled;
    listbox.append(option);
    return listbox;
  },
};
