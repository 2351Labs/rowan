import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const DEFAULT_MESSAGES = Object.freeze({
  navigationLabel: "Breadcrumb",
});

/** @typedef {{ navigationLabel?: string }} RowanBreadcrumbMessages */

/**
 * Breadcrumb navigation wrapper.
 * @tag rowan-breadcrumb
 * @property {RowanBreadcrumbMessages} messages - Property-only built-in message overrides.
 * @slot - Breadcrumb items
 * @csspart nav
 */
export class RowanBreadcrumb extends BaseElement {
  static styleUrl = new URL("./breadcrumb.css", import.meta.url).href;
  static upgradeProperties = ["messages"];

  #messages = {};

  /** @returns {RowanBreadcrumbMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanBreadcrumbMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  render() {
    if (!this.renderRoot.firstElementChild) {
      this.renderRoot.innerHTML = '<nav class="nav" part="nav"><slot></slot></nav>';
    }

    this.renderRoot.firstElementChild.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "navigationLabel"),
    );
  }
}

define("rowan-breadcrumb", RowanBreadcrumb);
