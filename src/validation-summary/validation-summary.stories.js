import "./validation-summary.js";

const meta = {
  title: "Components/Forms & Input/Validation Summary",
  component: "rowan-validation-summary",
  tags: ["autodocs"],
  argTypes: {
    heading: { control: "text" },
    disabled: { control: "boolean" },
    errors: { control: false, table: { disable: true } },
  },
};

export default meta;

const Template = ({ heading = "Please correct the highlighted fields", disabled = false }) => {
  const summary = document.createElement("rowan-validation-summary");
  summary.heading = heading;
  summary.disabled = disabled;
  summary.errors = [
    { fieldId: "name", label: "Name", message: "Name is required" },
    { fieldId: "email", label: "Email", message: "Email format is invalid" },
  ];
  return summary;
};

export const Playground = {
  render: Template,
  args: {
    heading: "Please correct the highlighted fields",
    disabled: false,
  },
};

export const Empty = {
  render: ({ heading = "Looks good" }) => {
    const summary = document.createElement("rowan-validation-summary");
    summary.heading = heading;
    summary.errors = [];
    return summary;
  },
  args: {
    heading: "Looks good",
  },
};

export const JumpToField = {
  name: "Jump to field",
  parameters: {
    docs: {
      description: {
        story: "Activating an error emits rowan-jump and moves focus to the named field.",
      },
    },
  },
  render: () => {
    const form = document.createElement("form");
    form.id = "signup";
    const name = document.createElement("input");
    name.id = "name";
    name.name = "name";
    const summary = document.createElement("rowan-validation-summary");
    summary.forForm = "signup";
    summary.errors = [{ fieldId: "name", label: "Name", message: "Name is required" }];
    const heading = document.createElement("span");
    heading.slot = "heading";
    heading.textContent = "Fix the signup form";
    const empty = document.createElement("span");
    empty.slot = "empty";
    empty.textContent = "No remaining errors";
    summary.append(heading, empty);
    form.append(summary, name);
    return form;
  },
};
