// Harbor sample data shared in shape across the Vite, React, and Vue starters.
import { formatCurrency, formatDate } from "@rowan-ui/core/format";

const sum = (values) => values.reduce((total, value) => total + value, 0);

export const WEEK_LABELS = [
  "Sep 7",
  "Sep 14",
  "Sep 21",
  "Sep 28",
  "Oct 5",
  "Oct 12",
  "Oct 19",
  "Oct 26",
];

const WHOLESALE_REVENUE = [42000, 38600, 45200, 41800, 47600, 44300, 50100, 46800];
const WEB_REVENUE = [18200, 19600, 17400, 22100, 20800, 23400, 21900, 24600];
const SHOWROOM_REVENUE = [6400, 7200, 5800, 8100, 7600, 6900, 8400, 9100];
const WHOLESALE_ORDERS = [46, 42, 51, 48, 54, 49, 57, 52];
const WEB_ORDERS = [28, 31, 26, 34, 30, 36, 33, 38];
const SHOWROOM_ORDERS = [8, 9, 7, 11, 10, 8, 12, 13];

export const WEEKLY_REVENUE = WEEK_LABELS.map(
  (_, index) => WHOLESALE_REVENUE[index] + WEB_REVENUE[index] + SHOWROOM_REVENUE[index],
);
export const WEEKLY_ORDERS = WEEK_LABELS.map(
  (_, index) => WHOLESALE_ORDERS[index] + WEB_ORDERS[index] + SHOWROOM_ORDERS[index],
);
export const WEEKLY_AOV = WEEKLY_REVENUE.map((revenue, index) =>
  Math.round(revenue / WEEKLY_ORDERS[index]),
);
export const ON_TIME = [93.2, 94.1, 94.8, 94.0, 95.6, 96.0, 95.5, 96.4];

const revenueTotal = sum(WEEKLY_REVENUE);
const orderTotal = sum(WEEKLY_ORDERS);
const averageOrder = Math.round(revenueTotal / orderTotal);

export const PERIOD = {
  title: "Sep 7 – Oct 26",
  caption: "Eight fiscal weeks",
};

export const BRAND = {
  mark: "H",
  name: "Harbor",
  product: "Commerce",
};

export const OPERATOR = {
  name: "Avery Quinn",
  role: "Ops lead",
};

export const PAGES = {
  overview: {
    title: "Overview",
    lede: "Wholesale, web, and showroom for Harbor Goods. Eight weeks ending 26 Oct, from local sample orders.",
  },
  orders: {
    title: "Orders",
    lede: "Recent orders in the same window. Search, filter by status, and sort any column.",
  },
  accounts: {
    title: "Accounts",
    lede: "Buying accounts on recent orders. Filter the table by account name.",
  },
  settings: {
    title: "Settings",
    lede: "Light and dark follow Rowan theme tokens. Switch them from the header.",
  },
};

export const NAV = [
  {
    label: "Operate",
    items: [
      { value: "overview", label: "Overview", icon: "layout-dashboard" },
      { value: "orders", label: "Orders", icon: "shopping-bag", count: true },
      { value: "accounts", label: "Accounts", icon: "users" },
    ],
  },
  {
    label: "Workspace",
    items: [{ value: "settings", label: "Settings", icon: "settings" }],
  },
];

export const PERCENT_DELTA = {
  deltaWithLabel: ({ value }) => `${value}% vs prior 8 weeks`,
};

export const POINTS_DELTA = {
  deltaWithLabel: ({ value }) => `${value} pts vs prior 8 weeks`,
};

export const KPIS = [
  {
    id: "revenue",
    label: "Revenue",
    value: money(revenueTotal),
    delta: 7.9,
    tone: "success",
    messages: PERCENT_DELTA,
    values: WEEKLY_REVENUE,
    sparkLabel: "Weekly revenue",
  },
  {
    id: "orders",
    label: "Orders",
    value: orderTotal,
    delta: 5.2,
    tone: "info",
    messages: PERCENT_DELTA,
    values: WEEKLY_ORDERS,
    sparkLabel: "Weekly orders",
  },
  {
    id: "average",
    label: "Average order",
    value: money(averageOrder),
    delta: -1.5,
    tone: "warning",
    messages: PERCENT_DELTA,
    values: WEEKLY_AOV,
    sparkLabel: "Weekly average order",
  },
  {
    id: "on-time",
    label: "On time",
    value: "96.4%",
    delta: 1.8,
    tone: "success",
    messages: POINTS_DELTA,
    values: ON_TIME,
    sparkLabel: "Weekly on-time rate",
  },
];

const CHANNEL_COLOR = {
  wholesale: "var(--rowan-color-accent)",
  web: "var(--rowan-color-danger)",
  showroom: "var(--rowan-color-warning)",
};

function channelSeries(id, label, values) {
  return { id, label, values, color: CHANNEL_COLOR[id] };
}

export const TREND = {
  label: "Revenue by channel",
  description: "Weekly revenue by channel.",
  labels: WEEK_LABELS,
  series: [
    channelSeries("wholesale", "Wholesale", WHOLESALE_REVENUE),
    channelSeries("web", "Web", WEB_REVENUE),
    channelSeries("showroom", "Showroom", SHOWROOM_REVENUE),
  ],
};

export const STACKED = {
  label: "Orders by channel",
  description: "Weekly orders, stacked by channel.",
  labels: WEEK_LABELS,
  series: [
    channelSeries("wholesale", "Wholesale", WHOLESALE_ORDERS),
    channelSeries("web", "Web", WEB_ORDERS),
    channelSeries("showroom", "Showroom", SHOWROOM_ORDERS),
  ],
};

export const FULFILLMENT = {
  title: "Fulfillment",
  kicker: "On-time rate for these eight weeks. Goal is 95%.",
  label: "On-time rate",
  value: 96.4,
  min: 80,
  max: 100,
  target: 95,
  ranges: [
    { from: 80, to: 90, label: "Below goal", tone: "neutral" },
    { from: 90, to: 95, label: "Near goal", tone: "warning" },
    { from: 95, to: 100, label: "On target", tone: "success" },
  ],
};

export const DONUT = {
  label: "Category mix",
  description: "Revenue by category.",
  labels: ["Lighting", "Textiles", "Tabletop", "Outdoor", "Storage"],
  series: [
    {
      id: "categories",
      label: "Revenue",
      values: [168400, 142600, 121800, 86400, 64700],
    },
  ],
};

export const STATUS_TONE = {
  Shipped: "success",
  Packing: "info",
  Hold: "warning",
  Review: "danger",
};

export const STATUSES = Object.keys(STATUS_TONE);

export const ORDERS = [
  {
    id: "4821",
    order: "4821",
    account: "Northwind Traders",
    channel: "Wholesale",
    status: "Packing",
    placed: "2026-10-30",
    total: 4280,
  },
  {
    id: "4820",
    order: "4820",
    account: "Contoso Market",
    channel: "Web",
    status: "Shipped",
    placed: "2026-10-30",
    total: 860,
  },
  {
    id: "4819",
    order: "4819",
    account: "Fabrikam Studio",
    channel: "Showroom",
    status: "Hold",
    placed: "2026-10-29",
    total: 1640,
  },
  {
    id: "4818",
    order: "4818",
    account: "Adventure Works",
    channel: "Wholesale",
    status: "Shipped",
    placed: "2026-10-29",
    total: 6120,
  },
  {
    id: "4817",
    order: "4817",
    account: "Wide World Importers",
    channel: "Wholesale",
    status: "Packing",
    placed: "2026-10-28",
    total: 3475,
  },
  {
    id: "4816",
    order: "4816",
    account: "Lucerne Publishing",
    channel: "Web",
    status: "Review",
    placed: "2026-10-28",
    total: 940,
  },
  {
    id: "4815",
    order: "4815",
    account: "Tailspin Toys",
    channel: "Web",
    status: "Shipped",
    placed: "2026-10-27",
    total: 510,
  },
  {
    id: "4814",
    order: "4814",
    account: "Graphic Design Institute",
    channel: "Showroom",
    status: "Hold",
    placed: "2026-10-27",
    total: 2380,
  },
  {
    id: "4813",
    order: "4813",
    account: "Fourth Coffee",
    channel: "Wholesale",
    status: "Shipped",
    placed: "2026-10-26",
    total: 3750,
  },
  {
    id: "4812",
    order: "4812",
    account: "Alpine Ski House",
    channel: "Wholesale",
    status: "Packing",
    placed: "2026-10-26",
    total: 2890,
  },
  {
    id: "4811",
    order: "4811",
    account: "Relecloud",
    channel: "Web",
    status: "Shipped",
    placed: "2026-10-24",
    total: 720,
  },
  {
    id: "4810",
    order: "4810",
    account: "School of Fine Art",
    channel: "Showroom",
    status: "Review",
    placed: "2026-10-24",
    total: 1560,
  },
];

export const OPEN_ORDER_COUNT = ORDERS.filter((row) => row.status !== "Shipped").length;

export const FULFILLMENT_STATS = [
  { label: "Shipped", value: String(ORDERS.filter((row) => row.status === "Shipped").length) },
  { label: "Packing", value: String(ORDERS.filter((row) => row.status === "Packing").length) },
  {
    label: "Needs a look",
    value: String(ORDERS.filter((row) => row.status === "Hold" || row.status === "Review").length),
  },
];

export const COLUMNS = [
  { id: "order", header: "Order", sortable: true, format: (value) => `#${value}` },
  { id: "account", header: "Account", sortable: true },
  { id: "channel", header: "Channel", sortable: true },
  {
    id: "status",
    header: "Status",
    type: "badge",
    sortable: true,
    tone: (value) => STATUS_TONE[value] ?? "info",
  },
  {
    id: "placed",
    header: "Placed",
    sortable: true,
    format: (value) => shortDate(value),
  },
  {
    id: "total",
    header: "Total",
    align: "end",
    sortable: true,
    format: (value) => money(value),
  },
];

export const PAGE_SIZE = 8;

export function firstPage() {
  return { index: 0, size: PAGE_SIZE };
}

export function filterOrders(query, status) {
  const needle = String(query ?? "")
    .trim()
    .toLowerCase();
  return ORDERS.filter((row) => {
    if (status && status !== "all" && row.status !== status) return false;
    if (!needle) return true;
    return [row.order, row.account, row.channel, row.status].some((value) =>
      String(value).toLowerCase().includes(needle),
    );
  });
}

export function orderCountLabel(count) {
  return count === 1 ? "1 order" : `${count} orders`;
}

export function money(value) {
  return formatCurrency(value, {
    locale: "en-US",
    currency: "USD",
    fallback: "—",
    options: { maximumFractionDigits: 0, minimumFractionDigits: 0 },
  });
}

export function compactMoney(value) {
  return formatCurrency(value, {
    locale: "en-US",
    currency: "USD",
    fallback: "—",
    options: { notation: "compact", maximumFractionDigits: 1 },
  });
}

export function chartMoney(value, context) {
  return context?.tick ? compactMoney(value) : money(value);
}

export function donutMoney(value) {
  return compactMoney(value);
}

export function shortDate(value) {
  return formatDate(value, {
    locale: "en-US",
    fallback: "—",
    options: { month: "short", day: "numeric" },
  });
}

export async function whenUpgraded(element) {
  if (element) await customElements.whenDefined(element.localName);
  return element;
}
