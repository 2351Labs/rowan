import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";

import "./elements.js";
import "./icons.js";
import "./styles.css";

import { createStore } from "./api.js";
import { h } from "./dom.js";
import { renderSignIn, renderForgot, renderSignUp } from "./pages/auth.js";
import { renderCustomerDetail } from "./pages/customer-detail.js";
import { renderCustomers } from "./pages/customers.js";
import { renderNotFound } from "./pages/not-found.js";
import { renderOrderDetail } from "./pages/order-detail.js";
import { renderOrders } from "./pages/orders.js";
import { renderOverview } from "./pages/overview.js";
import { renderSettings } from "./pages/settings.js";
import { createRouter } from "./router.js";
import { createShell } from "./shell.js";
import { initTheme } from "./theme.js";

initTheme();

const store = createStore();
const app = document.querySelector("#app");
const toaster = h("rowan-toaster", { placement: "top-end" });
toaster.duration = 4800;

const routes = [
  {
    name: "overview",
    pattern: /^\/$/,
    nav: "overview",
    title: "Overview",
    shell: true,
    render: renderOverview,
  },
  {
    name: "orders",
    pattern: /^\/orders$/,
    nav: "orders",
    title: "Orders",
    shell: true,
    render: renderOrders,
  },
  {
    name: "order",
    pattern: /^\/orders\/([^/]+)$/,
    nav: "orders",
    title: "Order",
    shell: true,
    render: renderOrderDetail,
  },
  {
    name: "customers",
    pattern: /^\/customers$/,
    nav: "customers",
    title: "Customers",
    shell: true,
    render: renderCustomers,
  },
  {
    name: "customer",
    pattern: /^\/customers\/([^/]+)$/,
    nav: "customers",
    title: "Customer",
    shell: true,
    render: renderCustomerDetail,
  },
  {
    name: "settings",
    pattern: /^\/settings$/,
    nav: "settings",
    title: "Settings",
    shell: true,
    render: renderSettings,
  },
  {
    name: "map",
    pattern: /^\/map$/,
    nav: "map",
    title: "Fulfillment map",
    shell: true,
    load: () => import("./pages/map.js").then((module) => module.renderMap),
  },
  { name: "sign-in", pattern: /^\/sign-in$/, title: "Sign in", shell: false, render: renderSignIn },
  {
    name: "sign-up",
    pattern: /^\/sign-up$/,
    title: "Create account",
    shell: false,
    render: renderSignUp,
  },
  {
    name: "forgot",
    pattern: /^\/forgot-password$/,
    title: "Reset password",
    shell: false,
    render: renderForgot,
  },
  { name: "not-found", pattern: /^$/, title: "Not found", shell: true, render: renderNotFound },
];

const shell = createShell({
  store,
  toaster,
  navigate: (path) => router.navigate(path),
});
const authRoot = h("div", { id: "auth", hidden: true, tabindex: "-1" });
app.append(toaster, shell.palette, shell.layout, authRoot);

let controller = new AbortController();
let token = 0;

async function onRoute(state) {
  token += 1;
  const current = token;
  controller.abort();
  controller = new AbortController();

  const route = state.route;
  document.title = `${route.title} · Lumen`;
  const skip = document.querySelector(".skip");
  const context = {
    store,
    navigate: (path) => router.navigate(path),
    toaster,
    signal: controller.signal,
    params: state.params,
    shell,
  };

  if (route.shell) {
    shell.layout.hidden = false;
    authRoot.hidden = true;
    if (skip) skip.href = "#main";
    shell.setNav(route.nav);
    shell.closeNav();
    shell.outlet.replaceChildren();
    const render = route.render || (await route.load());
    if (current !== token) return;
    await render(shell.outlet, context);
    if (current !== token) return;
    shell.outlet.querySelector("h1")?.focus();
    return;
  }

  shell.layout.hidden = true;
  authRoot.hidden = false;
  shell.outlet.replaceChildren();
  if (skip) skip.href = "#auth";
  authRoot.replaceChildren();
  await route.render(authRoot, context);
  if (current !== token) return;
  authRoot.querySelector("h1")?.focus();
}

const router = createRouter(routes, onRoute);
router.start();
