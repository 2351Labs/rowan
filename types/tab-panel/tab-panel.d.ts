/**
 * Content panel for a tab.
 * @tag rowan-tab-panel
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Panel content
 * @csspart panel
 */
export class RowanTabPanel extends BaseElement {
    set value(value: string);
    get value(): string;
    set active(value: boolean);
    get active(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
