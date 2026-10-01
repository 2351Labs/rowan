/**
 * @typedef {object} RowanFileUploadMessages
 * @property {string} [ariaLabel]
 * @property {string} [dropzoneDescription]
 * @property {string} [dropzoneLabel]
 * @property {string} [empty]
 * @property {string} [itemCancel]
 * @property {string | ((context: { bytes: number, unit: string, value: string }) => string)} [itemFileSize]
 * @property {string} [itemRemove]
 * @property {string} [itemRetry]
 * @property {string} [itemStatusFailed]
 * @property {string} [itemStatusQueued]
 * @property {string} [itemStatusSuccess]
 * @property {string} [itemStatusUploading]
 * @property {string} [itemUntitledFile]
 * @property {string | ((context: { progress: number }) => string)} [itemUploadProgress]
 */
/**
 * File upload composer with dropzone and queue item rendering.
 * @tag rowan-file-upload
 * @attr {string} name
 * @attr {string} label
 * @attr {string} accept
 * @attr {boolean} multiple
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {number} max-files
 * @attr {string} locale
 * @property {RowanFileUploadMessages} messages - Property-only built-in message overrides.
 * @csspart upload
 * @csspart dropzone
 * @csspart file-list
 * @csspart empty
 * @event rowan-files-add - Fired when files pass accept and max-files and are queued
 * @event rowan-file-remove - Fired when a queued file is removed
 * @event rowan-file-retry - Fired when retry is requested for a failed file
 * @event rowan-file-cancel - Fired when cancel is requested for an uploading file
 */
export class RowanFileUpload extends BaseElement {
  set name(value: string);
  get name(): string;
  set label(value: string);
  get label(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanFileUploadMessages | null | undefined} value */
  set messages(value: RowanFileUploadMessages | null | undefined);
  /** @returns {RowanFileUploadMessages} */
  get messages(): RowanFileUploadMessages;
  set accept(value: string);
  get accept(): string;
  set multiple(value: boolean);
  get multiple(): boolean;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  set maxFiles(value: number);
  get maxFiles(): number;
  set files(value: any[]);
  get files(): any[];
  formResetCallback(): void;
  formStateRestoreCallback(): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  #private;
}
export type RowanFileUploadMessages = {
  ariaLabel?: string | undefined;
  dropzoneDescription?: string | undefined;
  dropzoneLabel?: string | undefined;
  empty?: string | undefined;
  itemCancel?: string | undefined;
  itemFileSize?:
    string | ((context: { bytes: number; unit: string; value: string }) => string) | undefined;
  itemRemove?: string | undefined;
  itemRetry?: string | undefined;
  itemStatusFailed?: string | undefined;
  itemStatusQueued?: string | undefined;
  itemStatusSuccess?: string | undefined;
  itemStatusUploading?: string | undefined;
  itemUntitledFile?: string | undefined;
  itemUploadProgress?: string | ((context: { progress: number }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
