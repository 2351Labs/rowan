/**
 * Progress step tracker for multi-step workflows.
 * @tag rowan-stepper
 * @attr {number} current-step
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {string} steps
 * @attr {boolean} disabled
 * @csspart stepper
 * @csspart list
 * @csspart step
 * @csspart step-button
 * @csspart marker
 * @event rowan-step-change - Fired when a user activates a different step
 */
export class RowanStepper extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set currentStep(value: number);
    get currentStep(): number;
    set orientation(value: "vertical" | "horizontal");
    get orientation(): "vertical" | "horizontal";
    set steps(value: {
        id: string;
        label: string;
    }[]);
    get steps(): {
        id: string;
        label: string;
    }[];
    set disabled(value: boolean);
    get disabled(): boolean;
    next(): void;
    previous(): void;
    goTo(stepNumber: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
