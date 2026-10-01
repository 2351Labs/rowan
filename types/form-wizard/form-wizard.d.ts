/**
 * @typedef {object} RowanFormWizardMessages
 * @property {string} [completeLabel]
 * @property {string} [label]
 * @property {string} [nextLabel]
 * @property {string} [previousLabel]
 * @property {string | ((context: { step: number }) => string)} [stepLabel]
 * @property {string} [thisField]
 * @property {string} [validationEmpty]
 * @property {string | ((context: { index: number, message: string }) => string)} [validationErrorItem]
 * @property {string | ((context: { label: string }) => string)} [validationFieldInvalid]
 * @property {string} [validationHeading]
 * @property {string | ((context: { index: number }) => string)} [validationUnnamedField]
 */
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
 * @property {RowanFormWizardMessages} messages - Property-only built-in message overrides.
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
  set steps(
    value: {
      label: string;
      id: string;
      slot: any;
    }[],
  );
  get steps(): {
    label: string;
    id: string;
    slot: any;
  }[];
  set orientation(value: "vertical" | "horizontal");
  get orientation(): "vertical" | "horizontal";
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
  /** @param {RowanFormWizardMessages | null | undefined} value */
  set messages(value: RowanFormWizardMessages | null | undefined);
  /** @returns {RowanFormWizardMessages} */
  get messages(): RowanFormWizardMessages;
  next(): boolean;
  previous(): boolean;
  goTo(stepNumber: any): boolean;
  complete(): boolean;
  validateCurrentStep(): boolean;
  #private;
}
export type RowanFormWizardMessages = {
  completeLabel?: string | undefined;
  label?: string | undefined;
  nextLabel?: string | undefined;
  previousLabel?: string | undefined;
  stepLabel?: string | ((context: { step: number }) => string) | undefined;
  thisField?: string | undefined;
  validationEmpty?: string | undefined;
  validationErrorItem?:
    string | ((context: { index: number; message: string }) => string) | undefined;
  validationFieldInvalid?: string | ((context: { label: string }) => string) | undefined;
  validationHeading?: string | undefined;
  validationUnnamedField?: string | ((context: { index: number }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
