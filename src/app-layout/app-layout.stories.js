import "./app-layout.js";
import "../button/button.js";
import "../side-nav/side-nav.js";
import "../side-nav-item/side-nav-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createNavigation() {
  const navigation = document.createElement("rowan-side-nav");
  navigation.label = "Project navigation";

  for (const [value, label] of [
    ["overview", "Overview"],
    ["activity", "Activity"],
    ["members", "Members"],
    ["settings", "Settings"],
  ]) {
    const item = document.createElement("rowan-side-nav-item");
    item.value = value;
    item.href = `#${value}`;
    item.textContent = label;
    item.active = value === "overview";
    navigation.append(item);
  }

  return navigation;
}

function createAppLayout({ navigationOpen = false } = {}) {
  const layout = document.createElement("rowan-app-layout");
  layout.navigationOpen = navigationOpen;
  layout.style.blockSize = "34rem";
  layout.style.border = "1px solid var(--rowan-color-border)";
  layout.style.borderRadius = "var(--rowan-radius-md)";
  layout.style.overflow = "hidden";

  const header = document.createElement("div");
  header.slot = "header";
  header.style.alignItems = "center";
  header.style.display = "flex";
  header.style.gap = "var(--rowan-space-3)";
  header.style.inlineSize = "100%";

  const title = document.createElement("strong");
  title.textContent = "Northstar";
  const action = document.createElement("rowan-button");
  action.size = "sm";
  action.style.marginInlineStart = "auto";
  action.textContent = "New project";
  header.append(title, action);

  const navigation = createNavigation();
  navigation.slot = "navigation";

  const content = document.createElement("section");
  const heading = document.createElement("h2");
  heading.style.margin = "0";
  heading.textContent = "Project overview";
  const copy = document.createElement("p");
  copy.style.color = "var(--rowan-color-muted)";
  copy.style.maxInlineSize = "48rem";
  copy.textContent =
    "A slot-driven application shell for durable navigation and focused workspace content.";
  content.append(heading, copy);

  layout.append(header, navigation, content);
  return layout;
}

export default {
  title: "Components/App Layout",
  tags: ["autodocs"],
  args: { navigationOpen: false },
  argTypes: { navigationOpen: { control: "boolean" } },
};

export const Workspace = {
  parameters: createEventScriptParameters({
    steps: ["At compact widths, use the menu control to open or close navigation."],
    events: ["rowan-change"],
  }),
  render: (args) => createAppLayout(args),
};
