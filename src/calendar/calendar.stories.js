import "./calendar.js";

const today = new Date();
const monthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

export default {
  title: "Forms/Calendar",
  component: "rowan-calendar",
  args: {
    label: "Choose a date",
    month: monthValue,
  },
  argTypes: {
    name: { control: "text" },
    nameStart: { control: "text" },
    nameEnd: { control: "text" },
    value: { control: "text" },
    selectionMode: {
      control: "select",
      options: ["single", "range"],
    },
    start: { control: "text" },
    end: { control: "text" },
    month: { control: "text" },
    label: { control: "text" },
    locale: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
};

function renderCalendar(args) {
  const element = document.createElement("rowan-calendar");
  if (args.name != null) element.name = args.name;
  if (args.nameStart != null) element.nameStart = args.nameStart;
  if (args.nameEnd != null) element.nameEnd = args.nameEnd;
  if (args.selectionMode != null) element.selectionMode = args.selectionMode;
  if (args.value != null) element.value = args.value;
  if (args.start != null) element.start = args.start;
  if (args.end != null) element.end = args.end;
  if (args.month != null) element.month = args.month;
  if (args.label != null) element.label = args.label;
  if (args.locale != null) element.locale = args.locale;
  if (args.min != null) element.min = args.min;
  if (args.max != null) element.max = args.max;
  element.required = Boolean(args.required);
  element.disabled = Boolean(args.disabled);
  element.invalid = Boolean(args.invalid);
  return element;
}

export const Default = {
  render: renderCalendar,
};

export const DateRange = {
  args: {
    label: "Choose a service window",
    name: "serviceDate",
    selectionMode: "range",
    start: "2026-10-12",
    month: "2026-10",
    min: "2026-10-10",
    max: "2026-10-20",
    required: true,
  },
  render: renderCalendar,
};
