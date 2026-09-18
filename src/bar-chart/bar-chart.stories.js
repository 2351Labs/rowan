import "./bar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Data Display/Bar Chart",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a bar with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Incidents by day";
    chart.description = "Incoming versus resolved.";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    chart.series = [
      { id: "incoming", label: "Incoming", values: [18, 24, null, 12, 15] },
      { id: "resolved", label: "Resolved", values: [13, 19, 20, 15, 16] },
    ];
    return chart;
  },
};
