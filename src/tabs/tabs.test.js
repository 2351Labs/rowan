import { expect } from "@esm-bundle/chai";
import "./tabs.js";
import "../tab/tab.js";
import "../tab-panel/tab-panel.js";

const nextMicrotask = () => Promise.resolve();

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
};

function createTab(value, label) {
  const tab = document.createElement("rowan-tab");
  tab.value = value;
  tab.textContent = label;
  return tab;
}

function createPanel(value, content) {
  const panel = document.createElement("rowan-tab-panel");
  panel.value = value;
  panel.textContent = content;
  return panel;
}

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

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

  it("uses roving focus and activates tabs from the keyboard", async () => {
    const tabs = document.createElement("rowan-tabs");
    const overviewTab = createTab("overview", "Overview");
    const settingsTab = createTab("settings", "Settings");
    const overviewPanel = createPanel("overview", "Overview content");
    const settingsPanel = createPanel("settings", "Settings content");
    tabs.append(overviewTab, settingsTab, overviewPanel, settingsPanel);
    document.body.append(tabs);
    await settle();

    const overviewButton = overviewTab.shadowRoot.querySelector("button");
    const settingsButton = settingsTab.shadowRoot.querySelector("button");
    expect(tabs.internals.role).to.equal("tablist");
    expect(tabs.shadowRoot.querySelector(".tabs").getAttribute("role")).to.equal("tablist");
    expect(overviewTab.internals.role).to.equal("tab");
    expect(overviewButton.getAttribute("role")).to.equal("tab");
    expect(overviewPanel.internals.role).to.equal("tabpanel");
    expect(overviewPanel.shadowRoot.querySelector(".panel").getAttribute("role")).to.equal(
      "tabpanel",
    );
    expect(overviewButton.tabIndex).to.equal(0);
    expect(settingsButton.tabIndex).to.equal(-1);
    if ("ariaControlsElements" in overviewTab.internals) {
      expect(Array.from(overviewTab.internals.ariaControlsElements)).to.deep.equal([overviewPanel]);
    }

    overviewButton.focus();
    keydown(overviewButton, "ArrowRight");
    await settle();
    expect(settingsTab.shadowRoot.activeElement).to.equal(settingsButton);
    expect(overviewTab.active).to.equal(true);
    expect(settingsTab.active).to.equal(false);

    let detail = null;
    tabs.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });
    keydown(settingsButton, "Enter");
    await settle();

    expect(tabs.value).to.equal("settings");
    expect(settingsTab.active).to.equal(true);
    expect(settingsPanel.active).to.equal(true);
    expect(settingsPanel.inert).to.equal(false);
    expect(overviewPanel.inert).to.equal(true);
    expect(detail).to.deep.equal({ value: "settings", tab: settingsTab });

    keydown(settingsButton, "Home");
    await settle();
    expect(overviewTab.shadowRoot.activeElement).to.equal(overviewButton);
    keydown(overviewButton, " ");
    await settle();
    expect(tabs.value).to.equal("overview");
  });

  it("reconciles selected tabs and relationships as slotted children change", async () => {
    const tabs = document.createElement("rowan-tabs");
    const overviewTab = createTab("overview", "Overview");
    const overviewPanel = createPanel("overview", "Overview content");
    tabs.append(overviewTab, overviewPanel);
    document.body.append(tabs);
    await settle();

    tabs.value = "activity";
    const activityTab = createTab("activity", "Activity");
    const activityPanel = createPanel("activity", "Activity content");
    tabs.append(activityTab, activityPanel);
    await settle();

    expect(activityTab.active).to.equal(true);
    expect(activityPanel.active).to.equal(true);

    activityPanel.remove();
    await settle();
    if ("ariaControlsElements" in activityTab.internals) {
      expect(Array.from(activityTab.internals.ariaControlsElements)).to.deep.equal([]);
    }
  });

  it("keeps parent-driven selection silent and emits one composed change for pointer activation", async () => {
    const tabs = document.createElement("rowan-tabs");
    const overviewTab = createTab("overview", "Overview");
    const settingsTab = createTab("settings", "Settings");
    tabs.append(overviewTab, settingsTab, createPanel("overview", "Overview"));
    tabs.append(createPanel("settings", "Settings"));
    document.body.append(tabs);
    await settle();

    const events = [];
    tabs.addEventListener("rowan-change", (event) => events.push(event));
    tabs.value = "settings";
    await settle();

    expect(settingsTab.active).to.equal(true);
    expect(events).to.have.length(0);

    overviewTab.shadowRoot.querySelector("button").click();
    await settle();

    expect(tabs.value).to.equal("overview");
    expect(events).to.have.length(1);
    expect(events[0].detail.value).to.equal("overview");
    expect(events[0].detail.tab === overviewTab).to.equal(true);
    expect(events[0].bubbles).to.equal(true);
    expect(events[0].composed).to.equal(true);
  });
});
