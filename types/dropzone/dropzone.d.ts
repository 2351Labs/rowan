/**
 * Drag-and-drop file selection surface with picker fallback.
 * @tag rowan-dropzone
 * @attr {string} label
 * @attr {string} description
 * @attr {string} accept
 * @attr {boolean} multiple
 * @attr {boolean} disabled
 * @attr {boolean} drag-active
 * @csspart surface
 * @csspart label
 * @csspart description
 * @csspart input
 * @event rowan-files-add - Fired when files are selected by picker or drop
 */
export class RowanDropzone extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set accept(value: string);
    get accept(): string;
    set multiple(value: boolean);
    get multiple(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set dragActive(value: boolean);
    get dragActive(): boolean;
    openPicker(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
