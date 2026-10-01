/** @typedef {{ closeLabel?: string, title?: string }} RowanDialogMessages */
/**
 * Modal dialog surface.
 * @tag rowan-dialog
 * @attr {boolean} open
 * @attr {boolean} alert
 * @property {RowanDialogMessages} messages - Property-only built-in message overrides.
 * @slot title
 * @slot - Content
 * @slot actions
 * @csspart overlay
 * @csspart panel
 * @csspart close
 * @cssprop --rowan-dialog-bg
 * @cssprop --rowan-overlay-backdrop
 * @event rowan-close - Fired when the user dismisses the dialog
 */
export class RowanDialog extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set open(value: boolean);
  get open(): boolean;
  set alert(value: boolean);
  get alert(): boolean;
  /** @param {RowanDialogMessages | null | undefined} value */
  set messages(value: RowanDialogMessages | null | undefined);
  /** @returns {RowanDialogMessages} */
  get messages(): RowanDialogMessages;
  show(): void;
  hide(): void;
  #private;
}
export type RowanDialogMessages = {
  closeLabel?: string;
  title?: string;
};
import { BaseElement } from "../lib/base-element.js";
