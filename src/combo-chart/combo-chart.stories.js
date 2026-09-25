import "./combo-chart.js";
import { createParetoData } from "./pareto.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createCombo({
  label = "Throughput mix",
  description = "Bars on the left scale, line on the right.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-combo-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "volume", label: "Volume", geometry: "bar", values: [18, 24, 12, 20, 16] },
    {
      id: "fill",
      label: "Fill %",
      geometry: "line",
      axis: "secondary",
      values: [72, 80, 64, 88, 76],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Combo Chart",
  component: "rowan-combo-chart",
  tags: ["autodocs"],
  args: {
    label: "Throughput mix",
    description: "Bars on the left scale, line on the right.",
    interactive: true,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a bar or line point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createCombo(args),
};

export const Pareto = {
  parameters: Playground.parameters,
  render: (args) => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = args.label || "Defect Pareto";
    chart.description = "Counts sorted descending with cumulative percent.";
    chart.interactive = Boolean(args.interactive);
    const data = createParetoData({
      labels: ["Seal", "Hinge", "Wiring", "Finish", "Other"],
      values: [42, 28, 16, 9, 5],
    });
    chart.labels = data.labels;
    chart.series = data.series;
    chart.referenceLines = [{ value: 80, label: "80%", tone: "warning", axis: "secondary" }];
    return chart;
  },
};
