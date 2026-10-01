/**
 * @typedef {object} RowanFileItemMessages
 * @property {string} [cancel]
 * @property {string | ((context: { bytes: number, unit: string, value: string }) => string)} [fileSize]
 * @property {string} [remove]
 * @property {string} [retry]
 * @property {string} [statusFailed]
 * @property {string} [statusQueued]
 * @property {string} [statusSuccess]
 * @property {string} [statusUploading]
 * @property {string} [untitledFile]
 * @property {string | ((context: { progress: number }) => string)} [uploadProgress]
 */
/**
 * Upload queue item showing file metadata, state, and actions.
 * @tag rowan-file-item
 * @attr {string} file-id
 * @attr {string} filename
 * @attr {number} filesize
 * @attr {"queued"|"uploading"|"success"|"failed"} status
 * @attr {number} progress
 * @attr {boolean} disabled
 * @attr {string} locale
 * @property {RowanFileItemMessages} messages - Property-only built-in message overrides.
 * @csspart item
 * @csspart name
 * @csspart details
 * @csspart status
 * @csspart progress
 * @csspart actions
 * @event rowan-remove - Fired when remove action is clicked
 * @event rowan-retry - Fired when retry action is clicked for failed files
 * @event rowan-cancel - Fired when cancel action is clicked for uploading files
 */
export class RowanFileItem extends BaseElement {
  set fileId(value: string);
  get fileId(): string;
  set filename(value: string);
  get filename(): string;
  set filesize(value: number);
  get filesize(): number;
  /** @param {"queued" | "uploading" | "success" | "failed"} value */
  set status(value: "success" | "queued" | "uploading" | "failed");
  /** @returns {"queued" | "uploading" | "success" | "failed"} */
  get status(): "success" | "queued" | "uploading" | "failed";
  set progress(value: number);
  get progress(): number;
  set disabled(value: boolean);
  get disabled(): boolean;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanFileItemMessages | null | undefined} value */
  set messages(value: RowanFileItemMessages | null | undefined);
  /** @returns {RowanFileItemMessages} */
  get messages(): RowanFileItemMessages;
  #private;
}
export type RowanFileItemMessages = {
  cancel?: string | undefined;
  fileSize?:
    string | ((context: { bytes: number; unit: string; value: string }) => string) | undefined;
  remove?: string | undefined;
  retry?: string | undefined;
  statusFailed?: string | undefined;
  statusQueued?: string | undefined;
  statusSuccess?: string | undefined;
  statusUploading?: string | undefined;
  untitledFile?: string | undefined;
  uploadProgress?: string | ((context: { progress: number }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
