/**
 * Fixture-backed stories shared by every chart and KPI story file.
 * Data comes from stories/fixtures/chart-data.js (deterministic, no Math.random).
 */

import { createEventScriptParameters } from "../src/storybook/event-script.js";
import {
  conversionFunnel,
  customerSegments,
  incompleteTimeSeries,
  kpiValues,
  largeNumberMetrics,
  monthlyRevenue,
  performanceStats,
  productComparison,
  productSales,
  profitBreakdown,
  profitLossData,
  regionalSales,
  revenueAndCosts,
  sparklineValues,
  userMetrics,
  weeklyActivity,
} from "./fixtures/chart-data.js";

const MONTHS = monthlyRevenue.map((row) => row.month);
const QUARTERS = regionalSales.map((row) => row.quarter);
const HOURS = ["00", "03", "06", "09", "12", "15", "18", "21"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ERROR_MESSAGES = {
  noData: "Unable to load chart data",
  noMetricData: "Unable to load chart data",
};

function compactNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function keyboardParameters(events = ["rowan-point-activate"]) {
  return createEventScriptParameters({
    steps: [
      "Hover a mark to read the tooltip.",
      "Move with the keyboard (Arrow, Home, End) and activate with Enter or Space.",
      "Toggle focus across series, thresholds, and legend entries.",
    ],
    events,
  });
}

function describeParts(parts) {
  return {
    docs: {
      description: {
        story: `CSS parts: ${parts.join(", ")}.`,
      },
    },
  };
}

function create(tag, label, description) {
  const chart = document.createElement(tag);
  chart.label = label;
  if (description != null) chart.description = description;
  chart.locale = "en-US";
  if ("interactive" in chart) chart.interactive = true;
  chart.messages = { noData: "No data", noMetricData: "No metric data", chart: label };
  return chart;
}

function slotLabelAndDescription(chart) {
  const label = document.createElement("strong");
  label.slot = "label";
  label.textContent = "Slotted label";
  const description = document.createElement("span");
  description.slot = "description";
  description.textContent = "Slotted description";
  chart.append(label, description);
  return chart;
}

function story(name, render, { events = ["rowan-point-activate"], parts } = {}) {
  const parameters = {
    ...keyboardParameters(events),
    ...(parts ? describeParts(parts) : {}),
  };
  if (parts) {
    parameters.docs.description.story += ` ${keyboardParameters(events).docs.description.story}`;
  }
  return { name, render, parameters };
}

function revenueSeries(rows = revenueAndCosts) {
  return [
    { id: "revenue", label: "Revenue", values: rows.map((row) => row.revenue) },
    { id: "costs", label: "Costs", values: rows.map((row) => row.costs) },
    { id: "profit", label: "Profit", values: rows.map((row) => row.profit) },
  ];
}

function regionSeries() {
  return ["north", "south", "east", "west"].map((id) => ({
    id,
    label: id[0].toUpperCase() + id.slice(1),
    values: regionalSales.map((row) => row[id]),
  }));
}

function applyCartesian(chart, { labels, series, referenceLines, orientation, stackMode, variant, geometry }) {
  chart.labels = labels;
  chart.series = series;
  chart.valueFormatter = compactNumber;
  if (orientation) chart.orientation = orientation;
  if (stackMode) chart.stackMode = stackMode;
  if (variant) chart.variant = variant;
  if (geometry) chart.geometry = geometry;
  if (referenceLines) chart.referenceLines = referenceLines;
  const config = {
    labels,
    series,
    interactive: true,
    valueFormatter: compactNumber,
  };
  if (orientation || chart.orientation) config.orientation = orientation || chart.orientation;
  if (stackMode || chart.stackMode) config.stackMode = stackMode || chart.stackMode;
  if (variant || chart.variant) config.variant = variant || chart.variant;
  if (geometry || chart.geometry) config.geometry = geometry || chart.geometry;
  if (referenceLines) config.referenceLines = referenceLines;
  chart.config = config;
  return chart;
}

function emptyCartesian(tag, label) {
  const chart = create(tag, label, "Unable to load chart data");
  chart.messages = ERROR_MESSAGES;
  return applyCartesian(chart, { labels: [], series: [] });
}

export const coverageStories = {
  "rowan-area-chart": {
    catalog: story("Realistic revenue", () => {
      const chart = create("rowan-area-chart", "Revenue, costs, and profit", "24 months");
      return applyCartesian(chart, {
        labels: revenueAndCosts.map((row) => row.month),
        series: revenueSeries(),
        referenceLines: [{ value: 70000, label: "Threshold", tone: "warning" }],
      });
    }, { parts: ["control", "label", "description", "chart", "plot", "legend", "legend-item", "legend-swatch", "point", "detail", "summary", "table", "area", "line", "hover", "reference-line"] }),
    sparse: story("Sparse null gaps", () => {
      const chart = create("rowan-area-chart", "Users with gaps", "Null breaks the fill");
      return applyCartesian(chart, {
        labels: userMetrics.map((row) => row.date),
        series: [
          { id: "users", label: "Users", values: userMetrics.map((row) => row.users) },
          { id: "active", label: "Active users", values: userMetrics.map((row) => row.activeUsers) },
          { id: "sessions", label: "Sessions", values: userMetrics.map((row) => row.sessions) },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-area-chart", "Monthly profit and loss", "Signed values");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [{ id: "profit", label: "Profit", values: profitLossData.map((row) => row.profit) }],
        referenceLines: [{ value: 0, label: "Break even", tone: "neutral" }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-area-chart", "Page views", "Compact formatting");
      return applyCartesian(chart, {
        labels: largeNumberMetrics.map((row) => row.metric),
        series: [
          { id: "value", label: "Value", values: largeNumberMetrics.map((row) => row.value) },
          {
            id: "change",
            label: "Change",
            values: largeNumberMetrics.map((row) => row.change * 1_000_000),
          },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-area-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-area-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-area-chart", "Slotted label", "Slotted description"), {
          labels: MONTHS,
          series: [
            { id: "revenue", label: "Revenue", values: monthlyRevenue.map((row) => row.revenue) },
            { id: "target", label: "Target", values: monthlyRevenue.map((row) => row.target) },
          ],
          referenceLines: [{ value: 70000, label: "Threshold", tone: "danger" }],
        }),
      ),
    ),
  },

  "rowan-bar-chart": {
    catalog: story("Realistic product sales", () => {
      const chart = create("rowan-bar-chart", "Product sales", "Sales and units");
      chart.orientation = "vertical";
      return applyCartesian(chart, {
        labels: productSales.map((row) => row.product),
        series: [
          { id: "sales", label: "Sales", values: productSales.map((row) => row.sales) },
          { id: "units", label: "Units", values: productSales.map((row) => row.units) },
        ],
        orientation: "vertical",
      });
    }, { parts: ["control", "label", "description", "chart", "plot", "bar", "legend", "hover", "table"] }),
    horizontal: story("Horizontal categories", () => {
      const chart = create("rowan-bar-chart", "Regional sales", "Horizontal orientation");
      return applyCartesian(chart, {
        labels: QUARTERS,
        series: regionSeries(),
        orientation: "horizontal",
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-bar-chart", "Incomplete series", "Missing months");
      return applyCartesian(chart, {
        labels: incompleteTimeSeries.map((row) => row.date),
        series: [
          { id: "value", label: "Value", values: incompleteTimeSeries.map((row) => row.value) },
          {
            id: "users",
            label: "Users",
            values: userMetrics.map((row) => row.users).slice(0, incompleteTimeSeries.length),
          },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-bar-chart", "Profit and loss", "Signed bars");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [{ id: "profit", label: "Profit", values: profitLossData.map((row) => row.profit) }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-bar-chart", "Platform totals", "Compact axis labels");
      return applyCartesian(chart, {
        labels: largeNumberMetrics.map((row) => row.metric),
        series: [{ id: "value", label: "Value", values: largeNumberMetrics.map((row) => row.value) }],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-bar-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-bar-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-bar-chart", "Slotted label", "Slotted description"), {
          labels: MONTHS,
          series: [
            { id: "revenue", label: "Revenue", values: monthlyRevenue.map((row) => row.revenue) },
          ],
          orientation: "vertical",
        }),
      ),
    ),
  },

  "rowan-box-plot-chart": {
    catalog: story("Service latency", () => {
      const chart = create("rowan-box-plot-chart", "Response time", "Five-number summaries");
      const values = performanceStats.map((row) => ({
        min: row.min,
        q1: row.q1,
        median: row.median,
        q3: row.q3,
        max: row.max,
        outliers: [row.max + 40],
      }));
      return applyCartesian(chart, {
        labels: performanceStats.map((row) => row.category),
        series: [
          { id: "weekday", label: "Weekday", values },
          {
            id: "weekend",
            label: "Weekend",
            values: values.map((box) => ({
              ...box,
              min: box.min - 10,
              median: box.median - 15,
            })),
          },
        ],
      });
    }, { parts: ["control", "plot", "box", "whisker", "median", "outlier", "hover", "table"] }),
    negative: story("Negative values", () => {
      const chart = create("rowan-box-plot-chart", "Temperature delta", "Signed whiskers");
      return applyCartesian(chart, {
        labels: ["Dock", "Yard"],
        series: [
          {
            id: "delta",
            label: "Delta",
            values: [
              { min: -12, q1: -4, median: 1, q3: 6, max: 14, outliers: [-20] },
              { min: -8, q1: -2, median: 3, q3: 7, max: 11 },
            ],
          },
        ],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-box-plot-chart", "Partial summaries", "Null box is no-data");
      return applyCartesian(chart, {
        labels: ["North", "South"],
        series: [
          {
            id: "dwell",
            label: "Dwell",
            values: [{ min: 4, q1: 8, median: 12, q3: 16, max: 22 }, null],
          },
        ],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-box-plot-chart", "Request volume", "Compact formatting");
      return applyCartesian(chart, {
        labels: ["API", "Web"],
        series: [
          {
            id: "calls",
            label: "Calls",
            values: [
              { min: 800000, q1: 1200000, median: 1800000, q3: 2400000, max: 3200000 },
              { min: 400000, q1: 900000, median: 1500000, q3: 2100000, max: 2800000 },
            ],
          },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-box-plot-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-box-plot-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-box-plot-chart", "Slotted label", "Slotted description"), {
          labels: ["North"],
          series: [
            {
              id: "dwell",
              label: "Dwell",
              values: [{ min: 4, q1: 8, median: 12, q3: 16, max: 22 }],
            },
          ],
        }),
      ),
    ),
  },

  "rowan-bullet-chart": {
    catalog: story(
      "Customer satisfaction",
      () => {
        const chart = create("rowan-bullet-chart", "Customer satisfaction");
        chart.value = kpiValues.customerSat;
        chart.target = 90;
        chart.scale = true;
        chart.intent = "higher";
        chart.encoding = "status";
        chart.ranges = [
          { from: 0, to: 60, label: "Poor", tone: "danger" },
          { from: 60, to: 80, label: "Fair", tone: "warning" },
          { from: 80, to: 100, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [], parts: ["chart", "plot", "range", "actual", "target", "tick", "hover", "table"] },
    ),
    encodings: story(
      "Encodings and intent",
      () => {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gap = "1rem";
        for (const encoding of ["ink", "accent", "status", "tone"]) {
          const chart = create("rowan-bullet-chart", `Fill rate (${encoding})`);
          chart.value = 82;
          chart.target = 90;
          chart.scale = true;
          chart.intent = encoding === "ink" ? "lower" : "higher";
          chart.encoding = encoding;
          chart.ranges = [
            { from: 0, to: 60, label: "Poor", tone: "danger" },
            { from: 60, to: 80, label: "Fair", tone: "warning" },
            { from: 80, to: 100, label: "Good", tone: "success" },
          ];
          row.append(chart);
        }
        return row;
      },
      { events: [] },
    ),
    negative: story(
      "Negative values",
      () => {
        const chart = create("rowan-bullet-chart", "Variance");
        chart.value = -12;
        chart.target = 0;
        chart.scale = true;
        chart.intent = "higher";
        chart.encoding = "tone";
        chart.ranges = [
          { from: -40, to: -10, label: "Poor", tone: "danger" },
          { from: -10, to: 10, label: "Fair", tone: "warning" },
          { from: 10, to: 40, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [] },
    ),
    largeNumbers: story(
      "Large numbers",
      () => {
        const chart = create("rowan-bullet-chart", "Revenue");
        chart.value = 12500000;
        chart.target = 10000000;
        chart.scale = true;
        chart.intent = "higher";
        chart.encoding = "accent";
        chart.ranges = [
          { from: 0, to: 6000000, label: "Poor", tone: "danger" },
          { from: 6000000, to: 10000000, label: "Fair", tone: "warning" },
          { from: 10000000, to: 16000000, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [] },
    ),
    sparse: story(
      "Sparse nulls",
      () => {
        const chart = create("rowan-bullet-chart", "Missing actual");
        chart.value = null;
        chart.target = 90;
        chart.scale = true;
        chart.intent = "higher";
        chart.encoding = "ink";
        chart.ranges = [
          { from: 0, to: 60, label: "Poor", tone: "danger" },
          { from: 60, to: 100, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [] },
    ),
    empty: story(
      "Empty",
      () => {
        const chart = create("rowan-bullet-chart", "No data");
        chart.value = null;
        chart.target = null;
        chart.ranges = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
    error: story(
      "Error",
      () => {
        const chart = create("rowan-bullet-chart", "Unable to load chart data");
        chart.value = null;
        chart.target = null;
        chart.ranges = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
  },

  "rowan-column-sparkline": {
    catalog: story(
      "Monthly revenue",
      () => {
        const chart = create("rowan-column-sparkline", "Monthly revenue");
        chart.tone = "info";
        chart.values = sparklineValues.revenue;
        chart.labels = MONTHS;
        chart.target = 60;
        chart.aboveTone = "warning";
        chart.belowTone = "success";
        return chart;
      },
      {
        events: [],
        parts: ["chart", "plot", "column", "target", "hover", "table"],
      },
    ),
    negative: story(
      "Negative values",
      () => {
        const chart = create("rowan-column-sparkline", "Daily variance");
        chart.tone = "neutral";
        chart.values = sparklineValues.negative;
        chart.labels = DAYS;
        chart.target = 0;
        chart.aboveTone = "danger";
        chart.belowTone = "success";
        return chart;
      },
      { events: [] },
    ),
    sparse: story(
      "Sparse nulls",
      () => {
        const chart = create("rowan-column-sparkline", "Orders with gaps");
        chart.values = [120, null, 178, 165, null, 208, 195];
        chart.labels = DAYS;
        return chart;
      },
      { events: [] },
    ),
    largeNumbers: story(
      "Large numbers",
      () => {
        const chart = create("rowan-column-sparkline", "Page views");
        chart.values = [1200000, 1450000, 1320000, 1780000, 2100000, 1980000, 2400000];
        chart.labels = DAYS;
        chart.target = 1600000;
        return chart;
      },
      { events: [] },
    ),
    tones: story(
      "Tones",
      () => {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gap = "0.75rem";
        for (const tone of ["neutral", "info", "success", "warning", "danger"]) {
          const chart = create("rowan-column-sparkline", tone);
          chart.tone = tone;
          chart.values = sparklineValues.orders;
          chart.labels = MONTHS;
          row.append(chart);
        }
        return row;
      },
      { events: [] },
    ),
    empty: story(
      "Empty",
      () => {
        const chart = create("rowan-column-sparkline", "No data");
        chart.values = [];
        chart.labels = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
    error: story(
      "Error",
      () => {
        const chart = create("rowan-column-sparkline", "Unable to load chart data");
        chart.values = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
  },

  "rowan-combo-chart": {
    catalog: story("Revenue and margin", () => {
      const chart = create("rowan-combo-chart", "Revenue and margin", "Bars and a line");
      const series = [
        {
          id: "revenue",
          label: "Revenue",
          geometry: "bar",
          values: monthlyRevenue.map((row) => row.revenue),
        },
        {
          id: "costs",
          label: "Costs",
          geometry: "area",
          values: monthlyRevenue.map((row) => Math.round(row.revenue * 0.62)),
        },
        {
          id: "margin",
          label: "Margin %",
          geometry: "line",
          axis: "secondary",
          values: monthlyRevenue.map(() => Math.round((1 - 0.62) * 100)),
        },
      ];
      const referenceLines = [{ value: 70000, label: "Threshold", tone: "warning" }];
      return applyCartesian(chart, { labels: MONTHS, series, referenceLines });
    }, { parts: ["control", "plot", "bar", "line", "area", "hover", "table"] }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-combo-chart", "Users and sessions", "Gaps stay empty");
      return applyCartesian(chart, {
        labels: userMetrics.map((row) => row.date),
        series: [
          { id: "users", label: "Users", geometry: "bar", values: userMetrics.map((row) => row.users) },
          {
            id: "sessions",
            label: "Sessions",
            geometry: "line",
            values: userMetrics.map((row) => row.sessions),
          },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-combo-chart", "Profit and volume", "Signed profit line");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [
          {
            id: "volume",
            label: "Volume",
            geometry: "bar",
            values: profitLossData.map((_, index) => 20 + index),
          },
          {
            id: "profit",
            label: "Profit",
            geometry: "line",
            values: profitLossData.map((row) => row.profit),
          },
        ],
        referenceLines: [{ value: 0, label: "Break even", tone: "neutral" }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-combo-chart", "Platform totals", "Compact formatting");
      return applyCartesian(chart, {
        labels: largeNumberMetrics.map((row) => row.metric),
        series: [
          {
            id: "value",
            label: "Value",
            geometry: "bar",
            values: largeNumberMetrics.map((row) => row.value),
          },
          {
            id: "change",
            label: "Change",
            geometry: "line",
            axis: "secondary",
            values: largeNumberMetrics.map((row) => row.change),
          },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-combo-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-combo-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-combo-chart", "Slotted label", "Slotted description"), {
          labels: MONTHS,
          series: [
            {
              id: "revenue",
              label: "Revenue",
              geometry: "bar",
              values: monthlyRevenue.map((row) => row.revenue),
            },
          ],
        }),
      ),
    ),
  },

  "rowan-donut-chart": {
    catalog: story("Product mix", () => {
      const chart = create("rowan-donut-chart", "Product sales", "One series, many slices");
      chart.variant = "donut";
      return applyCartesian(chart, {
        labels: productSales.map((row) => row.product),
        series: [{ id: "sales", label: "Sales", values: productSales.map((row) => row.sales) }],
      });
    }, { parts: ["control", "label", "plot", "slice", "total", "legend", "hover", "table"] }),
    pie: story("Pie variant", () => {
      const chart = create("rowan-donut-chart", "Product sales", "Pie fills the hole");
      chart.variant = "pie";
      return applyCartesian(chart, {
        labels: productSales.map((row) => row.product),
        series: [{ id: "units", label: "Units", values: productSales.map((row) => row.units) }],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-donut-chart", "Adjustments", "Negatives are no-data");
      chart.variant = "donut";
      return applyCartesian(chart, {
        labels: profitLossData.slice(0, 6).map((row) => row.period),
        series: [
          { id: "profit", label: "Profit", values: profitLossData.slice(0, 6).map((row) => row.profit) },
        ],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-donut-chart", "Sources with gaps", "Null slices drop out");
      return applyCartesian(chart, {
        labels: ["App", "Email", "Phone", "Chat"],
        series: [{ id: "sources", label: "Sources", values: [120, null, 80, 40] }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-donut-chart", "Platform totals", "Compact formatting");
      return applyCartesian(chart, {
        labels: largeNumberMetrics.map((row) => row.metric),
        series: [{ id: "value", label: "Value", values: largeNumberMetrics.map((row) => row.value) }],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-donut-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-donut-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-donut-chart", "Slotted label", "Slotted description"), {
          labels: ["App", "Email"],
          series: [{ id: "sources", label: "Sources", values: [12, 8] }],
        }),
      ),
    ),
  },

  "rowan-funnel-chart": {
    catalog: story("Conversion funnel", () => {
      const chart = create("rowan-funnel-chart", "Acquisition funnel", "Stages stay in order");
      chart.variant = "funnel";
      return applyCartesian(chart, {
        labels: conversionFunnel.map((row) => row.stage),
        series: [{ id: "flow", label: "Visitors", values: conversionFunnel.map((row) => row.value) }],
      });
    }, { parts: ["control", "plot", "stage", "hover", "table"] }),
    cone: story("Cone variant", () => {
      const chart = create("rowan-funnel-chart", "Acquisition cone", "Cone variant");
      chart.variant = "cone";
      return applyCartesian(chart, {
        labels: conversionFunnel.map((row) => row.stage),
        series: [{ id: "flow", label: "Visitors", values: conversionFunnel.map((row) => row.value) }],
      });
    }),
    pyramid: story("Pyramid variant", () => {
      const chart = create("rowan-funnel-chart", "Acquisition pyramid", "Pyramid variant");
      chart.variant = "pyramid";
      return applyCartesian(chart, {
        labels: conversionFunnel.map((row) => row.stage),
        series: [
          { id: "renewals", label: "Renewals", values: conversionFunnel.map((row) => row.conversion) },
        ],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-funnel-chart", "Incomplete funnel", "Null stage is no-data");
      chart.variant = "funnel";
      return applyCartesian(chart, {
        labels: ["Leads", "Qualified", "Quoted", "Won"],
        series: [{ id: "flow", label: "Flow", values: [1200, null, 180, 42] }],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-funnel-chart", "Adjustments", "Negatives are no-data");
      chart.variant = "funnel";
      return applyCartesian(chart, {
        labels: ["Start", "Drop", "Recover", "End"],
        series: [{ id: "flow", label: "Flow", values: [100, -20, 40, 15] }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-funnel-chart", "Traffic funnel", "Compact formatting");
      chart.variant = "funnel";
      return applyCartesian(chart, {
        labels: ["Visits", "Signups", "Trials", "Purchases"],
        series: [{ id: "flow", label: "Flow", values: [125000000, 24000000, 4200000, 860000] }],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-funnel-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-funnel-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-funnel-chart", "Slotted label", "Slotted description"), {
          labels: conversionFunnel.map((row) => row.stage),
          series: [{ id: "flow", label: "Visitors", values: conversionFunnel.map((row) => row.value) }],
        }),
      ),
    ),
  },

  "rowan-gauge-chart": {
    catalog: story(
      "Server uptime",
      () => {
        const chart = create("rowan-gauge-chart", "Server uptime");
        chart.min = 90;
        chart.max = 100;
        chart.value = kpiValues.serverUptime;
        chart.target = 99.9;
        chart.ranges = [
          { from: 90, to: 95, label: "Poor", tone: "danger" },
          { from: 95, to: 99, label: "Fair", tone: "warning" },
          { from: 99, to: 100, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [], parts: ["chart", "plot", "track", "range", "needle", "hub", "target", "readout", "tick-label", "hover", "table"] },
    ),
    negative: story(
      "Negative values",
      () => {
        const chart = create("rowan-gauge-chart", "Temperature delta");
        chart.min = -20;
        chart.max = 20;
        chart.value = -6;
        chart.target = 0;
        chart.ranges = [
          { from: -20, to: -5, label: "Cold", tone: "info" },
          { from: -5, to: 5, label: "Stable", tone: "success" },
          { from: 5, to: 20, label: "Hot", tone: "danger" },
        ];
        return chart;
      },
      { events: [] },
    ),
    largeNumbers: story(
      "Large numbers",
      () => {
        const chart = create("rowan-gauge-chart", "Revenue");
        chart.min = 0;
        chart.max = 20000000;
        chart.value = 12500000;
        chart.target = 15000000;
        chart.ranges = [
          { from: 0, to: 8000000, label: "Low", tone: "danger" },
          { from: 8000000, to: 14000000, label: "Fair", tone: "warning" },
          { from: 14000000, to: 20000000, label: "Good", tone: "success" },
        ];
        return chart;
      },
      { events: [] },
    ),
    sparse: story(
      "Sparse nulls",
      () => {
        const chart = create("rowan-gauge-chart", "Missing reading");
        chart.min = 0;
        chart.max = 100;
        chart.value = null;
        chart.target = 80;
        chart.ranges = [
          { from: 0, to: 50, label: "Low", tone: "danger" },
          { from: 50, to: 100, label: "High", tone: "success" },
        ];
        return chart;
      },
      { events: [] },
    ),
    empty: story(
      "Empty",
      () => {
        const chart = create("rowan-gauge-chart", "No data");
        chart.min = 0;
        chart.max = 100;
        chart.value = null;
        chart.target = null;
        chart.ranges = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
    error: story(
      "Error",
      () => {
        const chart = create("rowan-gauge-chart", "Unable to load chart data");
        chart.value = null;
        chart.target = null;
        chart.ranges = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
  },

  "rowan-heatmap-chart": {
    catalog: story("Weekly activity", () => {
      const chart = create("rowan-heatmap-chart", "Weekly activity", "Hourly intensity");
      const columns = HOURS;
      const rows = DAYS;
      const values = weeklyActivity.map((day) => HOURS.map((hour) => day[Number(hour)]));
      values[2][3] = null;
      chart.rows = rows;
      chart.columns = columns;
      chart.values = values;
      chart.valueFormatter = compactNumber;
      chart.config = { rows, columns, values, interactive: true, valueFormatter: compactNumber };
      return chart;
    }, { parts: ["control", "plot", "cell", "hover", "table"] }),
    points: story("Points", () => {
      const chart = create("rowan-heatmap-chart", "Dock activity", "Authored points");
      const points = [
        { x: "Dock 1", y: "Mon", value: 4 },
        { x: "Dock 2", y: "Mon", value: 9 },
        { x: "Dock 1", y: "Tue", value: null },
        { x: "Dock 2", y: "Tue", value: -3 },
        { x: "Dock 1", y: "Wed", value: 1200000 },
      ];
      chart.points = points;
      chart.valueFormatter = compactNumber;
      chart.config = { points, interactive: true, valueFormatter: compactNumber };
      return chart;
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-heatmap-chart", "Temperature anomaly", "Signed cells");
      const rows = ["North", "South"];
      const columns = ["Dawn", "Noon", "Dusk"];
      const values = [
        [-4, 1, 6],
        [-2, null, 3],
      ];
      chart.rows = rows;
      chart.columns = columns;
      chart.values = values;
      chart.config = { rows, columns, values, interactive: true };
      return chart;
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-heatmap-chart", "Request volume", "Compact formatting");
      const rows = ["API", "Web"];
      const columns = ["AM", "PM"];
      const values = [
        [1200000, 2400000],
        [800000, 1600000],
      ];
      chart.rows = rows;
      chart.columns = columns;
      chart.values = values;
      chart.valueFormatter = compactNumber;
      chart.config = { rows, columns, values, interactive: true, valueFormatter: compactNumber };
      return chart;
    }),
    empty: story("Empty", () => {
      const chart = create("rowan-heatmap-chart", "No data", "Unable to load chart data");
      chart.rows = [];
      chart.columns = [];
      chart.values = [];
      chart.messages = ERROR_MESSAGES;
      chart.config = { rows: [], columns: [], values: [], interactive: true };
      return chart;
    }),
    error: story("Error", () => {
      const chart = create("rowan-heatmap-chart", "Unable to load chart data", "Request failed");
      chart.rows = [];
      chart.columns = [];
      chart.values = [];
      chart.points = [];
      chart.messages = ERROR_MESSAGES;
      return chart;
    }),
    slots: story("Slots", () => {
      const chart = create("rowan-heatmap-chart", "Slotted label", "Slotted description");
      chart.rows = ["North"];
      chart.columns = ["AM", "PM"];
      chart.values = [[12, 28]];
      return slotLabelAndDescription(chart);
    }),
  },

  "rowan-kpi-card": {
    catalog: story(
      "Revenue KPI",
      () => {
        const card = create("rowan-kpi-card", "Revenue");
        card.tone = "success";
        card.deltaLabel = "vs last year";
        card.loading = false;
        card.value = largeNumberMetrics[1].value;
        card.delta = largeNumberMetrics[1].change;
        card.messages = { noData: "No data", kpi: "Revenue", deltaWithLabel: "{value} {label}" };
        const icon = document.createElement("span");
        icon.slot = "icon";
        icon.textContent = "▲";
        const description = document.createElement("span");
        // default slot
        description.textContent = "Trailing twelve months";
        const spark = document.createElement("rowan-sparkline");
        spark.slot = "chart";
        spark.label = "Monthly revenue";
        spark.values = monthlyRevenue.map((row) => row.revenue);
        spark.labels = MONTHS;
        card.append(icon, description, spark);
        return card;
      },
      {
        events: [],
        parts: ["card", "icon", "body", "label", "value", "delta", "description", "chart"],
      },
    ),
    tones: story(
      "Tones",
      () => {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gap = "1rem";
        row.style.gridTemplateColumns = "repeat(auto-fit, minmax(12rem, 1fr))";
        for (const tone of ["neutral", "info", "success", "warning", "danger"]) {
          const card = create("rowan-kpi-card", tone);
          card.tone = tone;
          card.value = kpiValues.customerSat;
          card.delta = tone === "danger" ? -2.1 : 4.2;
          card.deltaLabel = "vs last month";
          row.append(card);
        }
        return row;
      },
      { events: [] },
    ),
    negative: story(
      "Negative delta",
      () => {
        const card = create("rowan-kpi-card", "Transactions");
        card.tone = "danger";
        card.value = largeNumberMetrics[2].value;
        card.delta = largeNumberMetrics[2].change;
        card.deltaLabel = "vs last year";
        return card;
      },
      { events: [] },
    ),
    largeNumbers: story(
      "Large numbers",
      () => {
        const card = create("rowan-kpi-card", "Page views");
        card.value = 125000000;
        card.delta = 15.7;
        card.deltaLabel = "vs last year";
        card.locale = "en-US";
        return card;
      },
      { events: [] },
    ),
    empty: story(
      "Empty",
      () => {
        const card = create("rowan-kpi-card", "No data");
        card.value = null;
        card.delta = null;
        card.messages = { noData: "No data" };
        return card;
      },
      { events: [] },
    ),
    loading: story(
      "Loading",
      () => {
        const card = create("rowan-kpi-card", "Revenue");
        card.value = 12500000;
        card.loading = true;
        return card;
      },
      { events: [] },
    ),
    error: story(
      "Error",
      () => {
        const card = create("rowan-kpi-card", "Unable to load chart data");
        card.value = null;
        card.delta = null;
        card.messages = { noData: "Unable to load chart data", kpi: "KPI" };
        return card;
      },
      { events: [] },
    ),
  },

  "rowan-radar-chart": {
    catalog: story("Product comparison", () => {
      const chart = create("rowan-radar-chart", "Product comparison", "Three products");
      chart.geometry = "line";
      const labels = ["performance", "reliability", "usability", "price", "support"];
      return applyCartesian(chart, {
        labels,
        series: productComparison.map((product) => ({
          id: product.product,
          label: product.product,
          values: labels.map((key) => product[key]),
        })),
      });
    }, { parts: ["control", "plot", "line", "area", "point", "hover", "table"] }),
    area: story("Area geometry", () => {
      const chart = create("rowan-radar-chart", "Product comparison", "Filled geometry");
      chart.geometry = "area";
      const labels = ["performance", "reliability", "usability", "price", "support"];
      return applyCartesian(chart, {
        labels,
        series: productComparison.map((product) => ({
          id: product.product,
          label: product.product,
          values: labels.map((key) => product[key]),
        })),
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-radar-chart", "Partial profile", "Null vertex is no-data");
      chart.geometry = "line";
      return applyCartesian(chart, {
        labels: ["Fill", "Dwell", "Damage", "OTD"],
        series: [
          { id: "north", label: "North", values: [82, null, 18, 76] },
          { id: "south", label: "South", values: [64, 58, null, 88] },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-radar-chart", "Score delta", "Signed axes");
      chart.geometry = "line";
      return applyCartesian(chart, {
        labels: ["Speed", "Cost", "Risk"],
        series: [
          { id: "a", label: "A", values: [4, -2, 1] },
          { id: "b", label: "B", values: [-1, 3, -4] },
        ],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-radar-chart", "Volume profile", "Compact formatting");
      chart.geometry = "area";
      return applyCartesian(chart, {
        labels: ["API", "Web", "Jobs"],
        series: [
          { id: "calls", label: "Calls", values: [1200000, 800000, 2400000] },
          { id: "errors", label: "Errors", values: [12000, 8000, 2400] },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-radar-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-radar-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-radar-chart", "Slotted label", "Slotted description"), {
          labels: ["A", "B", "C"],
          series: [{ id: "one", label: "One", values: [10, 20, 30] }],
        }),
      ),
    ),
  },

  "rowan-range-chart": {
    catalog: story("Revenue band", () => {
      const chart = create("rowan-range-chart", "Revenue band", "Low and high per month");
      chart.variant = "bar";
      return applyCartesian(chart, {
        labels: MONTHS,
        series: [
          {
            id: "actual",
            label: "Actual",
            values: monthlyRevenue.map((row) => ({ low: row.target * 0.85, high: row.revenue })),
          },
          {
            id: "plan",
            label: "Plan",
            values: monthlyRevenue.map((row) => ({ low: row.target * 0.7, high: row.target })),
          },
        ],
      });
    }, { parts: ["control", "plot", "bar", "area", "hover", "table"] }),
    area: story("Area variant", () => {
      const chart = create("rowan-range-chart", "Revenue band", "Area variant");
      chart.variant = "area";
      return applyCartesian(chart, {
        labels: MONTHS,
        series: [
          {
            id: "actual",
            label: "Actual",
            values: monthlyRevenue.map((row) => ({ low: row.target, high: row.revenue })),
          },
        ],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-range-chart", "Incomplete windows", "Null low or high is no-data");
      chart.variant = "bar";
      return applyCartesian(chart, {
        labels: ["Mon", "Tue", "Wed", "Thu"],
        series: [
          {
            id: "actual",
            label: "Actual",
            values: [
              { low: 8, high: 18 },
              { low: null, high: 22 },
              { low: 10, high: null },
              { low: 9, high: 15 },
            ],
          },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-range-chart", "Temperature window", "Signed range");
      chart.variant = "bar";
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [
          {
            id: "band",
            label: "Band",
            values: profitLossData.map((row) => ({ low: row.profit - 1500, high: row.profit + 800 })),
          },
        ],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-range-chart", "Traffic window", "Compact formatting");
      chart.variant = "area";
      return applyCartesian(chart, {
        labels: ["AM", "PM"],
        series: [
          {
            id: "calls",
            label: "Calls",
            values: [
              { low: 800000, high: 1600000 },
              { low: 1200000, high: 2400000 },
            ],
          },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-range-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-range-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-range-chart", "Slotted label", "Slotted description"), {
          labels: ["Mon"],
          series: [{ id: "actual", label: "Actual", values: [{ low: 8, high: 18 }] }],
        }),
      ),
    ),
  },

  "rowan-scatter-chart": {
    catalog: story("Customer segments", () => {
      const chart = create("rowan-scatter-chart", "Spend vs frequency", "Bubble size is unused here");
      const groups = ["Premium", "Regular", "Occasional", "New"];
      const series = groups.map((segment) => ({
        id: segment.toLowerCase(),
        label: segment,
        points: customerSegments
          .filter((row) => row.segment === segment)
          .slice(0, 12)
          .map((row) => ({ x: row.frequency, y: row.spend, size: 10, label: segment })),
      }));
      chart.series = series;
      chart.valueFormatter = compactNumber;
      chart.config = { series, interactive: true, valueFormatter: compactNumber };
      return chart;
    }, { parts: ["control", "plot", "point", "hover", "table"] }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-scatter-chart", "Partial points", "Null x or y is no-data");
      const series = [
        {
          id: "north",
          label: "North",
          points: [
            { x: 12, y: 64000, size: 8, label: "Dock 1" },
            { x: null, y: 72000, size: 14, label: "Skipped" },
            { x: 9, y: null, size: 6, label: "Missing y" },
          ],
        },
      ];
      chart.series = series;
      chart.config = { series, interactive: true };
      return chart;
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-scatter-chart", "Profit vs growth", "Signed axes");
      const series = [
        {
          id: "months",
          label: "Months",
          points: profitLossData.map((row, index) => ({
            x: index - 4,
            y: row.profit,
            size: 8,
            label: row.period,
          })),
        },
      ];
      chart.series = series;
      chart.config = { series, interactive: true, valueFormatter: compactNumber };
      chart.valueFormatter = compactNumber;
      return chart;
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-scatter-chart", "Spend", "Compact formatting");
      const series = [
        {
          id: "accounts",
          label: "Accounts",
          points: customerSegments.slice(0, 20).map((row) => ({
            x: row.frequency,
            y: row.spend * 1000,
            size: 12,
            label: row.segment,
          })),
        },
      ];
      chart.series = series;
      chart.valueFormatter = compactNumber;
      chart.config = { series, interactive: true, valueFormatter: compactNumber };
      return chart;
    }),
    empty: story("Empty", () => {
      const chart = create("rowan-scatter-chart", "No data", "Unable to load chart data");
      chart.series = [];
      chart.config = { series: [], interactive: true };
      chart.messages = ERROR_MESSAGES;
      return chart;
    }),
    error: story("Error", () => {
      const chart = create("rowan-scatter-chart", "Unable to load chart data", "Request failed");
      chart.series = [];
      chart.messages = ERROR_MESSAGES;
      return chart;
    }),
    slots: story("Slots", () => {
      const chart = create("rowan-scatter-chart", "Slotted label", "Slotted description");
      chart.series = [
        { id: "north", label: "North", points: [{ x: 4, y: 10, size: 8, label: "A" }] },
      ];
      return slotLabelAndDescription(chart);
    }),
  },

  "rowan-sparkline": {
    catalog: story(
      "Monthly revenue",
      () => {
        const chart = create("rowan-sparkline", "Monthly revenue");
        chart.tone = "info";
        chart.variant = "line";
        chart.values = sparklineValues.revenue;
        chart.labels = MONTHS;
        chart.target = 60;
        chart.aboveTone = "warning";
        chart.belowTone = "success";
        return chart;
      },
      { events: [], parts: ["chart", "plot", "line", "area", "target", "hover", "hover-point", "table"] },
    ),
    area: story(
      "Area variant",
      () => {
        const chart = create("rowan-sparkline", "Orders");
        chart.variant = "area";
        chart.tone = "success";
        chart.values = sparklineValues.orders;
        chart.labels = MONTHS;
        return chart;
      },
      { events: [] },
    ),
    negative: story(
      "Negative values",
      () => {
        const chart = create("rowan-sparkline", "Daily variance");
        chart.variant = "area";
        chart.values = sparklineValues.negative;
        chart.labels = DAYS;
        chart.target = 0;
        chart.aboveTone = "danger";
        chart.belowTone = "success";
        return chart;
      },
      { events: [] },
    ),
    sparse: story(
      "Sparse nulls",
      () => {
        const chart = create("rowan-sparkline", "Users with gaps");
        chart.values = userMetrics.map((row) => row.users);
        chart.labels = userMetrics.map((row) => row.date);
        return chart;
      },
      { events: [] },
    ),
    largeNumbers: story(
      "Large numbers",
      () => {
        const chart = create("rowan-sparkline", "Page views");
        chart.values = [1200000, 1450000, 1320000, 1780000, 2100000, 1980000, 2400000, 2600000];
        chart.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
        chart.target = 1800000;
        return chart;
      },
      { events: [] },
    ),
    tones: story(
      "Tones",
      () => {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gap = "0.75rem";
        for (const tone of ["neutral", "info", "success", "warning", "danger"]) {
          const chart = create("rowan-sparkline", tone);
          chart.tone = tone;
          chart.variant = tone === "neutral" ? "line" : "area";
          chart.values = sparklineValues.revenue;
          chart.labels = MONTHS;
          row.append(chart);
        }
        return row;
      },
      { events: [] },
    ),
    empty: story(
      "Empty",
      () => {
        const chart = create("rowan-sparkline", "No data");
        chart.values = [];
        chart.labels = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
    error: story(
      "Error",
      () => {
        const chart = create("rowan-sparkline", "Unable to load chart data");
        chart.values = [];
        chart.messages = ERROR_MESSAGES;
        return chart;
      },
      { events: [] },
    ),
  },

  "rowan-stacked-area-chart": {
    catalog: story("Regional revenue", () => {
      const chart = create("rowan-stacked-area-chart", "Regional revenue", "Four regions");
      chart.stackMode = "absolute";
      return applyCartesian(chart, {
        labels: QUARTERS,
        series: regionSeries(),
        stackMode: "absolute",
        referenceLines: [{ value: 90000, label: "Threshold", tone: "warning" }],
      });
    }, { parts: ["control", "label", "description", "chart", "plot", "area", "line", "legend", "detail", "hover", "reference-line", "summary", "table"] }),
    normalized: story("Normalized", () => {
      const chart = create("rowan-stacked-area-chart", "Regional mix", "Each quarter is 100%");
      chart.stackMode = "normalized";
      return applyCartesian(chart, {
        labels: QUARTERS,
        series: regionSeries(),
        stackMode: "normalized",
        referenceLines: [{ value: 50, label: "Half", tone: "neutral" }],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-stacked-area-chart", "Users with gaps", "Null is no-data");
      return applyCartesian(chart, {
        labels: userMetrics.map((row) => row.date),
        series: [
          { id: "users", label: "Users", values: userMetrics.map((row) => row.users) },
          { id: "active", label: "Active", values: userMetrics.map((row) => row.activeUsers) },
        ],
        stackMode: "absolute",
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-stacked-area-chart", "Signed contributions", "Includes a loss series");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [
          { id: "gain", label: "Gain", values: profitLossData.map((row) => Math.max(row.profit, 0)) },
          { id: "loss", label: "Loss", values: profitLossData.map((row) => Math.min(row.profit, 0)) },
        ],
        stackMode: "absolute",
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-stacked-area-chart", "Traffic", "Compact formatting");
      return applyCartesian(chart, {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { id: "web", label: "Web", values: [12000000, 14000000, 16000000, 18000000] },
          { id: "api", label: "API", values: [8000000, 9000000, 11000000, 13000000] },
        ],
        stackMode: "absolute",
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-stacked-area-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-stacked-area-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-stacked-area-chart", "Slotted label", "Slotted description"), {
          labels: QUARTERS,
          series: regionSeries(),
          stackMode: "absolute",
        }),
      ),
    ),
  },

  "rowan-stacked-bar-chart": {
    catalog: story("Regional revenue", () => {
      const chart = create("rowan-stacked-bar-chart", "Regional revenue", "Stacked columns");
      chart.orientation = "vertical";
      chart.stackMode = "absolute";
      return applyCartesian(chart, {
        labels: QUARTERS,
        series: regionSeries(),
        orientation: "vertical",
        stackMode: "absolute",
        referenceLines: [{ value: 90000, label: "Threshold", tone: "danger" }],
      });
    }, { parts: ["control", "label", "description", "chart", "plot", "bar", "legend", "detail", "hover", "reference-line", "summary", "table"] }),
    horizontal: story("Horizontal normalized", () => {
      const chart = create("rowan-stacked-bar-chart", "Regional mix", "Horizontal and normalized");
      return applyCartesian(chart, {
        labels: QUARTERS,
        series: regionSeries(),
        orientation: "horizontal",
        stackMode: "normalized",
        referenceLines: [{ value: 40, label: "Share", tone: "warning" }],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-stacked-bar-chart", "Users with gaps", "Null segments");
      return applyCartesian(chart, {
        labels: userMetrics.map((row) => row.date),
        series: [
          { id: "users", label: "Users", values: userMetrics.map((row) => row.users) },
          { id: "active", label: "Active", values: userMetrics.map((row) => row.activeUsers) },
        ],
        orientation: "vertical",
        stackMode: "absolute",
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-stacked-bar-chart", "Signed contributions", "Loss series");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [
          { id: "gain", label: "Gain", values: profitLossData.map((row) => Math.max(row.profit, 0)) },
          { id: "loss", label: "Loss", values: profitLossData.map((row) => Math.min(row.profit, 0)) },
        ],
        orientation: "vertical",
        stackMode: "absolute",
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-stacked-bar-chart", "Traffic", "Compact formatting");
      return applyCartesian(chart, {
        labels: ["Q1", "Q2"],
        series: [
          { id: "web", label: "Web", values: [12000000, 18000000] },
          { id: "api", label: "API", values: [8000000, 13000000] },
        ],
        orientation: "horizontal",
        stackMode: "absolute",
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-stacked-bar-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-stacked-bar-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-stacked-bar-chart", "Slotted label", "Slotted description"), {
          labels: QUARTERS,
          series: regionSeries(),
          orientation: "vertical",
          stackMode: "absolute",
        }),
      ),
    ),
  },

  "rowan-trend-chart": {
    catalog: story("Revenue trend", () => {
      const chart = create("rowan-trend-chart", "Revenue, costs, and profit", "24 months");
      return applyCartesian(chart, {
        labels: revenueAndCosts.map((row) => row.month),
        series: revenueSeries(),
      });
    }, { parts: ["control", "label", "description", "chart", "plot", "legend", "legend-item", "legend-swatch", "point", "detail", "summary", "table"] }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-trend-chart", "Users with gaps", "Broken line");
      return applyCartesian(chart, {
        labels: userMetrics.map((row) => row.date),
        series: [
          { id: "users", label: "Users", values: userMetrics.map((row) => row.users) },
          { id: "active", label: "Active", values: userMetrics.map((row) => row.activeUsers) },
          { id: "sessions", label: "Sessions", values: userMetrics.map((row) => row.sessions) },
        ],
      });
    }),
    negative: story("Negative values", () => {
      const chart = create("rowan-trend-chart", "Profit and loss", "Signed trend");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [{ id: "profit", label: "Profit", values: profitLossData.map((row) => row.profit) }],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-trend-chart", "Page views", "Compact formatting");
      return applyCartesian(chart, {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
          { id: "views", label: "Views", values: [1200000, 1450000, null, 1780000, 2100000, 2400000] },
          { id: "users", label: "Users", values: [800000, 900000, 870000, 1100000, 1300000, 1500000] },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-trend-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-trend-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-trend-chart", "Slotted label", "Slotted description"), {
          labels: MONTHS,
          series: [
            { id: "revenue", label: "Revenue", values: monthlyRevenue.map((row) => row.revenue) },
            { id: "target", label: "Target", values: monthlyRevenue.map((row) => row.target) },
          ],
        }),
      ),
    ),
  },

  "rowan-waterfall-chart": {
    catalog: story("Profit breakdown", () => {
      const chart = create("rowan-waterfall-chart", "Profit breakdown", "Totals are authored");
      const labels = profitBreakdown.map((row) => row.category);
      const series = [
        {
          id: "profit",
          label: "Profit",
          values: profitBreakdown.map((row) =>
            row.type === "total" || row.type === "subtotal" ? { value: row.value, type: "total" } : row.value,
          ),
        },
      ];
      return applyCartesian(chart, { labels, series });
    }, { parts: ["control", "plot", "bar", "hover", "table"] }),
    negative: story("Negative deltas", () => {
      const chart = create("rowan-waterfall-chart", "Monthly movement", "Decreases are negative");
      return applyCartesian(chart, {
        labels: profitLossData.map((row) => row.period),
        series: [{ id: "profit", label: "Profit", values: profitLossData.map((row) => row.profit) }],
      });
    }),
    sparse: story("Sparse nulls", () => {
      const chart = create("rowan-waterfall-chart", "Missing step", "Null step is no-data");
      return applyCartesian(chart, {
        labels: ["Start", "Adjust", "End"],
        series: [
          {
            id: "cash",
            label: "Cash",
            values: [{ value: 40000, type: "total" }, null, { value: 51000, type: "total" }],
          },
        ],
      });
    }),
    largeNumbers: story("Large numbers", () => {
      const chart = create("rowan-waterfall-chart", "Annual profit", "Compact formatting");
      return applyCartesian(chart, {
        labels: profitBreakdown.map((row) => row.category),
        series: [
          {
            id: "profit",
            label: "Profit",
            values: profitBreakdown.map((row) =>
              row.type === "total" || row.type === "subtotal"
                ? { value: row.value, type: "total" }
                : row.value,
            ),
          },
        ],
      });
    }),
    empty: story("Empty", () => emptyCartesian("rowan-waterfall-chart", "No metric data")),
    error: story("Error", () => emptyCartesian("rowan-waterfall-chart", "Unable to load chart data")),
    slots: story("Slots", () =>
      slotLabelAndDescription(
        applyCartesian(create("rowan-waterfall-chart", "Slotted label", "Slotted description"), {
          labels: ["Start", "End"],
          series: [
            {
              id: "cash",
              label: "Cash",
              values: [
                { value: 40, type: "total" },
                { value: 51, type: "total" },
              ],
            },
          ],
        }),
      ),
    ),
  },
};
