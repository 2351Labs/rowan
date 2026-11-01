import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";
import "@rowan-ui/core/app-layout";
import "@rowan-ui/core/avatar";
import "@rowan-ui/core/button";
import "@rowan-ui/core/card";
import "@rowan-ui/core/donut-chart";
import "@rowan-ui/core/empty-state";
import "@rowan-ui/core/gauge-chart";
import "@rowan-ui/core/icon-button";
import "@rowan-ui/core/kpi-card";
import "@rowan-ui/core/select";
import "@rowan-ui/core/side-nav";
import "@rowan-ui/core/side-nav-item";
import "@rowan-ui/core/side-nav-section";
import "@rowan-ui/core/sparkline";
import "@rowan-ui/core/stacked-bar-chart";
import "@rowan-ui/core/table";
import "@rowan-ui/core/table-toolbar";
import "@rowan-ui/core/text-field";
import "@rowan-ui/core/tooltip";
import "@rowan-ui/core/trend-chart";
import "@rowan-ui/icons/elements/layout-dashboard";
import "@rowan-ui/icons/elements/moon";
import "@rowan-ui/icons/elements/settings";
import "@rowan-ui/icons/elements/shopping-bag";
import "@rowan-ui/icons/elements/sun";
import "@rowan-ui/icons/elements/users";

import {
  BRAND,
  COLUMNS,
  DONUT,
  FULFILLMENT,
  FULFILLMENT_STATS,
  KPIS,
  NAV,
  OPEN_ORDER_COUNT,
  OPERATOR,
  ORDERS,
  PAGES,
  PERIOD,
  STACKED,
  STATUSES,
  TREND,
  WEEK_LABELS,
  chartMoney,
  donutMoney,
  filterOrders,
  firstPage,
  orderCountLabel,
  whenUpgraded,
} from "./sample.js";
import { getTheme, markReady, themeToggleIcon, themeToggleLabel, toggleTheme } from "./theme.js";
import "./styles.css";

const app = document.querySelector("#app");
const layout = el("rowan-app-layout", { navigationLabel: "Primary" });
const header = el("div", { className: "app-header", slot: "header" });
const navigation = el("div", { className: "app-nav", slot: "navigation" });
const main = el("div", { id: "main", tabIndex: "-1" });

const period = el("div", { className: "period-copy" });
period.append(el("strong", { text: PERIOD.title }), el("span", { text: PERIOD.caption }));

const themeTooltip = el("rowan-tooltip");
const themeButton = el("rowan-icon-button", { variant: "ghost" });
themeTooltip.append(themeButton);

const user = el("div", { className: "user" });
const avatar = el("rowan-avatar", { name: OPERATOR.name, size: "sm" });
const userMeta = el("span", { className: "user-meta" });
userMeta.append(el("strong", { text: OPERATOR.name }), el("small", { text: OPERATOR.role }));
user.append(avatar, userMeta);

const actions = el("div", { className: "header-actions" });
actions.append(themeTooltip, user);
header.append(period, actions);

const brand = el("div", { className: "brand" });
brand.append(
  el("span", { className: "brand-mark", text: BRAND.mark, ariaHidden: "true" }),
  el(
    "span",
    { className: "brand-copy" },
    el("span", { className: "brand-name", text: BRAND.name }),
    el("span", { className: "brand-product", text: BRAND.product }),
  ),
);

const sideNav = el("rowan-side-nav", { label: "Pages", value: "overview" });
for (const section of NAV) {
  const group = el("rowan-side-nav-section", { label: section.label });
  for (const item of section.items) {
    const navItem = el("rowan-side-nav-item", { value: item.value, label: item.label });
    navItem.append(icon(item.icon, "prefix"), item.label);
    if (item.count) {
      navItem.count = OPEN_ORDER_COUNT;
      navItem.countLabel = "open";
    }
    group.append(navItem);
  }
  sideNav.append(group);
}

navigation.append(
  brand,
  sideNav,
  el("p", { className: "nav-note", text: "Sample wholesale data." }),
);

const title = el("h1", { text: PAGES.overview.title });
const lede = el("p", { className: "lede", text: PAGES.overview.lede });
const pageHeader = el("header", { className: "page-header" });
pageHeader.append(title, lede);

const kpis = el("section", { className: "kpi-grid", ariaLabel: "Key figures" });
const sparks = new Map();
for (const metric of KPIS) {
  const card = el("rowan-kpi-card", {
    label: metric.label,
    tone: metric.tone,
    deltaLabel: "vs prior 8 weeks",
  });
  const spark = el("rowan-sparkline", {
    slot: "chart",
    label: metric.sparkLabel,
    tone: metric.tone,
  });
  card.append(spark);
  sparks.set(metric.id, { card, spark, metric });
  kpis.append(card);
}

const trend = el("rowan-trend-chart", {
  className: "chart-trend",
  label: TREND.label,
  description: TREND.description,
  interactive: true,
  locale: "en-US",
});
const bars = el("rowan-stacked-bar-chart", {
  className: "chart-bars",
  label: STACKED.label,
  description: STACKED.description,
  interactive: true,
  locale: "en-US",
});
const donut = el("rowan-donut-chart", {
  className: "chart-donut",
  label: DONUT.label,
  description: DONUT.description,
  locale: "en-US",
});
const side = el("rowan-card", { className: "chart-side" });
const sideTitle = el("span", { slot: "title", text: FULFILLMENT.title });
const sideKicker = el("p", { className: "side-kicker", text: FULFILLMENT.kicker });
const gauge = el("rowan-gauge-chart", { label: FULFILLMENT.label, locale: "en-US" });
const sideStats = el("dl", { className: "side-stats" });
for (const stat of FULFILLMENT_STATS) {
  const row = el("div");
  row.append(el("dt", { text: stat.label }), el("dd", { text: stat.value }));
  sideStats.append(row);
}
side.append(sideTitle, sideKicker, gauge, sideStats);
const charts = el("section", { className: "chart-grid", ariaLabel: "Charts" });
charts.append(trend, bars, donut, side);

const orders = el("section", { className: "orders", id: "orders-section" });
const ordersHeading = el("div", { className: "section-heading" });
ordersHeading.append(
  el("h2", { text: "Recent orders" }),
  el("p", { text: "Latest bookings in the sample window." }),
);
const table = el("rowan-table", {
  id: "orders",
  caption: "Recent orders",
  captionVisuallyHidden: true,
  stickyHeader: true,
  locale: "en-US",
});
const toolbar = el("rowan-table-toolbar", {
  slot: "toolbar",
  forTable: "orders",
  columnPicker: true,
  label: "Recent orders",
});
const search = el("rowan-text-field", {
  slot: "start",
  className: "toolbar-search",
  type: "search",
  label: "Search orders",
  placeholder: "Search orders or accounts",
  name: "order-search",
});
const status = el("rowan-select", {
  slot: "start",
  className: "toolbar-status",
  label: "Status",
  name: "order-status",
  value: "all",
});
for (const option of [
  { value: "all", label: "All statuses" },
  ...STATUSES.map((value) => ({ value, label: value })),
]) {
  const node = document.createElement("option");
  node.value = option.value;
  node.textContent = option.label;
  status.append(node);
}
const count = el("span", { slot: "end", className: "toolbar-count" });
count.setAttribute("aria-live", "polite");
const empty = el("div", { slot: "empty" });
const emptyState = el("rowan-empty-state");
const clear = el("rowan-button", {
  slot: "actions",
  variant: "secondary",
  size: "sm",
  type: "button",
  text: "Clear filters",
});
emptyState.append(
  el("span", { slot: "title", text: "No matching orders" }),
  el("p", { text: "Try a different search or status." }),
  clear,
);
empty.append(emptyState);
toolbar.append(search, status, count);
table.append(toolbar, empty);
orders.append(ordersHeading, table);

main.append(pageHeader, kpis, charts, orders);
layout.append(header, navigation, main);
app.append(layout);

paintTheme(getTheme());
themeButton.addEventListener("rowan-click", () => paintTheme(toggleTheme()));
sideNav.addEventListener("rowan-change", (event) => {
  const value = event.detail?.value || "overview";
  const page = PAGES[value] ?? PAGES.overview;
  title.textContent = page.title;
  lede.textContent = page.lede;
  if (value === "orders" || value === "accounts") {
    orders.scrollIntoView({ block: "start" });
  } else if (value === "settings") {
    themeButton.focus();
  } else {
    main.scrollIntoView({ block: "start" });
  }
  if (value === "accounts") search.focus();
});
search.addEventListener("input", paintOrders);
status.addEventListener("rowan-change", paintOrders);
clear.addEventListener("rowan-click", () => {
  search.value = "";
  status.value = "all";
  paintOrders();
  search.focus();
});

void start();

async function start() {
  await bindDashboard();
  paintOrders();
  markReady(document);
}

async function bindDashboard() {
  await Promise.all(
    [
      trend,
      bars,
      donut,
      gauge,
      table,
      ...[...sparks.values()].flatMap(({ card, spark }) => [card, spark]),
    ].map((node) => whenUpgraded(node)),
  );

  for (const { card, spark, metric } of sparks.values()) {
    card.messages = metric.messages;
    card.value = metric.value;
    card.delta = metric.delta;
    spark.labels = WEEK_LABELS;
    spark.values = metric.values;
  }

  trend.labels = TREND.labels;
  trend.series = TREND.series;
  trend.valueFormatter = chartMoney;
  bars.labels = STACKED.labels;
  bars.series = STACKED.series;
  donut.labels = DONUT.labels;
  donut.series = DONUT.series;
  donut.valueFormatter = donutMoney;
  gauge.min = FULFILLMENT.min;
  gauge.max = FULFILLMENT.max;
  gauge.value = FULFILLMENT.value;
  gauge.target = FULFILLMENT.target;
  gauge.ranges = FULFILLMENT.ranges;
  table.columns = COLUMNS;
  table.rows = ORDERS;
  table.page = firstPage();
  // The toolbar reads columns while it first renders. Toggle the picker once they exist.
  toolbar.columnPicker = false;
  toolbar.columnPicker = true;
}

function paintOrders() {
  const rows = filterOrders(search.value, status.value || "all");
  table.rows = rows;
  table.page = firstPage();
  count.textContent = orderCountLabel(rows.length);
}

function paintTheme(theme) {
  const label = themeToggleLabel(theme);
  themeButton.icon = themeToggleIcon(theme);
  themeButton.label = label;
  themeTooltip.text = label;
}

function icon(name, slot) {
  const node = el("rowan-icon", { name, size: "1.125rem" });
  if (slot) node.slot = slot;
  return node;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "className") node.className = String(value);
    else if (key === "text") node.textContent = String(value);
    else if (key === "slot") node.slot = String(value);
    else if (key === "tabIndex") node.tabIndex = value;
    else if (key === "ariaLabel") node.setAttribute("aria-label", String(value));
    else if (key === "ariaHidden") node.setAttribute("aria-hidden", String(value));
    else if (typeof value === "boolean") {
      if (value)
        node.setAttribute(
          key.replaceAll(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
          "",
        );
    } else if (key === "htmlFor") node.htmlFor = String(value);
    else node[key] = value;
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
