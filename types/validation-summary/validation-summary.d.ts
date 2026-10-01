/**
 * Renders a navigable summary of validation errors.
 * @tag rowan-validation-summary
 * @attr {string} heading
 * @attr {string} for-form
 * @attr {boolean} disabled
 * @property {RowanValidationSummaryMessages} messages - Property-only built-in message overrides.
 * @slot heading
 * @slot empty
 * @csspart summary
 * @csspart heading
 * @csspart list
 * @csspart item
 * @csspart error-button
 * @csspart empty
 * @event rowan-jump - Fired when a user activates an error target
 */
export class RowanValidationSummary extends BaseElement {
  set heading(value: string);
  get heading(): string;
  set forForm(value: string);
  get forForm(): string;
  set disabled(value: boolean);
  get disabled(): boolean;
  /** @param {RowanValidationSummaryMessages | null | undefined} value */
  set messages(value: RowanValidationSummaryMessages | null | undefined);
  /** @returns {RowanValidationSummaryMessages} */
  get messages(): RowanValidationSummaryMessages;
  set errors(value: any[]);
  get errors(): any[];
  collectFromForm(): any[];
  #private;
}
export type RowanValidationSummaryMessages = {
  empty?: string | undefined;
  errorItem?: string | ((context: { index: number; message: string }) => string) | undefined;
  fieldInvalid?:
    string | ((context: { fieldId: string; index: number; label: string }) => string) | undefined;
  heading?: string | undefined;
  unnamedField?: string | ((context: { index: number }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
