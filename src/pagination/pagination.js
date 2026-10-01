import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

import "../button/button.js";

function positiveInteger(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
}

const DEFAULT_MESSAGES = Object.freeze({
  navigationLabel: "Pagination",
  previousPage: "Previous",
  nextPage: "Next",
  pageStatus: "Page {page} of {total}",
});

/**
 * @typedef {object} RowanPaginationMessages
 * @property {string | ((context: { page: number, total: number }) => string)} [navigationLabel]
 * @property {string | ((context: { page: number, total: number }) => string)} [previousPage]
 * @property {string | ((context: { page: number, total: number }) => string)} [nextPage]
 * @property {string | ((context: { page: number, total: number }) => string)} [pageStatus] Supports `{page}` and `{total}` placeholders.
 */

/**
 * Pagination controls.
 * @tag rowan-pagination
 * @attr {number} page
 * @attr {number} total-pages
 * @property {RowanPaginationMessages} messages - Property-only built-in message overrides.
 * @slot - Optional custom label
 * @csspart container
 * @event rowan-page-change - Fired when the page changes. `detail.index` is 0-based; `detail.page` is 1-based.
 */
export class RowanPagination extends BaseElement {
  static styleUrl = new URL("./pagination.css", import.meta.url).href;
  static observedAttributes = ["page", "total-pages"];
  static upgradeProperties = ["page", "totalPages", "messages"];

  #container = null;
  #removeClickListener = null;
  #messages = {};

  connectedCallback() {
    super.connectedCallback();

    if (this.#removeClickListener) return;

    this.#removeClickListener = this.listen(this, "click", (event) => {
      const button = event
        .composedPath()
        .find((node) => node instanceof HTMLElement && node.matches("button[data-action]"));
      if (!button) return;

      const { page } = this.#pageState();
      if (button.dataset.action === "prev") this.#setPage(page - 1);
      if (button.dataset.action === "next") this.#setPage(page + 1);
    });
  }

  get page() {
    return positiveInteger(this.readNumber("page", 1));
  }

  set page(value) {
    this.reflectNumber("page", positiveInteger(value));
  }

  get totalPages() {
    return positiveInteger(this.readNumber("total-pages", 1));
  }

  set totalPages(value) {
    this.reflectNumber("total-pages", positiveInteger(value));
  }

  /** @returns {RowanPaginationMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanPaginationMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  #setPage(value) {
    const { page, total } = this.#pageState();
    const next = Math.max(1, Math.min(total, positiveInteger(value)));
    if (this.page !== page) this.page = page;
    if (next === page) return;

    this.page = next;
    emit(this, "rowan-page-change", {
      index: next - 1,
      page: next,
      size: null,
    });
  }

  #pageState() {
    const total = this.totalPages;
    return {
      page: Math.min(this.page, total),
      total,
    };
  }

  render() {
    if (!this.#container) {
      this.renderRoot.innerHTML = `
        <nav class="container" part="container">
          <button data-action="prev" type="button"></button>
          <slot><span class="status" aria-live="polite"></span></slot>
          <button data-action="next" type="button"></button>
        </nav>
      `;
      this.#container = this.renderRoot.querySelector(".container");
    }

    const { page, total } = this.#pageState();
    if (this.page !== page) this.page = page;

    const status = this.renderRoot.querySelector(".status");
    const context = { page, total };
    status.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "pageStatus", context);

    const prev = this.renderRoot.querySelector('button[data-action="prev"]');
    const next = this.renderRoot.querySelector('button[data-action="next"]');
    this.#container.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "navigationLabel", context),
    );
    prev.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "previousPage", context);
    next.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "nextPage", context);
    prev.disabled = page <= 1;
    next.disabled = page >= total;
  }
}

define("rowan-pagination", RowanPagination);
