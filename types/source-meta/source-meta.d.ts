/**
 * Experimental provenance line for KPI description, chart description, or table caption.
 * Does not add fields to those frozen hosts.
 * @tag rowan-source-meta
 * @attr {string} source
 * @attr {string} as-of
 * @slot source - Replaces the source attribute.
 * @slot as-of - Replaces the as-of attribute.
 * @csspart meta
 * @csspart source
 * @csspart as-of
 */
export class RowanSourceMeta extends BaseElement {
    set source(value: string);
    get source(): string;
    set asOf(value: string);
    get asOf(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
