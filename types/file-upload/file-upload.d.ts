/**
 * File upload composer with dropzone and queue item rendering.
 * @tag rowan-file-upload
 * @attr {string} label
 * @attr {string} accept
 * @attr {boolean} multiple
 * @attr {boolean} disabled
 * @attr {number} max-files
 * @csspart upload
 * @csspart dropzone
 * @csspart file-list
 * @csspart empty
 * @event rowan-files-add - Fired when files are accepted into the queue
 * @event rowan-file-remove - Fired when a queued file is removed
 * @event rowan-file-retry - Fired when retry is requested for a failed file
 * @event rowan-file-cancel - Fired when cancel is requested for an uploading file
 */
export class RowanFileUpload extends BaseElement {
    set label(value: string);
    get label(): string;
    set accept(value: string);
    get accept(): string;
    set multiple(value: boolean);
    get multiple(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set maxFiles(value: number);
    get maxFiles(): number;
    set files(value: any[]);
    get files(): any[];
    #private;
}
import { BaseElement } from "../lib/base-element.js";
