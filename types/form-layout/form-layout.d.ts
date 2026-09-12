/**
 * Responsive field grid with direct-child spans and coordinated label alignment.
 * @tag rowan-form-layout
 * @attr {number} columns
 * @attr {string} gap
 * @attr {"top"|"start"} label-position
 * @attr {"start"|"end"} label-align
 * @attr {string} label-width
 * @slot - Form fields and controls; direct children may set span="1" through span="12"
 * @csspart layout
 * @cssprop --rowan-form-layout-gap
 * @cssprop --rowan-form-layout-label-width
 * @cssprop --rowan-form-layout-min-column-width
 */
export class RowanFormLayout extends BaseElement {
    static componentTokenPrefixes: string[];
    set columns(value: number);
    get columns(): number;
    set gap(value: any);
    get gap(): any;
    set labelPosition(value: "start" | "top");
    get labelPosition(): "start" | "top";
    set labelAlign(value: "start" | "end");
    get labelAlign(): "start" | "end";
    set labelWidth(value: any);
    get labelWidth(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
