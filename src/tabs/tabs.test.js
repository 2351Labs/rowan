import { expect } from "@esm-bundle/chai";
import "./tabs.js";
import "../tab/tab.js";
import "../tab-panel/tab-panel.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-tabs", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("activates matching panel from value", async () => {
    const tabs = document.createElement("rowan-tabs");
    tabs.value = "settings";

    const overviewTab = document.createElement("rowan-tab");
    overviewTab.value = "overview";
    const settingsTab = document.createElement("rowan-tab");
    settingsTab.value = "settings";

    const overviewPanel = document.createElement("rowan-tab-panel");
    overviewPanel.value = "overview";
    const settingsPanel = document.createElement("rowan-tab-panel");
    settingsPanel.value = "settings";

    tabs.append(overviewTab, settingsTab, overviewPanel, settingsPanel);
    document.body.append(tabs);
    await nextMicrotask();

    expect(settingsTab.active).to.equal(true);
    expect(settingsPanel.active).to.equal(true);
    expect(overviewPanel.active).to.equal(false);
  });
});
