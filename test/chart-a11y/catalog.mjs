import "../../src/area-chart/area-chart.js";
import "../../src/bar-chart/bar-chart.js";
import "../../src/box-plot-chart/box-plot-chart.js";
import "../../src/bullet-chart/bullet-chart.js";
import "../../src/column-sparkline/column-sparkline.js";
import "../../src/combo-chart/combo-chart.js";
import "../../src/donut-chart/donut-chart.js";
import "../../src/funnel-chart/funnel-chart.js";
import "../../src/gauge-chart/gauge-chart.js";
import "../../src/heatmap-chart/heatmap-chart.js";
import "../../src/radar-chart/radar-chart.js";
import "../../src/range-chart/range-chart.js";
import "../../src/scatter-chart/scatter-chart.js";
import "../../src/sparkline/sparkline.js";
import "../../src/stacked-area-chart/stacked-area-chart.js";
import "../../src/stacked-bar-chart/stacked-bar-chart.js";
import "../../src/trend-chart/trend-chart.js";
import "../../src/waterfall-chart/waterfall-chart.js";

const LABELS = ["Mon", "Tue", "Wed"];

function host(tag, label) {
  const chart = document.createElement(tag);
  chart.label = label;
  chart.style.inlineSize = "480px";
  return chart;
}

function pair() {
  return [
    { id: "incoming", label: "Incoming", values: [4, 8, 6] },
    { id: "resolved", label: "Resolved", values: [2, 6, 5] },
  ];
}

const PAIR_NEEDLES = ["Incoming", "Resolved", "Mon", "Tue", "Wed", "4", "8", "6", "2", "5"];

function categorical(tag, label) {
  return () => {
    const chart = host(tag, label);
    chart.labels = [...LABELS];
    chart.series = pair();
    return chart;
  };
}

export const CHARTS = [
  {
    id: "area-chart",
    tag: "rowan-area-chart",
    title: "Area chart",
    keyboard: "points",
    interactive: true,
    hideId: "incoming",
    expectArrow: true,
    expectActivate: true,
    needles: PAIR_NEEDLES,
    create: categorical("rowan-area-chart", "Weekly flow"),
  },
  {
    id: "bar-chart",
    tag: "rowan-bar-chart",
    title: "Bar chart",
    keyboard: "points",
    interactive: true,
    hideId: "incoming",
    expectArrow: true,
    expectActivate: true,
    needles: PAIR_NEEDLES,
    create: categorical("rowan-bar-chart", "Weekly throughput"),
  },
  {
    id: "box-plot-chart",
    tag: "rowan-box-plot-chart",
    title: "Box plot",
    keyboard: "points",
    interactive: true,
    hideId: "dwell",
    expectArrow: true,
    expectActivate: true,
    needles: ["Dwell", "North", "South", "Min", "Median", "16"],
    create: () => {
      const chart = host("rowan-box-plot-chart", "Lane dwell");
      chart.labels = ["North", "South"];
      chart.series = [
        {
          id: "dwell",
          label: "Dwell",
          values: [
            { min: 2, q1: 4, median: 6, q3: 9, max: 12, outliers: [16] },
            { min: 1, q1: 3, median: 5, q3: 8, max: 11 },
          ],
        },
      ];
      return chart;
    },
  },
  {
    id: "bullet-chart",
    tag: "rowan-bullet-chart",
    title: "Bullet chart",
    keyboard: "plot-rows",
    interactive: false,
    hideId: "actual",
    expectArrow: true,
    expectActivate: true,
    needles: ["Poor", "Fair", "Good", "Actual", "Target", "82", "90"],
    create: () => {
      const chart = host("rowan-bullet-chart", "Fill rate");
      chart.value = 82;
      chart.target = 90;
      chart.ranges = [
        { from: 0, to: 60, label: "Poor", tone: "danger" },
        { from: 60, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ];
      return chart;
    },
  },
  {
    id: "column-sparkline",
    tag: "rowan-column-sparkline",
    title: "Column sparkline",
    keyboard: "plot",
    interactive: false,
    hideId: "column-sparkline",
    expectArrow: true,
    expectActivate: true,
    needles: ["Mon", "Tue", "Wed", "3", "5", "4", "6"],
    create: () => {
      const chart = host("rowan-column-sparkline", "Open incidents");
      chart.labels = [...LABELS];
      chart.values = [3, 5, 4];
      chart.target = 6;
      return chart;
    },
  },
  {
    id: "combo-chart",
    tag: "rowan-combo-chart",
    title: "Combo chart",
    keyboard: "points",
    interactive: true,
    hideId: "count",
    expectArrow: true,
    expectActivate: true,
    needles: ["Count", "Share", "Mon", "Tue", "Wed", "10", "6", "4", "40", "70", "100"],
    create: () => {
      const chart = host("rowan-combo-chart", "Defects and share");
      chart.labels = [...LABELS];
      chart.series = [
        { id: "count", label: "Count", geometry: "bar", values: [10, 6, 4] },
        { id: "share", label: "Share", geometry: "line", values: [40, 70, 100] },
      ];
      return chart;
    },
  },
  {
    id: "donut-chart",
    tag: "rowan-donut-chart",
    title: "Donut chart",
    keyboard: "points",
    interactive: true,
    hideId: "sources",
    expectArrow: true,
    expectActivate: true,
    needles: ["App", "Email", "Phone", "12", "5", "8"],
    create: () => {
      const chart = host("rowan-donut-chart", "Incident sources");
      chart.labels = ["App", "Email", "Phone"];
      chart.series = [{ id: "sources", label: "Sources", values: [12, 5, 8] }];
      return chart;
    },
  },
  {
    id: "funnel-chart",
    tag: "rowan-funnel-chart",
    title: "Funnel chart",
    keyboard: "points",
    interactive: true,
    hideId: "flow",
    expectArrow: true,
    expectActivate: true,
    needles: ["Leads", "Qualified", "Won", "Flow", "100", "40", "20"],
    create: () => {
      const chart = host("rowan-funnel-chart", "Conversion");
      chart.labels = ["Leads", "Qualified", "Won"];
      chart.series = [{ id: "flow", label: "Flow", values: [100, 40, 20] }];
      return chart;
    },
  },
  {
    id: "gauge-chart",
    tag: "rowan-gauge-chart",
    title: "Gauge chart",
    keyboard: "plot",
    interactive: false,
    hideId: "gauge",
    expectArrow: false,
    expectActivate: true,
    needles: ["Minimum", "Maximum", "Low", "Fair", "Good", "Actual", "Target", "72", "80"],
    create: () => {
      const chart = host("rowan-gauge-chart", "Utilization");
      chart.min = 0;
      chart.max = 100;
      chart.value = 72;
      chart.target = 80;
      chart.ranges = [
        { from: 0, to: 50, label: "Low", tone: "danger" },
        { from: 50, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ];
      return chart;
    },
  },
  {
    id: "heatmap-chart",
    tag: "rowan-heatmap-chart",
    title: "Heatmap chart",
    keyboard: "points",
    interactive: true,
    hideId: "0",
    expectArrow: true,
    expectActivate: true,
    needles: ["North", "South", "Mon", "Tue", "4", "8", "1", "9"],
    create: () => {
      const chart = host("rowan-heatmap-chart", "Lane dwell");
      chart.rows = ["North", "South"];
      chart.columns = ["Mon", "Tue"];
      chart.values = [
        [4, 8],
        [1, 9],
      ];
      return chart;
    },
  },
  {
    id: "radar-chart",
    tag: "rowan-radar-chart",
    title: "Radar chart",
    keyboard: "points",
    interactive: true,
    hideId: "north",
    expectArrow: true,
    expectActivate: true,
    needles: ["North", "South", "Fill", "Dwell", "Damage", "80", "40", "70", "60", "55", "20"],
    create: () => {
      const chart = host("rowan-radar-chart", "Yard profile");
      chart.labels = ["Fill", "Dwell", "Damage"];
      chart.series = [
        { id: "north", label: "North", values: [80, 40, 70] },
        { id: "south", label: "South", values: [60, 55, 20] },
      ];
      return chart;
    },
  },
  {
    id: "range-chart",
    tag: "rowan-range-chart",
    title: "Range chart",
    keyboard: "points",
    interactive: true,
    hideId: "dwell",
    expectArrow: true,
    expectActivate: true,
    needles: ["Dwell", "Mon", "Tue", "Wed", "4", "12", "6", "10", "7", "11"],
    create: () => {
      const chart = host("rowan-range-chart", "SLA window");
      chart.labels = [...LABELS];
      chart.series = [
        {
          id: "dwell",
          label: "Dwell",
          values: [
            { low: 4, high: 12 },
            { low: 6, high: 10 },
            { low: 7, high: 11 },
          ],
        },
      ];
      return chart;
    },
  },
  {
    id: "scatter-chart",
    tag: "rowan-scatter-chart",
    title: "Scatter chart",
    keyboard: "points",
    interactive: true,
    hideId: "a",
    expectArrow: true,
    expectActivate: true,
    needles: ["Lane A", "Lane B", "P1", "Q1", "1", "4", "2", "5"],
    create: () => {
      const chart = host("rowan-scatter-chart", "Fill versus dwell");
      chart.series = [
        {
          id: "a",
          label: "Lane A",
          points: [
            { x: 1, y: 4, label: "P1" },
            { x: 3, y: 6, label: "P3" },
          ],
        },
        {
          id: "b",
          label: "Lane B",
          points: [
            { x: 2, y: 5, label: "Q1" },
            { x: 4, y: 3, label: "Q2" },
          ],
        },
      ];
      return chart;
    },
  },
  {
    id: "sparkline",
    tag: "rowan-sparkline",
    title: "Sparkline",
    keyboard: "plot-rows",
    interactive: false,
    hideId: "sparkline",
    expectArrow: true,
    expectActivate: true,
    needles: ["Mon", "Tue", "Wed", "3", "5", "4", "6"],
    create: () => {
      const chart = host("rowan-sparkline", "Open incidents");
      chart.labels = [...LABELS];
      chart.values = [3, 5, 4];
      chart.target = 6;
      return chart;
    },
  },
  {
    id: "stacked-area-chart",
    tag: "rowan-stacked-area-chart",
    title: "Stacked area chart",
    keyboard: "points",
    interactive: true,
    hideId: "incoming",
    expectArrow: true,
    expectActivate: true,
    needles: PAIR_NEEDLES,
    create: categorical("rowan-stacked-area-chart", "Stacked flow"),
  },
  {
    id: "stacked-bar-chart",
    tag: "rowan-stacked-bar-chart",
    title: "Stacked bar chart",
    keyboard: "points",
    interactive: true,
    hideId: "incoming",
    expectArrow: true,
    expectActivate: true,
    needles: PAIR_NEEDLES,
    create: categorical("rowan-stacked-bar-chart", "Stacked throughput"),
  },
  {
    id: "trend-chart",
    tag: "rowan-trend-chart",
    title: "Trend chart",
    keyboard: "points",
    interactive: true,
    hideId: "incoming",
    expectArrow: true,
    expectActivate: true,
    needles: PAIR_NEEDLES,
    create: categorical("rowan-trend-chart", "Weekly trend"),
  },
  {
    id: "waterfall-chart",
    tag: "rowan-waterfall-chart",
    title: "Waterfall chart",
    keyboard: "points",
    interactive: true,
    hideId: "cash",
    expectArrow: true,
    expectActivate: true,
    needles: ["Cash", "Start", "In", "Out", "End", "20", "10", "4", "26", "total"],
    create: () => {
      const chart = host("rowan-waterfall-chart", "Cash movement");
      chart.labels = ["Start", "In", "Out", "End"];
      chart.series = [
        {
          id: "cash",
          label: "Cash",
          values: [
            { value: 20, type: "total" },
            10,
            -4,
            { value: 26, type: "total" },
          ],
        },
      ];
      return chart;
    },
  },
];

export function applyChartState(chart, spec, stateName) {
  if (spec.interactive && (stateName === "interactive" || stateName === "hidden-series")) {
    chart.interactive = true;
  }
  if (stateName === "hidden-series") chart.hiddenSeries = [spec.hideId];
}
