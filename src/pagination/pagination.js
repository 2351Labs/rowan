import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../button/button.js";

function positiveInteger(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
}

/**
 * Pagination controls.
 * @tag rowan-pagination
 * @attr {number} page
 * @attr {number} total-pages
 * @slot - Optional custom label
 * @csspart container
 * @event rowan-page-change - Fired when the page changes. `detail.index` is 0-based; `detail.page` is 1-based.
 */
export class RowanPagination extends BaseElement {
  static styleUrl = new URL("./pagination.css", import.meta.url).href;
  static observedAttributes = ["page", "total-pages"];
  static upgradeProperties = ["page", "totalPages"];

  #container = null;
  #removeClickListener = null;

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
        <nav class="container" part="container" aria-label="Pagination">
          <button data-action="prev" type="button">Previous</button>
          <span class="status"></span>
          <button data-action="next" type="button">Next</button>
        </nav>
      `;
      this.#container = this.renderRoot.querySelector(".container");
    }

    const { page, total } = this.#pageState();
    if (this.page !== page) this.page = page;

    const status = this.renderRoot.querySelector(".status");
    status.textContent = `Page ${page} of ${total}`;

    const prev = this.renderRoot.querySelector('button[data-action="prev"]');
    const next = this.renderRoot.querySelector('button[data-action="next"]');
    prev.disabled = page <= 1;
    next.disabled = page >= total;
  }
}

define("rowan-pagination", RowanPagination);
