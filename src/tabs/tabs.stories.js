import "./tabs.js";
import "../tab/tab.js";
import "../tab-panel/tab-panel.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Tabs",
  tags: ["autodocs"],
};

const createTabs = () => {
  const tabs = document.createElement("rowan-tabs");
  tabs.value = "overview";

  const items = [
    { value: "overview", label: "Overview", content: "Overview content." },
    { value: "settings", label: "Settings", content: "Settings content." },
  ];

  for (const item of items) {
    const tab = document.createElement("rowan-tab");
    tab.value = item.value;
    tab.textContent = item.label;
    tabs.append(tab);

    const panel = document.createElement("rowan-tab-panel");
    panel.value = item.value;
    panel.textContent = item.content;
    tabs.append(panel);
  }

  return tabs;
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click a tab to switch the active panel."],
    events: ["rowan-change"],
  }),
  render: () => createTabs(),
};
