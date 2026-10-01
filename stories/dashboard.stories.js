import "../src/app-layout/app-layout.js";
import "../src/side-nav/side-nav.js";
import "../src/side-nav-item/side-nav-item.js";
import "../src/side-nav-section/side-nav-section.js";
import "../src/command-palette/command-palette.js";
import "../src/command-item/command-item.js";
import "../src/icon-button/icon-button.js";
import "../src/dropdown/dropdown.js";
import "../src/menu/menu.js";
import "../src/menu-item/menu-item.js";
import "../src/button/button.js";
import "../src/breadcrumb/breadcrumb.js";
import "../src/avatar/avatar.js";
import "../src/select/select.js";
import "../src/kpi-card/kpi-card.js";
import "../src/sparkline/sparkline.js";
import "../src/area-chart/area-chart.js";
import "../src/donut-chart/donut-chart.js";
import "../src/table/table.js";
import "../src/table-toolbar/table-toolbar.js";
import "../src/source-meta/source-meta.js";
import "@rowan-ui/icons/elements/layout-dashboard";
import "@rowan-ui/icons/elements/chart-line";
import "@rowan-ui/icons/elements/shopping-cart";
import "@rowan-ui/icons/elements/users";
import "@rowan-ui/icons/elements/settings-2";
import "@rowan-ui/icons/elements/search";
import "@rowan-ui/icons/elements/sun";
import "@rowan-ui/icons/elements/moon";
import "@rowan-ui/icons/elements/bell";
import "@rowan-ui/icons/elements/user";
import "./dashboard.css";

const THEMES = new Set(["light", "dark", "lagoon", "ember", "slate", "midnight"]);
const DARK_THEMES = new Set(["dark", "ember", "midnight"]);

function normalizeTheme(value) {
  return THEMES.has(value) ? value : "slate";
}

function isDarkTheme(theme) {
  return DARK_THEMES.has(theme);
}

function nextDashboardTheme(theme) {
  return isDarkTheme(theme) ? "slate" : "midnight";
}

function syncThemeButton(button, theme) {
  const dark = isDarkTheme(theme);
  button.icon = dark ? "sun" : "moon";
  button.label = dark ? "Switch to slate" : "Switch to midnight";
}

function emitStorybookTheme(theme) {
  globalThis.__STORYBOOK_ADDONS_CHANNEL__?.emit("updateGlobals", { globals: { theme } });
}

const DESTINATIONS = [
  {
    section: "Insights",
    value: "/overview",
    href: "/overview",
    label: "Overview",
    icon: "layout-dashboard",
  },
  {
    section: "Insights",
    value: "/analytics",
    href: "/analytics",
    label: "Analytics",
    icon: "chart-line",
  },
  {
    section: "Commerce",
    value: "/orders",
    href: "/orders",
    label: "Orders",
    icon: "shopping-cart",
    count: 4,
    tone: "warning",
    countLabel: "pending orders",
  },
  {
    section: "Commerce",
    value: "/customers",
    href: "/customers",
    label: "Customers",
    icon: "users",
  },
  {
    section: "Workspace",
    value: "/settings",
    href: "/settings",
    label: "Settings",
    icon: "settings-2",
  },
];

const PAGES = {
  "/overview": {
    crumb: "Overview",
    title: "Overview",
    body: "Revenue, orders, and mix for the selected period.",
  },
  "/analytics": {
    crumb: "Analytics",
    title: "Analytics",
    body: "Revenue trend and channel mix. Hosts do not fetch.",
  },
  "/orders": {
    crumb: "Orders",
    title: "Orders",
    body: "Recent orders with status, channel, and totals.",
  },
  "/customers": {
    crumb: "Customers",
    title: "Customers",
    body: "Named accounts, plan, and spend for the current period.",
  },
  "/settings": {
    crumb: "Settings",
    title: "Settings",
    body: "Workspace preferences stay in the host.",
  },
};

const ORDER_STATUS_TONE = {
  Paid: "success",
  Fulfilled: "info",
  Pending: "warning",
  Refunded: "danger",
};

const ORDERS = [
  {
    id: "ord-1842",
    order: "ORD-1842",
    customer: "Maya Chen",
    status: "Paid",
    channel: "Direct",
    total: 248,
    placed: "28 Sep 2026",
  },
  {
    id: "ord-1841",
    order: "ORD-1841",
    customer: "Jordan Blake",
    status: "Fulfilled",
    channel: "Marketplace",
    total: 86.4,
    placed: "27 Sep 2026",
  },
  {
    id: "ord-1840",
    order: "ORD-1840",
    customer: "Priya Shah",
    status: "Pending",
    channel: "Direct",
    total: 412.1,
    placed: "27 Sep 2026",
  },
  {
    id: "ord-1839",
    order: "ORD-1839",
    customer: "Eli Navarro",
    status: "Fulfilled",
    channel: "Partner",
    total: 64,
    placed: "26 Sep 2026",
  },
  {
    id: "ord-1838",
    order: "ORD-1838",
    customer: "Hannah Cole",
    status: "Paid",
    channel: "Direct",
    total: 129.5,
    placed: "26 Sep 2026",
  },
  {
    id: "ord-1837",
    order: "ORD-1837",
    customer: "Noah Patel",
    status: "Refunded",
    channel: "Marketplace",
    total: 54.2,
    placed: "25 Sep 2026",
  },
  {
    id: "ord-1836",
    order: "ORD-1836",
    customer: "Sofia Alvarez",
    status: "Pending",
    channel: "Direct",
    total: 980,
    placed: "25 Sep 2026",
  },
  {
    id: "ord-1835",
    order: "ORD-1835",
    customer: "Owen Park",
    status: "Fulfilled",
    channel: "Partner",
    total: 36.75,
    placed: "24 Sep 2026",
  },
];

const CUSTOMERS = [
  { id: "c-1", name: "Maya Chen", plan: "Growth", orders: 18, spend: 4820 },
  { id: "c-2", name: "Jordan Blake", plan: "Starter", orders: 6, spend: 640 },
  { id: "c-3", name: "Priya Shah", plan: "Enterprise", orders: 41, spend: 12840 },
  { id: "c-4", name: "Eli Navarro", plan: "Growth", orders: 11, spend: 1560 },
  { id: "c-5", name: "Hannah Cole", plan: "Starter", orders: 3, spend: 210 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatMoney(value) {
  return currency.format(Number(value) || 0);
}

function formatChartValue(value, context) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  const rounded = Math.abs(numeric) >= 10 ? numeric.toFixed(0) : numeric.toFixed(1);
  if (context?.tick) return `$${rounded}k`;
  return `$${numeric.toFixed(1)}k`;
}

function collapseMatchingTable(host) {
  let attempts = 0;
  const close = () => {
    const details = host.shadowRoot?.querySelector("details");
    if (details) {
      details.open = false;
      return;
    }
    if (attempts < 40) {
      attempts += 1;
      requestAnimationFrame(close);
    }
  };
  close();
}

function createPrefixIcon(name) {
  const icon = document.createElement("rowan-icon");
  icon.slot = "prefix";
  icon.name = name;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createNamedIcon(name) {
  const icon = document.createElement("rowan-icon");
  icon.name = name;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createNavItem(destination) {
  const item = document.createElement("rowan-side-nav-item");
  item.value = destination.value;
  item.href = destination.href;
  item.label = destination.label;
  if (destination.count != null) item.count = destination.count;
  if (destination.tone) item.tone = destination.tone;
  if (destination.countLabel) item.countLabel = destination.countLabel;
  item.append(createPrefixIcon(destination.icon), document.createTextNode(destination.label));
  return item;
}

function createSideNav() {
  const nav = document.createElement("rowan-side-nav");
  nav.label = "Workspace navigation";
  nav.value = "/overview";

  const sections = new Map();
  for (const destination of DESTINATIONS) {
    let section = sections.get(destination.section);
    if (!section) {
      section = document.createElement("rowan-side-nav-section");
      section.label = destination.section;
      if (destination.section !== "Insights") section.collapsible = true;
      sections.set(destination.section, section);
      nav.append(section);
    }
    section.append(createNavItem(destination));
  }

  return nav;
}

function createPalette() {
  const palette = document.createElement("rowan-command-palette");
  palette.label = "Jump to";
  palette.hotkey = "mod+k";
  palette.placeholder = "Jump to a page";
  palette.emptyLabel = "No pages match.";

  for (const destination of DESTINATIONS) {
    const item = document.createElement("rowan-command-item");
    item.value = destination.value;
    item.label = destination.label;
    item.group = destination.section;
    item.append(createPrefixIcon(destination.icon));
    palette.append(item);
  }

  return palette;
}

function createBreadcrumb(path) {
  const breadcrumb = document.createElement("rowan-breadcrumb");
  const home = document.createElement("a");
  home.href = "/overview";
  home.textContent = "Dashboard";
  const sep = document.createElement("span");
  sep.setAttribute("aria-hidden", "true");
  sep.textContent = "/";
  const current = document.createElement("span");
  current.setAttribute("aria-current", "page");
  current.textContent = PAGES[path]?.crumb ?? "Not found";
  breadcrumb.append(home, sep, current);
  return breadcrumb;
}

function createKpi({ label, value, delta, deltaLabel, tone, icon, sparkline, chartLabel }) {
  const card = document.createElement("rowan-kpi-card");
  card.label = label;
  card.value = value;
  card.delta = delta;
  card.deltaLabel = deltaLabel;
  card.tone = tone;

  const glyph = document.createElement("rowan-icon");
  glyph.slot = "icon";
  glyph.name = icon;
  glyph.setAttribute("aria-hidden", "true");

  const chart = document.createElement("rowan-sparkline");
  chart.slot = "chart";
  chart.label = chartLabel;
  chart.values = sparkline;
  chart.tone = tone === "neutral" ? "info" : tone;

  card.append(glyph, chart);
  return card;
}

function createKpiRow() {
  const row = document.createElement("div");
  row.className = "dashboard-kpis";
  row.append(
    createKpi({
      label: "Revenue",
      value: "$48.2k",
      delta: 12.4,
      deltaLabel: "vs last period",
      tone: "success",
      icon: "chart-line",
      sparkline: [32, 36, 34, 41, 39, 48],
      chartLabel: "Revenue this period",
    }),
    createKpi({
      label: "Orders",
      value: "1,284",
      delta: 8.1,
      deltaLabel: "vs last period",
      tone: "info",
      icon: "shopping-cart",
      sparkline: [18, 22, 21, 26, 24, 29],
      chartLabel: "Orders this period",
    }),
    createKpi({
      label: "Customers",
      value: "3,912",
      delta: 3.2,
      deltaLabel: "vs last period",
      tone: "success",
      icon: "users",
      sparkline: [48, 50, 51, 53, 54, 56],
      chartLabel: "Customers this period",
    }),
    createKpi({
      label: "Refund rate",
      value: "1.8%",
      delta: -0.4,
      deltaLabel: "vs last period",
      tone: "success",
      icon: "shopping-cart",
      sparkline: [2.4, 2.2, 2.1, 1.9, 2.0, 1.8],
      chartLabel: "Refund rate this period",
    }),
  );
  return row;
}

function createRevenueChart() {
  const chart = document.createElement("rowan-area-chart");
  chart.label = "Revenue";
  chart.description = "Thousands of dollars.";
  chart.interactive = true;
  chart.labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  chart.series = [
    { id: "revenue", label: "Revenue", values: [32.1, 36.4, 34.8, 41.2, 39.6, 48.2] },
  ];
  chart.valueFormatter = formatChartValue;
  collapseMatchingTable(chart);
  return chart;
}

function createChannelChart() {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = "Channel mix";
  chart.description = "Share of orders.";
  chart.interactive = true;
  chart.labels = ["Direct", "Marketplace", "Partner", "Other"];
  chart.series = [{ id: "orders", label: "Orders", values: [42, 28, 18, 12] }];
  collapseMatchingTable(chart);
  return chart;
}

function createOrdersTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Recent orders",
    rowId: "id",
    density: "sm",
    stickyHeader: true,
    columns: [
      {
        id: "order",
        header: "Order",
        type: "link",
        sortable: true,
        sticky: "start",
        minWidth: "8rem",
        cell: { href: (value) => `/orders/${value}`, label: (value) => value },
      },
      { id: "customer", header: "Customer", minWidth: "10rem" },
      {
        id: "status",
        header: "Status",
        type: "badge",
        cell: { tone: (value) => ORDER_STATUS_TONE[value] ?? "info" },
      },
      { id: "channel", header: "Channel" },
      {
        id: "total",
        header: "Total",
        align: "end",
        sortable: true,
        format: (value) => formatMoney(value),
      },
      { id: "placed", header: "Placed", sortable: true },
    ],
    rows: ORDERS.map((row) => ({ ...row })),
  };

  const toolbar = document.createElement("rowan-table-toolbar");
  toolbar.slot = "toolbar";
  toolbar.label = "Order table controls";
  toolbar.columnPicker = true;

  const start = document.createElement("span");
  start.slot = "start";
  start.textContent = "Last 30 days";
  toolbar.append(start);
  table.append(toolbar);
  return table;
}

function createCustomersTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Customers",
    rowId: "id",
    density: "sm",
    stickyHeader: true,
    columns: [
      { id: "name", header: "Name", sortable: true, sticky: "start", minWidth: "10rem" },
      {
        id: "plan",
        header: "Plan",
        type: "badge",
        cell: {
          tone: (value) => (value === "Enterprise" ? "warning" : "info"),
        },
      },
      { id: "orders", header: "Orders", type: "number", align: "end", sortable: true },
      {
        id: "spend",
        header: "Spend",
        align: "end",
        sortable: true,
        format: (value) => formatMoney(value),
      },
    ],
    rows: CUSTOMERS.map((row) => ({ ...row })),
  };
  return table;
}

function createSourceMeta() {
  const meta = document.createElement("rowan-source-meta");
  meta.source = "Billing";
  meta.asOf = "30 Sep 2026";
  return meta;
}

function createEmptyPanel(title, body) {
  const panel = document.createElement("section");
  panel.className = "dashboard-empty";
  const heading = document.createElement("h2");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = body;
  panel.append(heading, copy);
  return panel;
}

function createOverview() {
  const page = document.createElement("div");
  page.className = "dashboard-page";

  const charts = document.createElement("div");
  charts.className = "dashboard-charts";
  charts.append(createRevenueChart(), createChannelChart());

  const tableWrap = document.createElement("div");
  tableWrap.className = "dashboard-panel";
  tableWrap.append(createOrdersTable());

  page.append(createKpiRow(), charts, tableWrap);
  return page;
}

function createAnalytics() {
  const page = document.createElement("div");
  page.className = "dashboard-page";
  const charts = document.createElement("div");
  charts.className = "dashboard-charts";
  charts.append(createRevenueChart(), createChannelChart());
  page.append(charts);
  return page;
}

function createPageBody(path) {
  if (path === "/overview") return createOverview();
  if (path === "/analytics") return createAnalytics();
  if (path === "/orders") {
    const page = document.createElement("div");
    page.className = "dashboard-page";
    page.append(createOrdersTable());
    return page;
  }
  if (path === "/customers") {
    const page = document.createElement("div");
    page.className = "dashboard-page";
    page.append(createCustomersTable());
    return page;
  }
  if (path === "/settings") {
    return createEmptyPanel(
      "Workspace settings",
      "Theme, members, and billing stay in application state. This page is a destination, not a settings host.",
    );
  }
  return createEmptyPanel(
    "Not in the catalog",
    "value is empty. Unauthorized and 404 pages must not revive the last active item.",
  );
}

function createHeader(onOpenPalette, onToggleTheme, theme) {
  const header = document.createElement("div");
  header.slot = "header";
  header.className = "dashboard-header";

  const breadcrumb = createBreadcrumb("/overview");

  const end = document.createElement("div");
  end.className = "dashboard-header-end";

  const search = document.createElement("button");
  search.type = "button";
  search.className = "dashboard-search";
  search.setAttribute("aria-label", "Jump to a page");
  const searchIcon = createNamedIcon("search");
  const searchLabel = document.createElement("span");
  searchLabel.textContent = "Jump to…";
  const kbd = document.createElement("kbd");
  kbd.textContent = "⌘K";
  search.append(searchIcon, searchLabel, kbd);
  search.addEventListener("click", () => onOpenPalette());

  const alerts = document.createElement("rowan-dropdown");
  alerts.label = "Notifications";
  const alertTrigger = document.createElement("rowan-icon-button");
  alertTrigger.slot = "trigger";
  alertTrigger.icon = "bell";
  alertTrigger.label = "Notifications";
  alertTrigger.variant = "ghost";
  const alertMenu = document.createElement("rowan-menu");
  for (const [value, label] of [
    ["ship", "4 orders awaiting fulfillment"],
    ["refund", "1 refund needs review"],
    ["plan", "Growth plan renews 12 Oct"],
  ]) {
    const item = document.createElement("rowan-menu-item");
    item.value = value;
    item.textContent = label;
    alertMenu.append(item);
  }
  alerts.append(alertTrigger, alertMenu);

  const themeButton = document.createElement("rowan-icon-button");
  syncThemeButton(themeButton, theme);
  themeButton.variant = "ghost";
  themeButton.addEventListener("rowan-click", () => onToggleTheme());
  themeButton.addEventListener("click", (event) => {
    const inner = themeButton.shadowRoot?.querySelector("button");
    if (inner && event.composedPath().includes(inner)) return;
    onToggleTheme();
  });

  const account = document.createElement("rowan-dropdown");
  account.label = "Account";
  const trigger = document.createElement("rowan-icon-button");
  trigger.slot = "trigger";
  trigger.icon = "user";
  trigger.label = "Account";
  trigger.variant = "ghost";
  const menu = document.createElement("rowan-menu");
  const profile = document.createElement("rowan-menu-item");
  profile.value = "profile";
  profile.textContent = "Profile";
  const settings = document.createElement("rowan-menu-item");
  settings.value = "settings";
  settings.textContent = "Settings";
  menu.append(profile, settings);
  account.append(trigger, menu);

  const avatar = document.createElement("rowan-avatar");
  avatar.name = "Ada Lovelace";
  avatar.size = "sm";
  avatar.setAttribute("aria-hidden", "true");

  end.append(search, alerts, themeButton, account, avatar);
  header.append(breadcrumb, end);
  return { header, breadcrumb, themeButton };
}

function createPageHead(path) {
  const head = document.createElement("div");
  head.className = "dashboard-page-head";

  const copy = document.createElement("div");
  copy.className = "dashboard-page-copy";
  const title = document.createElement("h1");
  const body = document.createElement("p");
  copy.append(title, body, createSourceMeta());

  const actions = document.createElement("div");
  actions.className = "dashboard-page-actions";

  const period = document.createElement("rowan-select");
  period.label = "Period";
  period.value = "30d";
  period.options = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
  ];

  const exportButton = document.createElement("rowan-button");
  exportButton.variant = "secondary";
  exportButton.size = "sm";
  exportButton.textContent = "Export";

  const createButton = document.createElement("rowan-button");
  createButton.size = "sm";
  createButton.textContent = "New order";

  actions.append(period, exportButton, createButton);
  head.append(copy, actions);

  function sync(nextPath) {
    const page = PAGES[nextPath];
    title.textContent = page ? page.title : "Not in the catalog";
    body.textContent = page
      ? page.body
      : "value is empty. Unauthorized and 404 pages must not revive the last active item.";
    actions.hidden = nextPath === "/settings" || nextPath === "/customers" || !page;
  }

  sync(path);
  return { head, sync };
}

export default {
  title: "Workflows/Dashboard",
  parameters: {
    layout: "fullscreen",
    rowanEventTrace: false,
  },
};

export const AdminOverview = {
  name: "Admin overview",
  render: (_args, context) => {
    const known = new Set(DESTINATIONS.map((item) => item.value));
    let path = "/overview";
    let theme = normalizeTheme(context?.globals?.theme);

    const root = document.createElement("div");
    root.className = "dashboard-root";
    root.dataset.theme = theme;
    root.dataset.rowanCharts = "vibrant";

    const layout = document.createElement("rowan-app-layout");
    layout.navigationLabel = "Workspace navigation";

    const rail = document.createElement("div");
    rail.slot = "navigation";
    rail.className = "dashboard-rail";

    const brand = document.createElement("div");
    brand.className = "dashboard-brand";
    const mark = document.createElement("span");
    mark.className = "dashboard-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "M";
    const brandCopy = document.createElement("div");
    brandCopy.className = "dashboard-brand-copy";
    const brandName = document.createElement("span");
    brandName.className = "dashboard-brand-name";
    brandName.textContent = "Meridian";
    const brandMeta = document.createElement("span");
    brandMeta.className = "dashboard-brand-meta";
    brandMeta.textContent = "Commerce";
    brandCopy.append(brandName, brandMeta);
    brand.append(mark, brandCopy);

    const nav = createSideNav();
    rail.append(brand, nav);

    const palette = createPalette();
    const { header, breadcrumb, themeButton } = createHeader(
      () => palette.show(),
      () => {
        theme = nextDashboardTheme(theme);
        root.dataset.theme = theme;
        syncThemeButton(themeButton, theme);
        emitStorybookTheme(theme);
      },
      theme,
    );

    const content = document.createElement("div");
    content.className = "dashboard-page";
    const pageHead = createPageHead(path);
    let body = createPageBody(path);
    content.append(pageHead.head, body);

    function syncBreadcrumb() {
      const current = breadcrumb.querySelector("[aria-current='page']");
      if (current) current.textContent = PAGES[path]?.crumb ?? "Not found";
    }

    function go(nextPath) {
      path = known.has(nextPath) ? nextPath : "";
      nav.value = path;
      pageHead.sync(path);
      syncBreadcrumb();
      const nextBody = createPageBody(path);
      body.replaceWith(nextBody);
      body = nextBody;
    }

    root.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      if (known.has(url.pathname)) go(url.pathname);
    });

    nav.addEventListener("rowan-change", (event) => {
      event.preventDefault();
      go(event.detail.value);
    });

    palette.addEventListener("rowan-command", (event) => {
      go(event.detail.value);
    });

    layout.append(header, rail, content);
    root.append(layout, palette);
    return root;
  },
};
