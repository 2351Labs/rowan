import { createDashboardFilters } from "@rowan-ui/core/dashboard-filters";

import { chartMoney, integer, money, monthDay, percent, shortDate } from "../format.js";
import { button, h, icon } from "../dom.js";
import { ORDER_STATUSES, labelFor, toneFor } from "../labels.js";
import { WINDOW_END, WINDOW_START, summarize } from "../metrics.js";

export async function renderOverview(outlet, ctx) {
  const { store, navigate, signal } = ctx;
  const page = h("div", { class: "page", "data-page": "overview" });
  const header = h("header", { class: "page-header" });
  const intro = h("div");
  const title = h("h1", { tabindex: "-1", text: "Overview" });
  const lede = h("p", {
    class: "lede",
    text: "Wholesale, web, and showroom revenue for Lumen Goods. Figures come from the same sample orders as the tables.",
  });
  intro.append(title, lede);

  const range = h("rowan-date-range-picker", {
    label: "Date range",
    start: WINDOW_START,
    end: WINDOW_END,
    name: "overview-range",
  });
  const failSwitch = h("rowan-switch", { label: "Fail next refresh" });
  const refresh = button("Refresh", { variant: "secondary", type: "button" });
  refresh.prepend(icon("refresh-cw", "prefix"));
  const actions = h("div", { class: "page-actions" });
  actions.append(range, failSwitch, refresh);
  header.append(intro, actions);

  const state = h("rowan-data-state", { state: "loading" });
  const loading = h("div", { slot: "loading", class: "skeleton-grid" });
  loading.append(skeletonRow(), skeletonBlock("16rem"));
  const empty = h("div", { slot: "empty" });
  const emptyState = h("rowan-empty-state");
  emptyState.append(
    icon("circle-alert", "icon"),
    h("span", { slot: "title", text: "Nothing in this range" }),
    h("p", { text: "No open orders fall inside the selected dates." }),
  );
  empty.append(emptyState);
  const errorSlot = h("div", { slot: "error" });
  const errorState = h("rowan-empty-state");
  errorState.append(
    icon("circle-alert", "icon"),
    h("span", { slot: "title", text: "Overview unavailable" }),
    h("p", { text: "The sample summary did not load." }),
  );
  errorSlot.append(errorState);
  const retry = button("Try again", { slot: "actions", variant: "primary", type: "button" });
  state.append(loading, empty, errorSlot, retry);

  const body = h("div", { class: "stack" });
  const kpis = h("div", { class: "kpi-grid" });
  const charts = h("div", { class: "chart-grid" });
  const lower = h("div", { class: "chart-grid split" });
  const activityCard = h("rowan-card");
  activityCard.append(h("span", { slot: "title", text: "Recent orders" }));
  const activity = h("div", { class: "activity" });
  const activityLink = h("rowan-link", { slot: "actions", href: "#/orders" }, "View all orders");
  activityCard.append(activity, activityLink);
  body.append(kpis, charts, lower, activityCard);
  state.append(body);
  page.append(header, state);
  outlet.append(page);

  const filters = createDashboardFilters({ start: range.start, end: range.end });
  const trend = h("rowan-trend-chart", {
    label: "Revenue by channel",
    description: "Weekly revenue, excluding cancelled orders.",
    interactive: true,
    zoom: true,
    locale: "en-US",
  });
  const donut = h("rowan-donut-chart", {
    label: "Category mix",
    description: "Line revenue in the selected range.",
    interactive: true,
    locale: "en-US",
  });
  const area = h("rowan-area-chart", {
    label: "Units ordered",
    description: "Weekly units on open orders.",
    interactive: true,
    locale: "en-US",
  });
  const bars = h("rowan-bar-chart", {
    label: "Orders by status",
    description: "Open orders in the selected range.",
    interactive: true,
    orientation: "horizontal",
    locale: "en-US",
  });
  trend.valueFormatter = chartMoney;
  donut.valueFormatter = chartMoney;
  charts.append(trend, donut);
  lower.append(area, bars);

  let failNext = false;

  function paint() {
    const summary = summarize(store.orders, filters.snapshot());
    if (summary.empty) {
      state.state = "empty";
      return;
    }

    kpis.replaceChildren(
      kpi(
        "Revenue",
        money(summary.revenue),
        summary.deltas.revenue,
        "success",
        summary.weeks.map((week) => week.revenue),
        "Weekly revenue",
      ),
      kpi(
        "Orders",
        integer(summary.count),
        summary.deltas.count,
        "info",
        summary.weeks.map((week) => week.orders),
        "Weekly orders",
      ),
      kpi(
        "Average order",
        money(summary.aov),
        summary.deltas.aov,
        "neutral",
        summary.weeks.map((week) => (week.orders ? week.revenue / week.orders : 0)),
        "Weekly average",
      ),
      kpi(
        "Fulfilled",
        percent(summary.rate),
        summary.deltas.rate,
        summary.rate >= 0.6 ? "success" : "warning",
        summary.weeks.map((week) => (week.orders ? 1 : 0)),
        "Weeks with orders",
      ),
    );

    const labels = summary.weeks.map((week) => monthDay(week.start));
    trend.labels = labels;
    trend.series = [
      { id: "wholesale", label: "Wholesale", values: summary.weeks.map((week) => week.wholesale) },
      { id: "web", label: "Web", values: summary.weeks.map((week) => week.web) },
      { id: "showroom", label: "Showroom", values: summary.weeks.map((week) => week.showroom) },
    ];
    const categories = summary.categories.filter((category) => category.value > 0);
    donut.labels = categories.map((category) => category.label);
    donut.series = [
      { id: "categories", label: "Revenue", values: categories.map((category) => category.value) },
    ];
    area.labels = labels;
    area.series = [
      { id: "units", label: "Units", values: summary.weeks.map((week) => week.units) },
    ];
    bars.labels = summary.statuses.map((status) => labelFor(ORDER_STATUSES, status.status));
    bars.series = [
      { id: "orders", label: "Orders", values: summary.statuses.map((status) => status.count) },
    ];

    activity.replaceChildren();
    const recent = summary.active
      .slice()
      .sort((left, right) => right.placed.localeCompare(left.placed) || right.number - left.number)
      .slice(0, 6);
    for (const order of recent) {
      const row = h("div", { class: "activity-row" });
      const mark = h("rowan-status-indicator", {
        tone: toneFor(ORDER_STATUSES, order.status),
        label: labelFor(ORDER_STATUSES, order.status),
      });
      mark.textContent = labelFor(ORDER_STATUSES, order.status);
      const copy = h("div", { class: "activity-copy" });
      const link = h("rowan-link", { href: `#/orders/${order.id}` }, `${order.customer}`);
      copy.append(
        link,
        h("span", { text: `#${order.number} · ${money(order.total)} · ${order.channel}` }),
      );
      row.append(mark, copy, h("time", { datetime: order.placed, text: shortDate(order.placed) }));
      activity.append(row);
    }

    state.state = "ready";
  }

  async function load() {
    state.state = "loading";
    try {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 360);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        );
      });
      if (signal.aborted || !page.isConnected) return;
      if (failNext || failSwitch.checked) {
        failNext = false;
        failSwitch.checked = false;
        state.state = "error";
        page.dataset.ready = "true";
        return;
      }
      paint();
      page.dataset.ready = "true";
    } catch (error) {
      if (error?.name === "AbortError" || !page.isConnected) return;
      state.state = "error";
      page.dataset.ready = "true";
    }
  }

  range.addEventListener("rowan-change", () => {
    filters.set("start", range.start);
    filters.set("end", range.end);
    if (state.state !== "loading") paint();
  });
  refresh.addEventListener("rowan-click", () => {
    void load();
  });
  retry.addEventListener("rowan-click", () => {
    failNext = false;
    void load();
  });
  trend.addEventListener("rowan-point-activate", (event) => {
    const index = event.detail?.index;
    if (typeof index === "number") navigate("#/orders");
  });

  await load();
}

function kpi(label, value, delta, tone, values, sparkLabel) {
  const card = h("rowan-kpi-card", {
    label,
    tone,
    "delta-label": "vs prior 4 weeks",
    locale: "en-US",
  });
  card.messages = { deltaWithLabel: "{value}% {label}" };
  card.value = value;
  card.delta = delta;
  const spark = h("rowan-sparkline", { slot: "chart", label: sparkLabel, variant: "area", tone });
  spark.values = values;
  spark.labels = values.map((_, index) => `Week ${index + 1}`);
  card.append(spark);
  return card;
}

function skeletonRow() {
  const row = h("div", { class: "skeleton-row" });
  for (let index = 0; index < 4; index += 1) {
    row.append(h("rowan-skeleton", { shape: "rect", animated: true, height: "6.5rem" }));
  }
  return row;
}

function skeletonBlock(height) {
  return h("rowan-skeleton", { shape: "rect", animated: true, height });
}
