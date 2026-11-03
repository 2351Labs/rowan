import { createDashboard } from "../../src/dashboard/dashboard.js";
import "../../src/bar-chart/bar-chart.js";
import "../../src/donut-chart/donut-chart.js";
import "../../src/filter-builder/filter-builder.js";
import "../../src/table/table.js";

const ROWS = [
  { id: "sep7-wholesale", week: "Sep 7", channel: "Wholesale", orders: 46 },
  { id: "sep7-web", week: "Sep 7", channel: "Web", orders: 28 },
  { id: "sep7-showroom", week: "Sep 7", channel: "Showroom", orders: 8 },
  { id: "sep14-wholesale", week: "Sep 14", channel: "Wholesale", orders: 42 },
  { id: "sep14-web", week: "Sep 14", channel: "Web", orders: 31 },
  { id: "sep14-showroom", week: "Sep 14", channel: "Showroom", orders: 9 },
];

const FIELDS = [
  { id: "week", label: "Week", type: "select", options: ["Sep 7", "Sep 14"] },
  { id: "channel", label: "Channel", type: "select", options: ["Wholesale", "Web", "Showroom"] },
];

export const DASHBOARD_KIT_EXAMPLE = `<div id="board">
  <rowan-filter-builder id="filters"></rowan-filter-builder>
  <rowan-bar-chart id="weeks" data-dashboard-field="week" interactive></rowan-bar-chart>
  <rowan-donut-chart id="channels" data-dashboard-field="channel" interactive></rowan-donut-chart>
  <rowan-table id="orders"></rowan-table>
</div>
<script type="module">
  import "@rowan-ui/core/bar-chart";
  import "@rowan-ui/core/donut-chart";
  import "@rowan-ui/core/filter-builder";
  import "@rowan-ui/core/table";
  import { createDashboard } from "@rowan-ui/core/dashboard";

  const rows = [
    { id: "1", week: "Sep 7", channel: "Wholesale", orders: 46 },
    { id: "2", week: "Sep 7", channel: "Web", orders: 28 },
    { id: "3", week: "Sep 14", channel: "Wholesale", orders: 42 },
    { id: "4", week: "Sep 14", channel: "Web", orders: 31 },
  ];
  const board = document.querySelector("#board");
  const filters = board.querySelector("#filters");
  filters.fields = [
    { id: "week", label: "Week", type: "select", options: ["Sep 7", "Sep 14"] },
    { id: "channel", label: "Channel", type: "select", options: ["Wholesale", "Web"] },
  ];
  const weeks = board.querySelector("#weeks");
  weeks.label = "Orders by week";
  weeks.labels = ["Sep 7", "Sep 14"];
  weeks.series = [{ id: "orders", label: "Orders", values: [74, 73] }];
  const orders = board.querySelector("#orders");
  orders.config = {
    columns: [
      { id: "week", header: "Week" },
      { id: "channel", header: "Channel" },
      { id: "orders", header: "Orders", type: "number" },
    ],
    rows,
  };
  const dashboard = createDashboard({ root: board, url: true });
  board.addEventListener("rowan-dashboard-change", (event) => {
    console.log(event.detail.source, dashboard.search());
  });
</script>`;

/**
 * Live Harbor board for the docs page. The query string is shown, not written,
 * so the docs hash router stays put.
 */
export function createDashboardKitDemo() {
  const root = document.createElement("section");
  root.className = "workflow-recipe dashboard-kit";

  const filters = document.createElement("rowan-filter-builder");
  filters.fields = FIELDS;
  filters.label = "Filters";

  const weeks = document.createElement("rowan-bar-chart");
  weeks.label = "Orders by week";
  weeks.interactive = true;
  weeks.labels = ["Sep 7", "Sep 14"];
  weeks.series = [{ id: "orders", label: "Orders", values: [82, 82] }];
  weeks.setAttribute("data-dashboard-field", "week");

  const channels = document.createElement("rowan-donut-chart");
  channels.label = "Orders by channel";
  channels.interactive = true;
  channels.labels = ["Wholesale", "Web", "Showroom"];
  channels.series = [{ id: "channels", label: "Channels", values: [88, 59, 17] }];
  channels.setAttribute("data-dashboard-field", "channel");

  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Harbor orders",
    columns: [
      { id: "week", header: "Week" },
      { id: "channel", header: "Channel" },
      { id: "orders", header: "Orders", type: "number", align: "end" },
    ],
    rows: ROWS,
  };

  const query = document.createElement("output");
  query.className = "workflow-recipe-session";
  query.textContent = "Query (not written on this page):";

  root.append(filters, weeks, channels, table, query);
  const dashboard = createDashboard({ root, fields: FIELDS, url: false });
  const paint = () => {
    query.textContent = `Query (not written on this page): ${dashboard.search() || "(none)"}`;
  };
  root.addEventListener("rowan-dashboard-change", paint);
  paint();
  return root;
}
