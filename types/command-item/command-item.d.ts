/**
 * Action entry used by a rowan-command-palette.
 * @tag rowan-command-item
 * @attr {string} value
 * @attr {string} label
 * @attr {string} description
 * @attr {string} keywords
 * @attr {string} group
 * @attr {string} shortcut
 * @attr {boolean} disabled
 * @slot - Command label
 * @slot prefix
 * @slot description
 * @slot shortcut
 * @csspart item
 * @csspart label
 * @csspart description
 * @csspart group
 * @csspart shortcut
 * @cssprop --rowan-command-item-fg
 * @cssprop --rowan-command-item-active-bg
 * @cssprop --rowan-command-item-shortcut-bg
 */
export class RowanCommandItem extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set keywords(value: string);
    get keywords(): string;
    set group(value: string);
    get group(): string;
    set shortcut(value: string);
    get shortcut(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    get searchText(): string;
    focus(options: any): void;
    /** @internal */
    setCommandPaletteState({ active, visible }: {
        active?: boolean;
        visible?: boolean;
    }, owner: any): string;
    /** @internal */
    clearCommandPaletteState(owner: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
