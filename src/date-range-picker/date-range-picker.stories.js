import "./date-range-picker.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Date Range Picker",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    start: { control: "text" },
    end: { control: "text" },
    label: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    name: "reportDate",
    start: "2026-09-10",
    end: "2026-09-20",
    label: "Report range",
    min: "2026-09-01",
    max: "2026-09-30",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Set a start date, set an end date, then clear the range."],
    events: ["rowan-change"],
  }),
  render: ({ name, start, end, label, min, max, required, disabled }) => {
    const picker = document.createElement("rowan-date-range-picker");
    picker.name = name;
    picker.start = start;
    picker.end = end;
    picker.label = label;
    picker.min = min;
    picker.max = max;
    picker.required = required;
    picker.disabled = disabled;
    return picker;
  },
};

export const ReportFilters = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "0.75rem";

    const picker = document.createElement("rowan-date-range-picker");
    picker.name = "submitted";
    picker.label = "Submitted between";
    picker.start = "2026-10-01";
    picker.end = "2026-10-15";
    picker.min = "2026-01-01";
    picker.max = "2026-12-31";

    const hint = document.createElement("p");
    hint.textContent = "Use this range to filter records in monthly audit reports.";
    hint.style.margin = "0";

    wrapper.append(picker, hint);
    return wrapper;
  },
};