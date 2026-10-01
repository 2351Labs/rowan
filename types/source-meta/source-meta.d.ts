/**
 * @typedef {object} RowanSourceMetaMessages
 * @property {string} [asOf]
 */
/**
 * Provenance line for KPI description, chart description, or table caption.
 * Does not add fields to those frozen hosts.
 * @tag rowan-source-meta
 * @attr {string} source
 * @attr {string} as-of
 * @property {RowanSourceMetaMessages} messages - Property-only built-in message overrides.
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
  /** @param {RowanSourceMetaMessages | null | undefined} value */
  set messages(value: RowanSourceMetaMessages | null | undefined);
  /** @returns {RowanSourceMetaMessages} */
  get messages(): RowanSourceMetaMessages;
  #private;
}
export type RowanSourceMetaMessages = {
  asOf?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
