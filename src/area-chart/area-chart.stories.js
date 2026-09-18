import "./area-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Data Display/Area Chart",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Throughput";
    chart.description = "Filled series. Nulls break the fill.";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    chart.series = [
      { id: "inbound", label: "Inbound", values: [18, 24, null, 12, 20] },
      { id: "outbound", label: "Outbound", values: [10, 14, 16, 9, 11] },
    ];
    return chart;
  },
};
