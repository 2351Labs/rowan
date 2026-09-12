import "./side-nav.js";
import "../side-nav-item/side-nav-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createSideNav({ value = "overview" } = {}) {
  const nav = document.createElement("rowan-side-nav");
  nav.label = "Workspace navigation";
  nav.value = value;

  for (const [itemValue, label] of [
    ["overview", "Overview"],
    ["activity", "Activity"],
    ["members", "Members"],
    ["settings", "Settings"],
  ]) {
    const item = document.createElement("rowan-side-nav-item");
    item.href = `#${itemValue}`;
    item.value = itemValue;
    item.textContent = label;
    nav.append(item);
  }

  return nav;
}

export default {
  title: "Components/Side Navigation",
  tags: ["autodocs"],
  args: { value: "overview" },
  argTypes: {
    value: {
      control: "select",
      options: ["overview", "activity", "members", "settings"],
    },
  },
};

export const Workspace = {
  parameters: createEventScriptParameters({
    steps: ["Use Arrow keys to move the navigation tab stop, then Enter to activate an item."],
    events: ["rowan-change"],
  }),
  render: (args) => createSideNav(args),
};
