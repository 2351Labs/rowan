import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const STATES = new Set(["ready", "loading", "empty", "error"]);
const DEFAULT_MESSAGES = Object.freeze({
  empty: "No data",
  error: "Couldn't load this data",
  loading: "Loading",
});

/**
 * @typedef {object} RowanDataStateMessages
 * @property {string} [empty]
 * @property {string} [error]
 * @property {string} [loading]
 */

/**
 * Region wrapper for ready, loading, empty, and error chrome.
 * Table and KPI keep their own loading. Does not fetch data.
 * @tag rowan-data-state
 * @attr {"ready"|"loading"|"empty"|"error"} state
 * @property {RowanDataStateMessages} messages - Property-only fallback copy overrides.
 * @slot - Ready content
 * @slot loading
 * @slot empty
 * @slot error
 * @slot actions - Retry or empty actions. Shown for empty and error.
 * @csspart ready
 * @csspart loading
 * @csspart empty
 * @csspart error
 * @csspart actions
 */
export class RowanDataState extends BaseElement {
  static styleUrl = new URL("./data-state.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["state"];
  static upgradeProperties = ["state", "messages"];

  #panels = null;
  #actions = null;
  #fallbacks = null;
  #messages = {};

  /** @returns {"ready" | "loading" | "empty" | "error"} */
  get state() {
    return normalizeEnum(this.readString("state", "ready"), STATES, "ready");
  }

  /** @param {"ready" | "loading" | "empty" | "error"} value */
  set state(value) {
    reflectEnum(this, "state", value, STATES, "ready");
  }

  /** @returns {RowanDataStateMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanDataStateMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "state" && rewriteEnumAttribute(this, name, newValue, STATES, "ready")) return;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    if (!this.#panels) {
      this.renderRoot.innerHTML = `
        <div class="stack">
          <div class="panel" data-state="ready" part="ready"><slot></slot></div>
          <div class="panel" data-state="loading" part="loading" hidden>
            <slot name="loading"><span class="fallback"></span></slot>
          </div>
          <div class="panel" data-state="empty" part="empty" hidden>
            <slot name="empty"><span class="fallback"></span></slot>
          </div>
          <div class="panel" data-state="error" part="error" hidden>
            <slot name="error"><span class="fallback"></span></slot>
          </div>
          <div class="actions" part="actions" hidden><slot name="actions"></slot></div>
        </div>
      `;
      this.#panels = {
        ready: this.renderRoot.querySelector('[data-state="ready"]'),
        loading: this.renderRoot.querySelector('[data-state="loading"]'),
        empty: this.renderRoot.querySelector('[data-state="empty"]'),
        error: this.renderRoot.querySelector('[data-state="error"]'),
      };
      this.#actions = this.renderRoot.querySelector(".actions");
      this.#fallbacks = {
        empty: this.#panels.empty.querySelector(".fallback"),
        error: this.#panels.error.querySelector(".fallback"),
        loading: this.#panels.loading.querySelector(".fallback"),
      };
    }

    for (const [key, fallback] of Object.entries(this.#fallbacks)) {
      fallback.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, key);
    }

    const state = this.state;
    for (const [name, panel] of Object.entries(this.#panels)) {
      const active = name === state;
      panel.hidden = !active;
      panel.inert = !active;
    }

    const showActions = state === "empty" || state === "error";
    this.#actions.hidden = !showActions;
    this.#actions.inert = !showActions;
    this.#applyDefaultA11y(state);
  }

  #applyDefaultA11y(state) {
    if (!this.internals) return;

    if (!this.hasAttribute("aria-busy") && "ariaBusy" in this.internals) {
      this.internals.ariaBusy = state === "loading" ? "true" : "false";
    }

    if (state === "loading") this.#panels.loading.setAttribute("role", "status");
    else this.#panels.loading.removeAttribute("role");

    if (state === "error") this.#panels.error.setAttribute("role", "alert");
    else this.#panels.error.removeAttribute("role");
  }
}

define("rowan-data-state", RowanDataState);
