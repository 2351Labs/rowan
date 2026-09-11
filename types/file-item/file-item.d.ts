/**
 * Upload queue item showing file metadata, state, and actions.
 * @tag rowan-file-item
 * @attr {string} file-id
 * @attr {string} filename
 * @attr {number} filesize
 * @attr {"queued"|"uploading"|"success"|"failed"} status
 * @attr {number} progress
 * @attr {boolean} disabled
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
    set status(value: string);
    get status(): string;
    set progress(value: number);
    get progress(): number;
    set disabled(value: boolean);
    get disabled(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
