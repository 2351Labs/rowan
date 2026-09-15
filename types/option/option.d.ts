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
    setRovingTabIndex(value: any, owner?: null): void;
    /**
     * Marks the option as the controller's active descendant. This is the highlight a
     * combobox moves with the arrow keys, which is separate from selection.
     * @internal
     */
    setActiveDescendant(active: any, owner?: null): void;
    /** @internal */
    setListboxDisabled(disabled: any, owner?: null): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
