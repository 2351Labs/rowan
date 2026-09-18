import "./donut-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Data Display/Donut Chart",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a slice control, then open the data table."],
    events: ["rowan-point-activate"],
  }),
  render: () => {
    const chart = document.createElement("rowan-donut-chart");
    chart.label = "Incident sources";
    chart.interactive = true;
    chart.labels = ["App", "Email", "Phone"];
    chart.series = [{ id: "sources", label: "Sources", values: [12, -3, 8] }];
    return chart;
  },
};
