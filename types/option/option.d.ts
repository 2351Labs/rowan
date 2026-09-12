/**
 * Selectable item for rowan-listbox.
 * @tag rowan-option
 * @attr {string} value
 * @attr {string} label
 * @attr {boolean} selected
 * @attr {boolean} disabled
 * @slot - Option label
 * @slot prefix
 * @slot suffix
 * @csspart option
 * @csspart label
 * @cssprop --rowan-option-fg
 * @cssprop --rowan-option-selected-bg
 */
export class RowanOption extends BaseElement {
    static componentTokenPrefixes: string[];
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    set selected(value: boolean);
    get selected(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    /** @internal */
    setRovingTabIndex(value: any, owner?: any): void;
    /** @internal */
    setListboxDisabled(disabled: any, owner?: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
