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
  /** @param {"ready" | "loading" | "empty" | "error"} value */
  set state(value: "error" | "loading" | "ready" | "empty");
  /** @returns {"ready" | "loading" | "empty" | "error"} */
  get state(): "error" | "loading" | "ready" | "empty";
  /** @param {RowanDataStateMessages | null | undefined} value */
  set messages(value: RowanDataStateMessages | null | undefined);
  /** @returns {RowanDataStateMessages} */
  get messages(): RowanDataStateMessages;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanDataStateMessages = {
  empty?: string | undefined;
  error?: string | undefined;
  loading?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
