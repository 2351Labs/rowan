/**
 * Concise semantic status marker with an optional visible label.
 * @tag rowan-status-indicator
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} label
 * @attr {boolean} pulse
 * @slot - Visible status label
 * @csspart status
 * @csspart indicator
 * @csspart label
 * @cssprop --rowan-status-indicator-color
 * @cssprop --rowan-status-indicator-fg
 * @cssprop --rowan-status-indicator-gap
 */
export class RowanStatusIndicator extends BaseElement {
    static componentTokenPrefixes: string[];
    /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger" | "neutral");
    /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger" | "neutral";
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
    set label(value: string);
    get label(): string;
    set pulse(value: boolean);
    get pulse(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
