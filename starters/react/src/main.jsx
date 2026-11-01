import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";
import { RowanAppLayout } from "@rowan-ui/core/react/app-layout";
import { RowanAvatar } from "@rowan-ui/core/react/avatar";
import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanCard } from "@rowan-ui/core/react/card";
import { RowanDonutChart } from "@rowan-ui/core/react/donut-chart";
import { RowanEmptyState } from "@rowan-ui/core/react/empty-state";
import { RowanGaugeChart } from "@rowan-ui/core/react/gauge-chart";
import { RowanIconButton } from "@rowan-ui/core/react/icon-button";
import { RowanKpiCard } from "@rowan-ui/core/react/kpi-card";
import { RowanSelect } from "@rowan-ui/core/react/select";
import { RowanSideNav } from "@rowan-ui/core/react/side-nav";
import { RowanSideNavItem } from "@rowan-ui/core/react/side-nav-item";
import { RowanSideNavSection } from "@rowan-ui/core/react/side-nav-section";
import { RowanSparkline } from "@rowan-ui/core/react/sparkline";
import { RowanStackedBarChart } from "@rowan-ui/core/react/stacked-bar-chart";
import { RowanTable } from "@rowan-ui/core/react/table";
import { RowanTableToolbar } from "@rowan-ui/core/react/table-toolbar";
import { RowanTextField } from "@rowan-ui/core/react/text-field";
import { RowanTooltip } from "@rowan-ui/core/react/tooltip";
import { RowanTrendChart } from "@rowan-ui/core/react/trend-chart";
import "@rowan-ui/icons/elements/layout-dashboard";
import "@rowan-ui/icons/elements/moon";
import "@rowan-ui/icons/elements/settings";
import "@rowan-ui/icons/elements/shopping-bag";
import "@rowan-ui/icons/elements/sun";
import "@rowan-ui/icons/elements/users";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

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
import "./styles.css";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...STATUSES.map((value) => ({ value, label: value })),
];

function App() {
  const [theme, setTheme] = useState(() => getTheme());
  const [page, setPage] = useState("overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const mainRef = useRef(null);
  const ordersRef = useRef(null);
  const searchRef = useRef(null);
  const statusRef = useRef(null);
  const themeRef = useRef(null);
  const trendRef = useRef(null);
  const barsRef = useRef(null);
  const donutRef = useRef(null);
  const gaugeRef = useRef(null);
  const copy = PAGES[page] ?? PAGES.overview;
  const rows = useMemo(() => filterOrders(query, status), [query, status]);
  const tablePage = useMemo(() => firstPage(), [query, status]);
  const themeLabel = themeToggleLabel(theme);

  useEffect(() => {
    let cancel = false;
    const charts = [trendRef.current, barsRef.current, donutRef.current, gaugeRef.current].filter(
      Boolean,
    );
    Promise.all(charts.map((chart) => whenUpgraded(chart))).then(() => {
      if (cancel) return;
      const trend = trendRef.current;
      const bars = barsRef.current;
      const donut = donutRef.current;
      if (trend) {
        trend.labels = TREND.labels;
        trend.series = TREND.series;
        trend.valueFormatter = chartMoney;
      }
      if (bars) {
        bars.labels = STACKED.labels;
        bars.series = STACKED.series;
      }
      if (donut) {
        donut.labels = DONUT.labels;
        donut.series = DONUT.series;
        donut.valueFormatter = donutMoney;
      }
      const gauge = gaugeRef.current;
      if (gauge) {
        gauge.min = FULFILLMENT.min;
        gauge.max = FULFILLMENT.max;
        gauge.value = FULFILLMENT.value;
        gauge.target = FULFILLMENT.target;
        gauge.ranges = FULFILLMENT.ranges;
      }
      const toolbar = document.querySelector("rowan-table-toolbar");
      if (toolbar) {
        toolbar.columnPicker = false;
        toolbar.columnPicker = true;
      }
      markReady(document);
    });
    return () => {
      cancel = true;
    };
  }, []);

  function onToggleTheme() {
    setTheme(toggleTheme());
  }

  function onNav(event) {
    const next = event.detail?.value || "overview";
    setPage(next);
    if (next === "orders" || next === "accounts")
      ordersRef.current?.scrollIntoView({ block: "start" });
    else if (next === "settings") themeRef.current?.focus();
    else mainRef.current?.scrollIntoView({ block: "start" });
    if (next === "accounts") searchRef.current?.focus();
  }

  useEffect(() => {
    const field = searchRef.current;
    if (!field) return undefined;
    const onInput = () => setQuery(field.value ?? "");
    field.addEventListener("input", onInput);
    return () => field.removeEventListener("input", onInput);
  }, []);

  function onStatus() {
    setStatus(statusRef.current?.value || "all");
  }

  function clearFilters() {
    if (searchRef.current) searchRef.current.value = "";
    if (statusRef.current) statusRef.current.value = "all";
    setQuery("");
    setStatus("all");
    searchRef.current?.focus();
  }

  return (
    <RowanAppLayout navigationLabel="Primary">
      <div className="app-header" slot="header">
        <div className="period-copy">
          <strong>{PERIOD.title}</strong>
          <span>{PERIOD.caption}</span>
        </div>
        <div className="header-actions">
          <RowanTooltip text={themeLabel}>
            <RowanIconButton
              ref={themeRef}
              variant="ghost"
              icon={themeToggleIcon(theme)}
              label={themeLabel}
              onRowanClick={onToggleTheme}
            />
          </RowanTooltip>
          <div className="user">
            <RowanAvatar name={OPERATOR.name} size="sm" />
            <span className="user-meta">
              <strong>{OPERATOR.name}</strong>
              <small>{OPERATOR.role}</small>
            </span>
          </div>
        </div>
      </div>
      <div className="app-nav" slot="navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            {BRAND.mark}
          </span>
          <span className="brand-copy">
            <span className="brand-name">{BRAND.name}</span>
            <span className="brand-product">{BRAND.product}</span>
          </span>
        </div>
        <RowanSideNav label="Pages" value={page} onRowanChange={onNav}>
          {NAV.map((section) => (
            <RowanSideNavSection key={section.label} label={section.label}>
              {section.items.map((item) => (
                <RowanSideNavItem
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  count={item.count ? OPEN_ORDER_COUNT : undefined}
                  countLabel={item.count ? "open" : undefined}
                >
                  <rowan-icon name={item.icon} size="1.125rem" slot="prefix" />
                  {item.label}
                </RowanSideNavItem>
              ))}
            </RowanSideNavSection>
          ))}
        </RowanSideNav>
        <p className="nav-note">Sample wholesale data.</p>
      </div>
      <div id="main" ref={mainRef} tabIndex={-1}>
        <header className="page-header">
          <h1>{copy.title}</h1>
          <p className="lede">{copy.lede}</p>
        </header>
        <section className="kpi-grid" aria-label="Key figures">
          {KPIS.map((metric) => (
            <RowanKpiCard
              key={metric.id}
              label={metric.label}
              tone={metric.tone}
              deltaLabel="vs prior 8 weeks"
              messages={metric.messages}
              value={metric.value}
              delta={metric.delta}
            >
              <RowanSparkline
                slot="chart"
                label={metric.sparkLabel}
                tone={metric.tone}
                labels={WEEK_LABELS}
                values={metric.values}
              />
            </RowanKpiCard>
          ))}
        </section>
        <section className="chart-grid" aria-label="Charts">
          <RowanTrendChart
            ref={trendRef}
            className="chart-trend"
            label={TREND.label}
            description={TREND.description}
            interactive
            locale="en-US"
            labels={TREND.labels}
            series={TREND.series}
            valueFormatter={chartMoney}
          />
          <RowanStackedBarChart
            ref={barsRef}
            className="chart-bars"
            label={STACKED.label}
            description={STACKED.description}
            interactive
            locale="en-US"
            labels={STACKED.labels}
            series={STACKED.series}
          />
          <RowanDonutChart
            ref={donutRef}
            className="chart-donut"
            label={DONUT.label}
            description={DONUT.description}
            locale="en-US"
            labels={DONUT.labels}
            series={DONUT.series}
            valueFormatter={donutMoney}
          />
          <RowanCard className="chart-side">
            <span slot="title">{FULFILLMENT.title}</span>
            <p className="side-kicker">{FULFILLMENT.kicker}</p>
            <RowanGaugeChart ref={gaugeRef} label={FULFILLMENT.label} locale="en-US" />
            <dl className="side-stats">
              {FULFILLMENT_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </RowanCard>
        </section>
        <section className="orders" id="orders-section" ref={ordersRef}>
          <div className="section-heading">
            <h2>Recent orders</h2>
            <p>Latest bookings in the sample window.</p>
          </div>
          <RowanTable
            id="orders"
            caption="Recent orders"
            captionVisuallyHidden
            stickyHeader
            locale="en-US"
            columns={COLUMNS}
            rows={rows}
            page={tablePage}
          >
            <RowanTableToolbar slot="toolbar" forTable="orders" columnPicker label="Recent orders">
              <RowanTextField
                ref={searchRef}
                slot="start"
                className="toolbar-search"
                type="search"
                label="Search orders"
                placeholder="Search orders or accounts"
                name="order-search"
              />
              <RowanSelect
                ref={statusRef}
                slot="start"
                className="toolbar-status"
                label="Status"
                name="order-status"
                value={status}
                options={STATUS_OPTIONS}
                onRowanChange={onStatus}
              />
              <span slot="end" className="toolbar-count" aria-live="polite">
                {orderCountLabel(rows.length)}
              </span>
            </RowanTableToolbar>
            <div slot="empty">
              <RowanEmptyState>
                <span slot="title">No matching orders</span>
                <p>Try a different search or status.</p>
                <RowanButton
                  slot="actions"
                  variant="secondary"
                  size="sm"
                  type="button"
                  onRowanClick={clearFilters}
                >
                  Clear filters
                </RowanButton>
              </RowanEmptyState>
            </div>
          </RowanTable>
        </section>
      </div>
    </RowanAppLayout>
  );
}

createRoot(document.querySelector("#app")).render(<App />);
