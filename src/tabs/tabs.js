import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../tab/tab.js";
import "../tab-panel/tab-panel.js";

/**
 * Tabs controller for tab and tab-panel children.
 * @tag rowan-tabs
 * @attr {string} value
 * @slot - rowan-tab and rowan-tab-panel nodes
 * @csspart tabs
 * @event rowan-change - Fired when active tab changes
 */
export class RowanTabs extends BaseElement {
  static styleUrl = new URL("./tabs.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["value"];
  static upgradeProperties = ["value"];

  #slot = null;

  connectedCallback() {
    super.connectedCallback();

    this.listen(this, "click", (event) => {
      const tab = event
        .composedPath()
        .find((node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-tab");

      if (!tab || !tab.value) return;

      if (this.value !== tab.value) {
        this.value = tab.value;
        emit(this, "rowan-change", {
          value: this.value,
          tab,
        });
      }
    });
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
    }

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "tablist";
    }

    const assigned = this.#slot.assignedElements({ flatten: true });
    const tabs = assigned.filter(
      (node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-tab",
    );
    const panels = assigned.filter(
      (node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "rowan-tab-panel",
    );

    const fallback = tabs[0] && tabs[0].value ? tabs[0].value : "";
    const current = this.value || fallback;

    tabs.forEach((tab) => {
      tab.active = tab.value === current;
    });

    panels.forEach((panel) => {
      panel.active = panel.value === current;
    });
  }
}

define("rowan-tabs", RowanTabs);
