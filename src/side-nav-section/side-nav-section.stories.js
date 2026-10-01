import "./side-nav-section.js";
import "../side-nav/side-nav.js";
import "../side-nav-item/side-nav-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createItem(value, label) {
  const item = document.createElement("rowan-side-nav-item");
  item.value = value;
  item.textContent = label;
  return item;
}

export default {
  title: "Components/Navigation & Layout/Side Navigation Section",
  component: "rowan-side-nav-section",
  tags: ["autodocs"],
};

export const GroupedRail = {
  parameters: createEventScriptParameters({
    steps: ["Activate a destination in one section, then another. Only one item stays current."],
    events: ["rowan-change"],
  }),
  render: () => {
    const nav = document.createElement("rowan-side-nav");
    nav.label = "Products";
    nav.value = "customers-overview";

    const customers = document.createElement("rowan-side-nav-section");
    customers.label = "Customers";
    customers.append(
      createItem("customers-overview", "Overview"),
      createItem("customers-directory", "Directory"),
    );

    const orders = document.createElement("rowan-side-nav-section");
    orders.label = "Orders";
    orders.append(createItem("orders-overview", "Overview"), createItem("orders-open", "Open"));

    nav.append(customers, orders);
    return nav;
  },
};

export const Collapsible = {
  parameters: createEventScriptParameters({
    steps: [
      "Click Customers to collapse it. Destinations hide; the nav value does not change.",
      "Arrow Down from the section control focuses the first item when expanded.",
    ],
    events: ["rowan-toggle", "rowan-change"],
  }),
  render: () => {
    const nav = document.createElement("rowan-side-nav");
    nav.label = "Products";
    nav.value = "customers-overview";

    const customers = document.createElement("rowan-side-nav-section");
    customers.label = "Customers";
    customers.collapsible = true;
    customers.append(
      createItem("customers-overview", "Overview"),
      createItem("customers-directory", "Directory"),
    );

    const orders = document.createElement("rowan-side-nav-section");
    orders.label = "Orders";
    orders.collapsible = true;
    orders.collapsed = true;
    orders.append(createItem("orders-overview", "Overview"), createItem("orders-open", "Open"));

    nav.append(customers, orders);
    return nav;
  },
};
