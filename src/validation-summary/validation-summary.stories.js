import "./validation-summary.js";

const meta = {
  title: "Forms/Validation Summary",
  component: "rowan-validation-summary",
  tags: ["autodocs"],
  argTypes: {
    heading: { control: "text" },
    disabled: { control: "boolean" },
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