import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";

const STATES = new Set(["ready", "loading", "empty", "error"]);

/**
 * Region wrapper for ready, loading, empty, and error chrome.
 * Table and KPI keep their own loading. Does not fetch data.
 * @tag rowan-data-state
 * @attr {"ready"|"loading"|"empty"|"error"} state
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
  static upgradeProperties = ["state"];

  #panels = null;
  #actions = null;

  /** @returns {"ready" | "loading" | "empty" | "error"} */
  get state() {
    return normalizeEnum(this.readString("state", "ready"), STATES, "ready");
  }

  /** @param {"ready" | "loading" | "empty" | "error"} value */
  set state(value) {
    reflectEnum(this, "state", value, STATES, "ready");
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
            <slot name="loading"><span class="fallback">Loading</span></slot>
          </div>
          <div class="panel" data-state="empty" part="empty" hidden>
            <slot name="empty"><span class="fallback">No data</span></slot>
          </div>
          <div class="panel" data-state="error" part="error" hidden>
            <slot name="error"><span class="fallback">Couldn't load this data</span></slot>
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
