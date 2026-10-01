/** @typedef {{ stepLabel?: string }} RowanStepperMessages */
/**
 * Progress step tracker for multi-step workflows.
 * @tag rowan-stepper
 * @attr {number} current-step
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {string} steps
 * @attr {boolean} disabled
 * @property {RowanStepperMessages} messages - Property-only built-in message overrides.
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
  set steps(value: any);
  get steps(): any;
  /** @param {RowanStepperMessages | null | undefined} value */
  set messages(value: RowanStepperMessages | null | undefined);
  /** @returns {RowanStepperMessages} */
  get messages(): RowanStepperMessages;
  set disabled(value: boolean);
  get disabled(): boolean;
  next(): void;
  previous(): void;
  goTo(stepNumber: any): void;
  #private;
}
export type RowanStepperMessages = {
  stepLabel?: string;
};
import { BaseElement } from "../lib/base-element.js";
