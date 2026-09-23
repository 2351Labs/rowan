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
 * @attr {"none"|"info"|"success"|"warning"|"danger"} tone
 * @attr {number} count
 * @attr {string} count-label
 * @slot - Item label
 * @slot prefix
 * @slot suffix
 * @csspart item
 * @csspart label
 * @csspart status
 * @csspart status-dot
 * @csspart status-count
 * @cssprop --rowan-side-nav-item-fg
 * @cssprop --rowan-side-nav-item-active-bg
 */
export class RowanSideNavItem extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
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
    /** @param {"none" | "info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger" | "none");
    /** @returns {"none" | "info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger" | "none";
    /** @param {number | null} value */
    set count(value: number | null);
    /** @returns {number | null} */
    get count(): number | null;
    set countLabel(value: string);
    get countLabel(): string;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    focus(options: any): void;
    /** @internal */
    activate(): void;
    /** @internal */
    setRovingTabIndex(value: any, owner?: null): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
