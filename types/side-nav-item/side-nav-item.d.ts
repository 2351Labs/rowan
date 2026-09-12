/**
 * Link item managed by rowan-side-nav.
 * @tag rowan-side-nav-item
 * @attr {string} value
 * @attr {string} href
 * @attr {string} target
 * @attr {string} label
 * @attr {boolean} active
 * @attr {boolean} disabled
 * @attr {boolean} external
 * @slot - Item label
 * @slot prefix
 * @slot suffix
 * @csspart item
 * @csspart label
 * @cssprop --rowan-side-nav-item-fg
 * @cssprop --rowan-side-nav-item-active-bg
 */
export class RowanSideNavItem extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    set value(value: string);
    get value(): string;
    set href(value: string);
    get href(): string;
    set target(value: string);
    get target(): string;
    set label(value: string);
    get label(): string;
    set active(value: boolean);
    get active(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set external(value: boolean);
    get external(): boolean;
    focus(options: any): void;
    /** @internal */
    activate(): void;
    /** @internal */
    setRovingTabIndex(value: any, owner?: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
