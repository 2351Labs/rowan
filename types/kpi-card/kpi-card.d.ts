/**
 * Experimental dashboard stat tile. Value and delta stay property-only.
 * @tag rowan-kpi-card
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {string} delta-label
 * @attr {boolean} loading
 * @property {number | string | null} value - Displayed metric. Property-only.
 * @property {number | null} delta - Signed change. Property-only. Null hides the delta.
 * @slot icon - Optional leading icon
 * @slot - Description or extra copy
 * @slot chart - Optional compact chart
 * @csspart card
 * @csspart icon
 * @csspart body
 * @csspart label
 * @csspart value
 * @csspart delta
 * @csspart description
 * @csspart chart
 * @cssprop --rowan-kpi-card-bg
 * @cssprop --rowan-kpi-card-border
 * @cssprop --rowan-kpi-card-fg
 */
export class RowanKpiCard extends BaseElement {
    /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger" | "neutral");
    /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger" | "neutral";
    set label(value: string);
    get label(): string;
    set deltaLabel(value: string);
    get deltaLabel(): string;
    set loading(value: boolean);
    get loading(): boolean;
    /** @param {number | string | null} value */
    set value(value: string | number | null);
    /** @returns {number | string | null} */
    get value(): string | number | null;
    /** @param {number | null} value */
    set delta(value: number | null);
    /** @returns {number | null} */
    get delta(): number | null;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
