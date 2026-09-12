import "./form-layout.js";
import "../form-field/form-field.js";
import "../slider/slider.js";
import "../text-field/text-field.js";

function createField({ label, hint, name, span, value = "" }) {
  const wrapper = document.createElement("rowan-form-field");
  wrapper.label = label;
  wrapper.hint = hint;
  if (span) wrapper.setAttribute("span", String(span));

  const input = document.createElement("rowan-text-field");
  input.name = name;
  input.value = value;
  wrapper.append(input);
  return wrapper;
}

function createLayout({ columns = 2, labelPosition = "top", labelAlign = "start" } = {}) {
  const layout = document.createElement("rowan-form-layout");
  layout.columns = columns;
  layout.labelPosition = labelPosition;
  layout.labelAlign = labelAlign;
  layout.labelWidth = "11rem";

  const project = createField({
    label: "Project name",
    hint: "Shown in workspace navigation.",
    name: "project-name",
  });
  const owner = createField({
    label: "Owner email",
    hint: "Receives project notices.",
    name: "owner-email",
  });
  const region = createField({
    label: "Primary region",
    hint: "Where data is processed.",
    name: "primary-region",
    span: columns,
  });

  layout.append(project, owner, region);
  return layout;
}

export default {
  title: "Forms/Form Layout",
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 4 } },
    labelPosition: { control: "inline-radio", options: ["top", "start"] },
    labelAlign: { control: "inline-radio", options: ["start", "end"] },
  },
  args: {
    columns: 2,
    labelPosition: "top",
    labelAlign: "start",
  },
};

export const Playground = {
  render: (args) => createLayout(args),
};

export const DenseConfiguration = {
  render: () => {
    const layout = createLayout({ columns: 2, labelPosition: "start", labelAlign: "end" });
    const budget = document.createElement("rowan-form-field");
    budget.label = "Monthly budget";
    budget.hint = "Set an operating threshold.";
    budget.setAttribute("span", "2");

    const slider = document.createElement("rowan-slider");
    slider.name = "budget";
    slider.min = 0;
    slider.max = 500;
    slider.step = 25;
    slider.value = 250;
    slider.formatValue = (value) => `$${value}`;
    budget.append(slider);

    layout.append(budget);
    return layout;
  },
};
