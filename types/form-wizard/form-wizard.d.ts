/**
 * Guided multi-step form workflow with guarded validation and progress.
 * @tag rowan-form-wizard
 * @attr {number} current-step
 * @attr {string} steps
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {string} label
 * @attr {string} previous-label
 * @attr {string} next-label
 * @attr {string} complete-label
 * @attr {boolean} disabled
 * @slot - Single-step form content when no named step panels are used
 * @slot step-* - A named step panel matching a configured step id
 * @csspart wizard
 * @csspart progress
 * @csspart stepper
 * @csspart validation-summary
 * @csspart panels
 * @csspart panel
 * @csspart actions
 * @csspart previous-button
 * @csspart next-button
 * @cssprop --rowan-form-wizard-border
 * @cssprop --rowan-form-wizard-panel-bg
 * @event rowan-step-change - Fired when a user moves between steps
 * @event rowan-invalid - Fired when a user tries to leave an invalid step
 * @event rowan-complete - Fired when a user completes the final valid step
 */
export class RowanFormWizard extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set currentStep(value: number);
    get currentStep(): number;
    set steps(value: any[]);
    get steps(): any[];
    set orientation(value: "horizontal" | "vertical");
    get orientation(): "horizontal" | "vertical";
    set label(value: string);
    get label(): string;
    set previousLabel(value: string);
    get previousLabel(): string;
    set nextLabel(value: string);
    get nextLabel(): string;
    set completeLabel(value: string);
    get completeLabel(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    next(): boolean;
    previous(): boolean;
    goTo(stepNumber: any): boolean;
    complete(): boolean;
    validateCurrentStep(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
