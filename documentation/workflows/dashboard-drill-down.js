import { applyFilters } from "../../src/filter-builder/apply-filters.js";
import { createDashboardFilters } from "../../src/dashboard-filters/dashboard-filters.js";
import "../../src/bar-chart/bar-chart.js";
import "../../src/button/button.js";
import "../../src/kpi-card/kpi-card.js";
import "../../src/source-meta/source-meta.js";
import "../../src/table/table.js";

const DAYS = ["Mon", "Tue", "Wed", "Thu"];

const SHIPMENT_SAMPLES = [
  { id: "mon-north", day: "Mon", yard: "North", fill: 82, shipments: 1240 },
  { id: "mon-south", day: "Mon", yard: "South", fill: 74, shipments: 980 },
  { id: "tue-north", day: "Tue", yard: "North", fill: 88, shipments: 1360 },
  { id: "tue-south", day: "Tue", yard: "South", fill: 71, shipments: 890 },
  { id: "wed-north", day: "Wed", yard: "North", fill: 79, shipments: 1190 },
  { id: "wed-south", day: "Wed", yard: "South", fill: 76, shipments: 1020 },
  { id: "thu-north", day: "Thu", yard: "North", fill: 85, shipments: 1290 },
  { id: "thu-south", day: "Thu", yard: "South", fill: 80, shipments: 1110 },
];

const FILTER_FIELDS = [
  { id: "day", type: "select" },
  { id: "yard", type: "select" },
];

const TABLE_COLUMNS = [
  { id: "day", header: "Day" },
  { id: "yard", header: "Yard" },
  { id: "fill", header: "Fill rate", type: "number", align: "end", format: (value) => `${value}%` },
  {
    id: "shipments",
    header: "Shipments",
    type: "number",
    align: "end",
    format: (value) => Number(value).toLocaleString("en-US"),
  },
];

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function average(values) {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function numberLabel(value) {
  return Number(value).toLocaleString("en-US");
}

function filterList(snapshot, keys = ["day", "yard"]) {
  return keys.flatMap((key) => {
    const value = String(snapshot[key] ?? "").trim();
    return value ? [{ field: key, operator: "equals", value }] : [];
  });
}

function sourceMeta() {
  const meta = document.createElement("rowan-source-meta");
  meta.source = "Warehouse event stream";
  meta.asOf = "10:42 UTC";
  return meta;
}

function selectionLabel(snapshot, count) {
  const details = [];
  if (snapshot.day) details.push(snapshot.day);
  if (snapshot.yard) details.push(`${snapshot.yard} yard`);
  if (details.length === 0) return `Showing ${count} shipment samples.`;
  return `Showing ${count} shipment samples for ${details.join(" · ")}.`;
}

/**
 * Creates the documentation dashboard-drill-down composition.
 * The filter session, URL state, routing, and data transport remain application-owned.
 *
 * @param {{
 *   initialFilters?: { day?: string, yard?: string },
 *   onSessionChange?: (detail: { filters: { day?: string, yard?: string } }) => void,
 *   onRoute?: (detail: { type: "shipment", rowId: string }) => void,
 * }} [options]
 */
export function createDashboardDrillDown(options = {}) {
  const onSessionChange =
    typeof options.onSessionChange === "function" ? options.onSessionChange : null;
  const onRoute = typeof options.onRoute === "function" ? options.onRoute : null;
  const session = createDashboardFilters(options.initialFilters);

  const root = document.createElement("section");
  root.className = "workflow-recipe dashboard-drill-down";
  root.dataset.workflow = "dashboard-drill-down";

  const summary = document.createElement("p");
  summary.className = "workflow-recipe-summary";
  summary.setAttribute("aria-live", "polite");

  const kpis = document.createElement("div");
  kpis.className = "dashboard-drill-down-kpis";

  const shipmentCount = document.createElement("rowan-kpi-card");
  shipmentCount.label = "Visible shipments";
  shipmentCount.tone = "info";
  shipmentCount.delta = 6;
  shipmentCount.deltaLabel = "vs prior window";
  shipmentCount.append(sourceMeta());

  const averageFill = document.createElement("rowan-kpi-card");
  averageFill.label = "Average fill rate";
  averageFill.tone = "success";
  averageFill.delta = 2.4;
  averageFill.deltaLabel = "vs prior window";
  averageFill.append(sourceMeta());

  kpis.append(shipmentCount, averageFill);

  const chart = document.createElement("rowan-bar-chart");
  chart.label = "Fill rate by day";
  chart.interactive = true;
  const chartMeta = sourceMeta();
  chartMeta.slot = "description";
  chart.append(chartMeta);

  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Shipment samples",
    columns: TABLE_COLUMNS,
    rowId: "id",
    rows: [],
    selectable: "single",
  };
  const tableMeta = sourceMeta();
  tableMeta.slot = "caption";
  table.append(tableMeta);

  const tools = document.createElement("div");
  tools.className = "workflow-recipe-actions";

  const clear = document.createElement("rowan-button");
  clear.variant = "secondary";
  clear.size = "sm";
  clear.textContent = "Clear filters";

  const sessionState = document.createElement("output");
  sessionState.className = "workflow-recipe-session";
  sessionState.setAttribute("aria-live", "polite");
  tools.append(clear, sessionState);

  const render = (snapshot = session.snapshot()) => {
    const visibleRows = applyFilters(SHIPMENT_SAMPLES, filterList(snapshot), FILTER_FIELDS);
    const chartRows = applyFilters(SHIPMENT_SAMPLES, filterList(snapshot, ["yard"]), FILTER_FIELDS);
    const totalShipments = visibleRows.reduce((total, row) => total + row.shipments, 0);
    const fillRate = average(visibleRows.map((row) => row.fill));

    shipmentCount.value = numberLabel(totalShipments);
    averageFill.value = fillRate === null ? null : `${fillRate.toFixed(1)}%`;
    chart.labels = DAYS;
    chart.series = [
      {
        id: "fill-rate",
        label: "Fill rate",
        values: DAYS.map((day) => {
          const dayRows = chartRows.filter((row) => row.day === day);
          const dayAverage = average(dayRows.map((row) => row.fill));
          return dayAverage === null ? null : Number(dayAverage.toFixed(1));
        }),
      },
    ];
    table.rows = cloneRows(visibleRows);
    clear.disabled = Object.keys(snapshot).length === 0;
    sessionState.value = JSON.stringify(snapshot);
    sessionState.textContent = `Filter session: ${JSON.stringify(snapshot)}`;
    summary.textContent = selectionLabel(snapshot, visibleRows.length);
  };

  session.subscribe((snapshot) => {
    render(snapshot);
    onSessionChange?.({ filters: { ...snapshot } });
  });

  chart.addEventListener("rowan-point-activate", (event) => {
    const day = String(event.detail?.label ?? "").trim();
    if (DAYS.includes(day)) session.set("day", day);
  });

  table.addEventListener("rowan-select", (event) => {
    const row = Array.isArray(event.detail?.selectedRows) ? event.detail.selectedRows[0] : null;
    if (row?.yard) {
      session.set("yard", row.yard);
    } else {
      session.clear("yard");
    }
  });

  table.addEventListener("rowan-row-activate", (event) => {
    const rowId = typeof event.detail?.rowId === "string" ? event.detail.rowId : "";
    if (rowId) onRoute?.({ type: "shipment", rowId });
  });

  clear.addEventListener("rowan-click", () => {
    table.selected = [];
    session.clear();
  });

  root.append(summary, kpis, chart, table, tools);
  render();
  return root;
}
