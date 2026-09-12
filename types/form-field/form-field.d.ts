/**
 * Accessible label, support text, and error composition for a form control.
 * @tag rowan-form-field
 * @attr {string} label
 * @attr {string} hint
 * @attr {string} description
 * @attr {string} error
 * @attr {string} for
 * @attr {"top"|"start"} label-position
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @slot - A direct form control or grouped control
 * @slot label - Replaces the label attribute
 * @slot hint - Replaces the hint attribute
 * @slot description - Replaces the description attribute
 * @slot error - Replaces the error attribute
 * @slot actions - Supplemental actions beside the label
 * @csspart field
 * @csspart label-row
 * @csspart label
 * @csspart required-indicator
 * @csspart control
 * @csspart support
 * @csspart hint
 * @csspart description
 * @csspart error
 * @csspart actions
 * @cssprop --rowan-form-field-label-fg
 * @cssprop --rowan-form-field-hint-fg
 * @cssprop --rowan-form-field-error-fg
 */
export class RowanFormField extends BaseElement {
    static componentTokenPrefixes: string[];
    set label(value: string);
    get label(): string;
    set hint(value: string);
    get hint(): string;
    set description(value: string);
    get description(): string;
    set error(value: string);
    get error(): string;
    set htmlFor(value: string);
    get htmlFor(): string;
    set labelPosition(value: "start" | "top");
    get labelPosition(): "start" | "top";
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
