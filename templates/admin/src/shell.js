import { holdCount } from "./api.js";
import { h, icon } from "./dom.js";
import { getTheme, toggleTheme } from "./theme.js";

const NAV = [
  {
    label: "Operate",
    items: [
      { value: "overview", href: "#/", label: "Overview", icon: "layout-dashboard" },
      { value: "orders", href: "#/orders", label: "Orders", icon: "shopping-bag", count: true },
      { value: "customers", href: "#/customers", label: "Customers", icon: "users" },
      { value: "map", href: "#/map", label: "Fulfillment map", icon: "map" },
    ],
  },
  {
    label: "Workspace",
    items: [{ value: "settings", href: "#/settings", label: "Settings", icon: "settings" }],
  },
];

export function createShell({ store, navigate, toaster }) {
  const layout = h("rowan-app-layout", { "navigation-label": "Primary" });
  const header = h("div", { class: "app-header", slot: "header" });
  const navigation = h("div", { class: "app-nav", slot: "navigation" });
  const main = h("div", { id: "main", class: "app-main", tabindex: "-1" });
  const outlet = h("div", { id: "outlet" });

  const search = h("button", { class: "search-trigger", type: "button" });
  search.append(icon("search"), h("span", { text: "Search orders, customers, and pages" }));
  const kbd = h("kbd", { class: "search-kbd", text: "⌘K" });
  search.append(kbd);
  search.setAttribute("aria-label", "Search");
  search.setAttribute("aria-keyshortcuts", "Control+K Meta+K");

  const themeTooltip = h("rowan-tooltip");
  const themeButton = h("rowan-icon-button", {
    variant: "ghost",
    icon: "moon",
    label: "Switch to dark theme",
  });
  themeTooltip.append(themeButton);

  const notifyWrap = h("div", { class: "notify" });
  const notifyDrop = h("rowan-dropdown", { label: "Notifications" });
  const notifyTrigger = h("rowan-icon-button", {
    slot: "trigger",
    variant: "ghost",
    icon: "bell",
    label: "Notifications",
  });
  const notifyCount = h("rowan-badge", { class: "notify-count", size: "sm", tone: "danger" });
  const notifyPanel = h("div", { class: "notify-panel" });
  notifyDrop.append(notifyTrigger, notifyPanel);
  notifyWrap.append(notifyDrop, notifyCount);

  const userDrop = h("rowan-dropdown", { label: "Account menu" });
  const userTrigger = h("button", { class: "user-trigger", slot: "trigger", type: "button" });
  const avatar = h("rowan-avatar", { name: "Maya Chen", size: "sm" });
  const userMeta = h("span", { class: "user-meta" });
  userMeta.append(h("strong", { text: "Maya Chen" }), h("small", { text: "Ops lead" }));
  userTrigger.append(avatar, userMeta);
  const menu = h("rowan-menu");
  menu.append(
    h("rowan-menu-item", { value: "settings" }, "Settings"),
    h("rowan-menu-item", { value: "sign-in" }, "Sign-in screen"),
    h("rowan-menu-item", { value: "sign-out" }, "Sign out"),
  );
  userDrop.append(userTrigger, menu);

  const actions = h("div", { class: "header-actions" });
  actions.append(themeTooltip, notifyWrap, userDrop);
  header.append(search, actions);

  const brand = h("div", { class: "brand" });
  brand.append(
    h("span", { class: "brand-mark", text: "L", "aria-hidden": "true" }),
    h(
      "span",
      { class: "brand-copy" },
      h("span", { class: "brand-name", text: "Lumen" }),
      h("span", { class: "brand-product", text: "Operations" }),
    ),
  );

  const sideNav = h("rowan-side-nav", { label: "Pages" });
  for (const section of NAV) {
    const group = h("rowan-side-nav-section", { label: section.label });
    for (const item of section.items) {
      const navItem = h("rowan-side-nav-item", {
        value: item.value,
        href: item.href,
        label: item.label,
      });
      navItem.append(icon(item.icon, "prefix"), item.label);
      if (item.count) navItem.dataset.countItem = "orders";
      group.append(navItem);
    }
    sideNav.append(group);
  }

  const note = h("p", {
    class: "nav-note",
    text: "Sample wholesale data. Refresh resets edits.",
  });
  navigation.append(brand, sideNav, note);
  main.append(outlet);
  layout.append(header, navigation, main);

  const palette = h("rowan-command-palette", {
    label: "Search Lumen",
    placeholder: "Orders, customers, pages",
    hotkey: "mod+k",
    "empty-label": "No matching commands",
  });
  const commands = [
    ["overview", "Overview", "Go to the dashboard", "pages"],
    ["orders", "Orders", "Open the orders table", "pages"],
    ["customers", "Customers", "Open accounts", "pages"],
    ["map", "Fulfillment map", "Warehouses and showrooms", "pages"],
    ["settings", "Settings", "Workspace preferences", "pages"],
    ["theme", "Toggle theme", "Switch light and dark", "workspace"],
    ["sign-in", "Sign-in screen", "Static sign-in preview", "account"],
  ];
  for (const [value, label, description, group] of commands) {
    palette.append(
      h(
        "rowan-command-item",
        { value, label, description, keywords: `${label} ${description}`, group },
        label,
      ),
    );
  }

  function paintTheme() {
    const dark = getTheme() === "dark";
    themeButton.icon = dark ? "sun" : "moon";
    themeButton.label = dark ? "Switch to light theme" : "Switch to dark theme";
    themeTooltip.text = themeButton.label;
  }

  function paintNotifications() {
    notifyPanel.replaceChildren();
    const unread = store.notifications.filter((item) => item.unread).length;
    notifyCount.hidden = unread === 0;
    notifyCount.textContent = String(unread);
    notifyTrigger.label = unread ? `Notifications, ${unread} unread` : "Notifications";

    if (store.notifications.length === 0) {
      notifyPanel.append(h("p", { class: "notify-empty", text: "You're caught up." }));
      return;
    }

    for (const item of store.notifications) {
      const row = h("button", {
        class: "notify-item",
        type: "button",
        "data-unread": item.unread ? "true" : "false",
      });
      row.append(h("strong", { text: item.title }), h("span", { text: item.body }));
      row.addEventListener("click", () => {
        item.unread = false;
        notifyDrop.open = false;
        paintNotifications();
        navigate(item.href);
      });
      notifyPanel.append(row);
    }
  }

  function paintOrderCount() {
    const count = holdCount(store);
    const item = sideNav.querySelector('[data-count-item="orders"]');
    if (!item) return;
    item.count = count > 0 ? count : null;
    item.countLabel = count > 0 ? `${count} on hold` : "";
  }

  paintTheme();
  paintNotifications();
  paintOrderCount();

  search.addEventListener("click", () => {
    palette.show();
    requestAnimationFrame(() => palette.focusSearch());
  });
  themeButton.addEventListener("rowan-click", () => {
    toggleTheme();
  });
  window.addEventListener("rowan-admin-theme", paintTheme);
  menu.addEventListener("rowan-change", (event) => {
    userDrop.open = false;
    const value = event.detail?.value;
    if (value === "settings") navigate("#/settings");
    if (value === "sign-in" || value === "sign-out") navigate("#/sign-in");
  });
  palette.addEventListener("rowan-command", (event) => {
    const value = event.detail?.value;
    if (value === "theme") {
      toggleTheme();
      toaster.show({ title: "Theme", message: `Using ${getTheme()} tokens.`, tone: "info" });
      return;
    }
    const target = {
      overview: "#/",
      orders: "#/orders",
      customers: "#/customers",
      map: "#/map",
      settings: "#/settings",
      "sign-in": "#/sign-in",
    }[value];
    if (target) navigate(target);
  });

  return {
    layout,
    palette,
    outlet,
    sideNav,
    setNav(value) {
      sideNav.value = value || "";
      paintOrderCount();
    },
    closeNav() {
      layout.navigationOpen = false;
    },
    refreshChrome() {
      paintNotifications();
      paintOrderCount();
    },
  };
}
