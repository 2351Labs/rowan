/**
 * Experimental region wrapper for ready, loading, empty, and error chrome.
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
    /** @param {"ready" | "loading" | "empty" | "error"} value */
    set state(value: "error" | "loading" | "ready" | "empty");
    /** @returns {"ready" | "loading" | "empty" | "error"} */
    get state(): "error" | "loading" | "ready" | "empty";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
