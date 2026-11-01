<script setup>
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

import { computed, onMounted, ref } from "vue";

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

const theme = ref(getTheme());
const page = ref("overview");
const query = ref("");
const status = ref("all");
const rows = ref([]);
const countLabel = computed(() => orderCountLabel(rows.value.length));
const copy = computed(() => PAGES[page.value] ?? PAGES.overview);
const themeLabel = computed(() => themeToggleLabel(theme.value));
const themeIcon = computed(() => themeToggleIcon(theme.value));

const mainEl = ref(null);
const ordersEl = ref(null);
const searchEl = ref(null);
const statusEl = ref(null);
const themeEl = ref(null);
const themeTooltipEl = ref(null);
const trendEl = ref(null);
const barsEl = ref(null);
const donutEl = ref(null);
const gaugeEl = ref(null);
const tableEl = ref(null);
const cards = ref([]);
const sparks = ref([]);

onMounted(async () => {
  const nodes = [
    trendEl.value,
    barsEl.value,
    donutEl.value,
    gaugeEl.value,
    tableEl.value,
    ...cards.value,
    ...sparks.value,
  ];
  await Promise.all(nodes.map((node) => whenUpgraded(node)));

  KPIS.forEach((metric, index) => {
    const card = cards.value[index];
    const spark = sparks.value[index];
    if (!card || !spark) return;
    card.messages = metric.messages;
    card.value = metric.value;
    card.delta = metric.delta;
    spark.labels = WEEK_LABELS;
    spark.values = metric.values;
  });

  trendEl.value.labels = TREND.labels;
  trendEl.value.series = TREND.series;
  trendEl.value.valueFormatter = chartMoney;
  barsEl.value.labels = STACKED.labels;
  barsEl.value.series = STACKED.series;
  donutEl.value.labels = DONUT.labels;
  donutEl.value.series = DONUT.series;
  donutEl.value.valueFormatter = donutMoney;
  gaugeEl.value.min = FULFILLMENT.min;
  gaugeEl.value.max = FULFILLMENT.max;
  gaugeEl.value.value = FULFILLMENT.value;
  gaugeEl.value.target = FULFILLMENT.target;
  gaugeEl.value.ranges = FULFILLMENT.ranges;
  tableEl.value.columns = COLUMNS;
  const toolbar = document.querySelector("rowan-table-toolbar");
  if (toolbar) {
    toolbar.columnPicker = false;
    toolbar.columnPicker = true;
  }
  paintOrders();
  paintTheme(theme.value);
  markReady(document);
});

function paintOrders() {
  const next = filterOrders(query.value, status.value || "all");
  rows.value = next;
  if (!tableEl.value) return;
  tableEl.value.rows = next;
  tableEl.value.page = firstPage();
}

function onSearch() {
  query.value = searchEl.value?.value ?? "";
  paintOrders();
}

function onStatus() {
  status.value = statusEl.value?.value || "all";
  paintOrders();
}

function clearFilters() {
  query.value = "";
  status.value = "all";
  if (searchEl.value) searchEl.value.value = "";
  if (statusEl.value) statusEl.value.value = "all";
  paintOrders();
  searchEl.value?.focus();
}

function paintTheme(next) {
  const label = themeToggleLabel(next);
  if (themeEl.value) {
    themeEl.value.icon = themeToggleIcon(next);
    themeEl.value.label = label;
  }
  if (themeTooltipEl.value) themeTooltipEl.value.text = label;
}

function onToggleTheme() {
  theme.value = toggleTheme();
  paintTheme(theme.value);
}

function onNav(event) {
  const next = event.detail?.value || "overview";
  page.value = next;
  if (next === "orders" || next === "accounts") ordersEl.value?.scrollIntoView({ block: "start" });
  else if (next === "settings") themeEl.value?.focus();
  else mainEl.value?.scrollIntoView({ block: "start" });
  if (next === "accounts") searchEl.value?.focus();
}
</script>

<template>
  <rowan-app-layout navigation-label="Primary">
    <div class="app-header" slot="header">
      <div class="period-copy">
        <strong>{{ PERIOD.title }}</strong>
        <span>{{ PERIOD.caption }}</span>
      </div>
      <div class="header-actions">
        <rowan-tooltip ref="themeTooltipEl" :text="themeLabel">
          <rowan-icon-button
            ref="themeEl"
            variant="ghost"
            :icon="themeIcon"
            :label="themeLabel"
            @rowan-click="onToggleTheme"
          ></rowan-icon-button>
        </rowan-tooltip>
        <div class="user">
          <rowan-avatar :name="OPERATOR.name" size="sm"></rowan-avatar>
          <span class="user-meta">
            <strong>{{ OPERATOR.name }}</strong>
            <small>{{ OPERATOR.role }}</small>
          </span>
        </div>
      </div>
    </div>
    <div class="app-nav" slot="navigation">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">{{ BRAND.mark }}</span>
        <span class="brand-copy">
          <span class="brand-name">{{ BRAND.name }}</span>
          <span class="brand-product">{{ BRAND.product }}</span>
        </span>
      </div>
      <rowan-side-nav label="Pages" :value="page" @rowan-change="onNav">
        <rowan-side-nav-section v-for="section in NAV" :key="section.label" :label="section.label">
          <rowan-side-nav-item
            v-for="item in section.items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :count="item.count ? OPEN_ORDER_COUNT : undefined"
            :count-label="item.count ? 'open' : undefined"
          >
            <rowan-icon :name="item.icon" size="1.125rem" slot="prefix"></rowan-icon>
            {{ item.label }}
          </rowan-side-nav-item>
        </rowan-side-nav-section>
      </rowan-side-nav>
      <p class="nav-note">Sample wholesale data.</p>
    </div>
    <div id="main" ref="mainEl" tabindex="-1">
      <header class="page-header">
        <h1>{{ copy.title }}</h1>
        <p class="lede">{{ copy.lede }}</p>
      </header>
      <section class="kpi-grid" aria-label="Key figures">
        <rowan-kpi-card
          v-for="metric in KPIS"
          :key="metric.id"
          ref="cards"
          :label="metric.label"
          :tone="metric.tone"
          delta-label="vs prior 8 weeks"
        >
          <rowan-sparkline
            ref="sparks"
            slot="chart"
            :label="metric.sparkLabel"
            :tone="metric.tone"
          ></rowan-sparkline>
        </rowan-kpi-card>
      </section>
      <section class="chart-grid" aria-label="Charts">
        <rowan-trend-chart
          ref="trendEl"
          class="chart-trend"
          :label="TREND.label"
          :description="TREND.description"
          interactive
          locale="en-US"
        ></rowan-trend-chart>
        <rowan-stacked-bar-chart
          ref="barsEl"
          class="chart-bars"
          :label="STACKED.label"
          :description="STACKED.description"
          interactive
          locale="en-US"
        ></rowan-stacked-bar-chart>
        <rowan-donut-chart
          ref="donutEl"
          class="chart-donut"
          :label="DONUT.label"
          :description="DONUT.description"
          locale="en-US"
        ></rowan-donut-chart>
        <rowan-card class="chart-side">
          <span slot="title">{{ FULFILLMENT.title }}</span>
          <p class="side-kicker">{{ FULFILLMENT.kicker }}</p>
          <rowan-gauge-chart
            ref="gaugeEl"
            :label="FULFILLMENT.label"
            locale="en-US"
          ></rowan-gauge-chart>
          <dl class="side-stats">
            <div v-for="stat in FULFILLMENT_STATS" :key="stat.label">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>
        </rowan-card>
      </section>
      <section id="orders-section" ref="ordersEl" class="orders">
        <div class="section-heading">
          <h2>Recent orders</h2>
          <p>Latest bookings in the sample window.</p>
        </div>
        <rowan-table
          id="orders"
          ref="tableEl"
          caption="Recent orders"
          caption-visually-hidden
          sticky-header
          locale="en-US"
        >
          <rowan-table-toolbar
            slot="toolbar"
            for-table="orders"
            column-picker
            label="Recent orders"
          >
            <rowan-text-field
              ref="searchEl"
              slot="start"
              class="toolbar-search"
              type="search"
              label="Search orders"
              placeholder="Search orders or accounts"
              name="order-search"
              @input="onSearch"
            ></rowan-text-field>
            <rowan-select
              ref="statusEl"
              slot="start"
              class="toolbar-status"
              label="Status"
              name="order-status"
              value="all"
              @rowan-change="onStatus"
            >
              <option value="all">All statuses</option>
              <option v-for="item in STATUSES" :key="item" :value="item">{{ item }}</option>
            </rowan-select>
            <span slot="end" class="toolbar-count" aria-live="polite">{{ countLabel }}</span>
          </rowan-table-toolbar>
          <div slot="empty">
            <rowan-empty-state>
              <span slot="title">No matching orders</span>
              <p>Try a different search or status.</p>
              <rowan-button
                slot="actions"
                variant="secondary"
                size="sm"
                type="button"
                @rowan-click="clearFilters"
              >
                Clear filters
              </rowan-button>
            </rowan-empty-state>
          </div>
        </rowan-table>
      </section>
    </div>
  </rowan-app-layout>
</template>
