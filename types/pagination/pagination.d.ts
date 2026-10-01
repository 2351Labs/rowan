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
  set page(value: number);
  get page(): number;
  set totalPages(value: number);
  get totalPages(): number;
  /** @param {RowanPaginationMessages | null | undefined} value */
  set messages(value: RowanPaginationMessages | null | undefined);
  /** @returns {RowanPaginationMessages} */
  get messages(): RowanPaginationMessages;
  #private;
}
export type RowanPaginationMessages = {
  navigationLabel?: string | ((context: { page: number; total: number }) => string) | undefined;
  previousPage?: string | ((context: { page: number; total: number }) => string) | undefined;
  nextPage?: string | ((context: { page: number; total: number }) => string) | undefined;
  /**
   * Supports `{page}` and `{total}` placeholders.
   */
  pageStatus?: string | ((context: { page: number; total: number }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
