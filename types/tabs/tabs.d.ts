/**
 * Tabs controller for tab and tab-panel children.
 * @tag rowan-tabs
 * @attr {string} value
 * @slot - rowan-tab and rowan-tab-panel nodes
 * @csspart tabs
 * @event rowan-change - Fired when active tab changes
 */
export class RowanTabs extends BaseElement {
    set value(value: string);
    get value(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
