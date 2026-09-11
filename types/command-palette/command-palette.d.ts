/**
 * Keyboard-first command surface for filtering and activating command items.
 * @tag rowan-command-palette
 * @attr {boolean} open
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} empty-label
 * @attr {string} hotkey
 * @attr {string} query
 * @slot - rowan-command-item nodes
 * @slot empty
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart input
 * @csspart list
 * @csspart empty
 * @csspart close
 * @cssprop --rowan-command-palette-bg
 * @cssprop --rowan-command-palette-width
 * @event rowan-command - Fired when a user activates a command
 * @event rowan-close - Fired when a user dismisses the palette
 */
export class RowanCommandPalette extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set open(value: boolean);
    get open(): boolean;
    set label(value: string);
    get label(): string;
    set placeholder(value: string);
    get placeholder(): string;
    set emptyLabel(value: string);
    get emptyLabel(): string;
    set hotkey(value: string);
    get hotkey(): string;
    set query(value: string);
    get query(): string;
    show(): void;
    hide(): void;
    toggle(): void;
    focusSearch(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
