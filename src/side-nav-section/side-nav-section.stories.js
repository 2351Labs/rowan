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
    nav.value = "invexus-overview";

    const invexus = document.createElement("rowan-side-nav-section");
    invexus.label = "Invexus";
    invexus.append(createItem("invexus-overview", "Overview"), createItem("invexus-jobs", "Jobs"));

    const ptms = document.createElement("rowan-side-nav-section");
    ptms.label = "PTMS";
    ptms.append(createItem("ptms-overview", "Overview"), createItem("ptms-routes", "Routes"));

    nav.append(invexus, ptms);
    return nav;
  },
};
