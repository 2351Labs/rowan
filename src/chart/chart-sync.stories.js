import "../trend-chart/trend-chart.js";
import "../area-chart/area-chart.js";
import "../bar-chart/bar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const DAYS = Array.from({ length: 30 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 9, 1 + index));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
});

function wave(offset, scale, base) {
  return DAYS.map((_, index) =>
    Math.round(base + scale * Math.sin((index + offset) / 4) + (index % 7 === 0 ? 6 : 0)),
  );
}

function chart(tag, label, series) {
  const element = document.createElement(tag);
  element.label = label;
  element.interactive = true;
  element.locale = "en-US";
  element.labels = DAYS;
  element.series = series;
  element.noMotion = true;
  element.setAttribute("sync-group", "harbor");
  element.setAttribute("zoom", "");
  return element;
}

const SENSOR_COUNT = 200000;

function sensorValues() {
  const values = new Array(SENSOR_COUNT);
  for (let index = 0; index < SENSOR_COUNT; index += 1) {
    const daily = 8 * Math.sin(index / 180);
    const spike = index === 123456 ? 70 : 0;
    values[index] = Math.round(42 + daily + spike);
  }
  return values;
}

export default {
  title: "Components/Data Display/Chart sync",
  parameters: createEventScriptParameters({
    steps: [
      "Hover or focus a point on one chart. The other charts in the harbor group move their crosshair to the same day. The trend line keeps round caps. After the first hover, the pressed point shows its wash and the data-table summary uses a pointer.",
      "Arrow keys move the focused chart and announce that value once.",
      "The sensor chart draws a bounded sample of 200,000 minutes. The tooltip and paged table still read the real series, including the spike.",
    ],
    events: ["rowan-sync", "rowan-zoom"],
  }),
};

export const HarborDashboard = {
  name: "Synced harbor dashboard",
  render: () => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:grid;gap:1rem;max-width:52rem";
    wrap.append(
      chart("rowan-trend-chart", "Arrivals", [
        { id: "gate", label: "Gate", values: wave(0, 12, 40) },
        { id: "dock", label: "Dock", values: wave(2, 8, 28) },
      ]),
      chart("rowan-area-chart", "Queue minutes", [
        { id: "queue", label: "Queue", values: wave(1, 10, 22) },
      ]),
      chart("rowan-bar-chart", "Exceptions", [
        { id: "exceptions", label: "Exceptions", values: wave(3, 4, 6) },
      ]),
    );
    return wrap;
  },
};

export const SensorSeries = {
  name: "200k-point sensor",
  render: () => {
    const chartElement = document.createElement("rowan-trend-chart");
    chartElement.label = "Berth temperature";
    chartElement.description =
      "200,000 one-minute samples. The line keeps the spike. The table pages the real readings.";
    chartElement.interactive = true;
    chartElement.locale = "en-US";
    chartElement.noMotion = true;
    chartElement.setAttribute("large-series", "1200");
    chartElement.setAttribute("zoom", "");
    const labels = new Array(SENSOR_COUNT);
    for (let index = 0; index < SENSOR_COUNT; index += 1) {
      labels[index] = index % 20000 === 0 ? `min ${index}` : "";
    }
    chartElement.labels = labels;
    chartElement.series = [{ id: "temp", label: "Temperature", values: sensorValues() }];
    return chartElement;
  },
};
