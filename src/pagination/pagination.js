import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../button/button.js";

/**
 * Pagination controls.
 * @tag rowan-pagination
 * @attr {number} page
 * @attr {number} total-pages
 * @slot - Optional custom label
 * @csspart container
 * @event rowan-page-change - Fired when page changes
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

      if (button.dataset.action === "prev") this.#setPage(this.page - 1);
      if (button.dataset.action === "next") this.#setPage(this.page + 1);
    });
  }

  get page() {
    return this.readNumber("page", 1);
  }

  set page(value) {
    this.reflectNumber("page", value);
  }

  get totalPages() {
    return this.readNumber("total-pages", 1);
  }

  set totalPages(value) {
    this.reflectNumber("total-pages", value);
  }

  #setPage(value) {
    const max = Math.max(1, this.totalPages || 1);
    const next = Math.max(1, Math.min(max, Number(value) || 1));
    if (next === this.page) return;

    this.page = next;
    emit(this, "rowan-page-change", {
      index: next,
      size: null,
    });
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

    const page = Math.max(1, this.page || 1);
    const total = Math.max(1, this.totalPages || 1);
    const status = this.renderRoot.querySelector(".status");
    status.textContent = `Page ${Math.min(page, total)} of ${total}`;

    const prev = this.renderRoot.querySelector('button[data-action="prev"]');
    const next = this.renderRoot.querySelector('button[data-action="next"]');
    prev.disabled = page <= 1;
    next.disabled = page >= total;
  }
}

define("rowan-pagination", RowanPagination);
