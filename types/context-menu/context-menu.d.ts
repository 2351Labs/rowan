/**
 * Contextual action menu bound to an element by property or identifier.
 * @tag rowan-context-menu
 * @attr {boolean} open
 * @attr {string} for
 * @attr {string} label
 * @slot - rowan-menu-item actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart menu
 * @cssprop --rowan-context-menu-z-index
 * @cssprop --rowan-context-menu-offset
 * @event rowan-change - Fired when the user selects a contextual action
 * @event rowan-close - Fired when the user dismisses the menu
 */
export class RowanContextMenu extends BaseElement {
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set open(value: boolean);
    get open(): boolean;
    set forTarget(value: string);
    get forTarget(): string;
    /** @param {HTMLElement | null} value */
    set target(value: HTMLElement | null);
    /** @returns {HTMLElement | null} */
    get target(): HTMLElement | null;
    set label(value: string);
    get label(): string;
    showAt(x: any, y: any): void;
    hide(): void;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
