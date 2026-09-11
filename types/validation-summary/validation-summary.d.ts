/**
 * Renders a navigable summary of validation errors.
 * @tag rowan-validation-summary
 * @attr {string} heading
 * @attr {string} for-form
 * @attr {boolean} disabled
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
    set errors(value: any[]);
    get errors(): any[];
    collectFromForm(): any[];
    #private;
}
import { BaseElement } from "../lib/base-element.js";
