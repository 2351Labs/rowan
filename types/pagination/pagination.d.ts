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
    set page(value: number);
    get page(): number;
    set totalPages(value: number);
    get totalPages(): number;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
