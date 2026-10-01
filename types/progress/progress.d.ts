/**
 * @typedef {object} RowanProgressMessages
 * @property {string | ((context: { label: string, value: string }) => string)} [labeledValueText]
 * @property {string} [progress]
 * @property {string | ((context: { value: string }) => string)} [valueText]
 */
/**
 * Determinate progress indicator.
 * @tag rowan-progress
 * @attr {number} value
 * @attr {number} max
 * @attr {string} label
 * @attr {boolean} hide-meta
 * @attr {string} locale
 * @property {RowanProgressMessages} messages - Property-only built-in message overrides.
 * @csspart progress
 * @csspart bar
 * @csspart meta
 */
export class RowanProgress extends BaseElement {
  set value(value: number);
  get value(): number;
  set max(value: number);
  get max(): number;
  set label(value: string);
  get label(): string;
  set hideMeta(value: boolean);
  get hideMeta(): boolean;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanProgressMessages | null | undefined} value */
  set messages(value: RowanProgressMessages | null | undefined);
  /** @returns {RowanProgressMessages} */
  get messages(): RowanProgressMessages;
  #private;
}
export type RowanProgressMessages = {
  labeledValueText?: string | ((context: { label: string; value: string }) => string) | undefined;
  progress?: string | undefined;
  valueText?: string | ((context: { value: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
