import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/kpi-card";
import "@rowan-ui/core/trend-chart";
import "@rowan-ui/core/table";

import { LABELS, SERIES, TABLE_CONFIG } from "./sample.js";
import "./styles.css";

const page = document.createElement("main");
page.className = "page";

const header = document.createElement("header");
const title = document.createElement("h1");
title.textContent = "Week of 27 Oct";
const lede = document.createElement("p");
lede.className = "lede";
lede.textContent = "A small Rowan dashboard. The figures are local sample data.";
header.append(title, lede);

const kpis = document.createElement("section");
kpis.className = "kpis";
kpis.setAttribute("aria-label", "Key figures");
kpis.append(
  kpi("Open orders", 42, 4, "vs last week", "info"),
  kpi("On time", "96%", 2, "vs last week", "success"),
  kpi("Exceptions", 3, -1, "vs last week", "warning"),
);

const chartPanel = document.createElement("section");
chartPanel.className = "panel";
const chartHeading = document.createElement("h2");
chartHeading.textContent = "Orders";
const chart = document.createElement("rowan-trend-chart");
chart.label = "Orders this week";
chart.description = "Orders booked each day. Sample data, not a live feed.";
chart.labels = LABELS;
chart.series = SERIES;
chartPanel.append(chartHeading, chart);

const tablePanel = document.createElement("section");
tablePanel.className = "panel";
const tableHeading = document.createElement("h2");
tableHeading.textContent = "Recent orders";
const table = document.createElement("rowan-table");
table.caption = "Recent orders";
table.config = TABLE_CONFIG;
tablePanel.append(tableHeading, table);

page.append(header, kpis, chartPanel, tablePanel);
document.querySelector("#app").append(page);

function kpi(label, value, delta, deltaLabel, tone) {
  const card = document.createElement("rowan-kpi-card");
  card.label = label;
  card.value = value;
  card.delta = delta;
  card.deltaLabel = deltaLabel;
  card.tone = tone;
  return card;
}
