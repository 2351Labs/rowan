import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { RowanTab } from "../tab/tab.js";
import { RowanTabPanel } from "../tab-panel/tab-panel.js";

function isTab(value) {
  return value instanceof RowanTab;
}

function isTabPanel(value) {
  return value instanceof RowanTabPanel;
}

/**
 * Tabs controller for tab and tab-panel children.
 * @tag rowan-tabs
 * @attr {string} value
 * @slot - rowan-tab and rowan-tab-panel nodes
 * @csspart tabs
 * @event rowan-change - Fired when a user activates a different tab
 */
export class RowanTabs extends BaseElement {
  static styleUrl = new URL("./tabs.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value"];
  static upgradeProperties = ["value"];

  #slot = null;
  #focusTab = null;
  #childObserver = null;
  #managedTabs = new Set();
  #managedPanels = new Set();
  #removeClickListener = null;
  #removeKeydownListener = null;
  #removeFocusListener = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#removeClickListener) {
      this.#removeClickListener = this.listen(this, "click", (event) => this.#handleClick(event));
    }

    if (!this.#removeKeydownListener) {
      this.#removeKeydownListener = this.listen(this, "keydown", (event) =>
        this.#handleKeydown(event),
      );
    }

    if (!this.#removeFocusListener) {
      this.#removeFocusListener = this.listen(this, "focusin", (event) =>
        this.#handleFocusIn(event),
      );
    }

    if (!this.#childObserver && typeof MutationObserver !== "undefined") {
      this.#childObserver = new MutationObserver(() => this.requestRender());
      this.observe(this.#childObserver, () => this.#observeChildren());
    }

    this.#observeChildren();
  }

  disconnectedCallback() {
    this.#clearManagedChildren();
    super.disconnectedCallback();
  }

  get value() {
    return this.readString("value", "");
  }

  set value(value) {
    this.reflectString("value", value);
  }

  render() {
    if (!this.#slot) {
      this.renderRoot.innerHTML =
        '<div class="tabs" part="tabs"><slot></slot></div>';
      this.#slot = this.renderRoot.querySelector("slot");
      this.listen(this.#slot, "slotchange", () => this.requestRender());
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tablist";
    }

    const tabs = this.#tabs();
    const panels = this.#panels();
    this.#syncActiveState(tabs, panels);
    this.#syncRelationships(tabs, panels);
    this.#syncRovingTabIndex(tabs);
  }

  #observeChildren() {
    this.#childObserver?.observe(this, {
      attributes: true,
      attributeFilter: ["active", "hidden", "slot", "value"],
      childList: true,
      subtree: true,
    });
  }

  #tabs() {
    return this.#slot.assignedElements({ flatten: true }).filter((element) => isTab(element));
  }

  #panels() {
    return this.#slot.assignedElements({ flatten: true }).filter((element) => isTabPanel(element));
  }

  #availableTabs(tabs = this.#tabs()) {
    return tabs.filter((tab) => !tab.hidden);
  }

  #syncActiveState(tabs, panels) {
    const fallback = tabs[0]?.value ?? "";
    const current = this.value || fallback;

    for (const tab of tabs) {
      const active = Boolean(current) && tab.value === current;
      if (tab.active !== active) tab.active = active;
    }

    for (const panel of panels) {
      const active = Boolean(current) && panel.value === current;
      if (panel.active !== active) panel.active = active;
    }
  }

  #syncRovingTabIndex(tabs) {
    const managedTabs = new Set(tabs);
    const available = this.#availableTabs(tabs);

    for (const tab of this.#managedTabs) {
      if (!managedTabs.has(tab)) tab.setRovingTabIndex(null, this);
    }

    if (!available.includes(this.#focusTab)) {
      this.#focusTab = available.find((tab) => tab.active) ?? available[0] ?? null;
    }

    for (const tab of tabs) {
      tab.setRovingTabIndex(tab === this.#focusTab ? 0 : -1, this);
    }

    this.#managedTabs = managedTabs;
  }

  #syncRelationships(tabs, panels) {
    const managedPanels = new Set(panels);

    for (const tab of this.#managedTabs) {
      if (!tabs.includes(tab)) tab.setPanel(null, this);
    }

    for (const panel of this.#managedPanels) {
      if (!managedPanels.has(panel)) panel.setTab(null, this);
    }

    for (const tab of tabs) {
      tab.setPanel(panels.find((panel) => panel.value === tab.value) ?? null, this);
    }

    for (const panel of panels) {
      panel.setTab(tabs.find((tab) => tab.value === panel.value) ?? null, this);
    }

    this.#managedPanels = managedPanels;
  }

  #clearManagedChildren() {
    for (const tab of this.#managedTabs) {
      tab.setRovingTabIndex(null, this);
      tab.setPanel(null, this);
    }

    for (const panel of this.#managedPanels) {
      panel.setTab(null, this);
    }

    this.#managedTabs.clear();
    this.#managedPanels.clear();
    this.#focusTab = null;
  }

  #handleClick(event) {
    const tab = this.#tabFromEvent(event);
    if (tab) this.#activateTab(tab);
  }

  #handleFocusIn(event) {
    const tab = this.#tabFromEvent(event);
    if (!tab || tab.hidden || tab === this.#focusTab) return;

    this.#focusTab = tab;
    this.#syncRovingTabIndex(this.#tabs());
  }

  #handleKeydown(event) {
    const tabs = this.#availableTabs();
    const tab = this.#tabFromEvent(event) ?? this.#focusTab;
    const index = tabs.indexOf(tab);
    if (index === -1) return;

    if (event.key === keys.ARROW_RIGHT) {
      event.preventDefault();
      this.#setFocusTab(tabs[(index + 1) % tabs.length]);
      return;
    }

    if (event.key === keys.ARROW_LEFT) {
      event.preventDefault();
      this.#setFocusTab(tabs[(index - 1 + tabs.length) % tabs.length]);
      return;
    }

    if (event.key === keys.HOME) {
      event.preventDefault();
      this.#setFocusTab(tabs[0]);
      return;
    }

    if (event.key === keys.END) {
      event.preventDefault();
      this.#setFocusTab(tabs.at(-1));
      return;
    }

    if (event.key === keys.ENTER || event.key === keys.SPACE) {
      event.preventDefault();
      this.#activateTab(tab);
    }
  }

  #activateTab(tab) {
    if (!tab.value || tab.hidden) return;

    const previousValue = this.value;
    const changed = previousValue !== tab.value;
    this.#focusTab = tab;
    this.value = tab.value;
    this.#syncActiveState(this.#tabs(), this.#panels());
    this.#syncRovingTabIndex(this.#tabs());

    if (changed) {
      emit(this, "rowan-change", {
        value: tab.value,
        tab,
      });
    }
  }

  #setFocusTab(tab) {
    if (!tab) return;

    this.#focusTab = tab;
    this.#syncRovingTabIndex(this.#tabs());
    tab.focus({ preventScroll: true });
  }

  #tabFromEvent(event) {
    return (
      event
        .composedPath()
        .find((node) => node instanceof RowanTab && node.closest("rowan-tabs") === this) ?? null
    );
  }
}

define("rowan-tabs", RowanTabs);
