/**
 * Visual separator line.
 * @tag rowan-divider
 * @attr {"horizontal"|"vertical"} orientation
 * @csspart divider
 */
export class RowanDivider extends BaseElement {
  static styles: string;
  /** @param {"horizontal" | "vertical"} value */
  set orientation(value: "horizontal" | "vertical");
  /** @returns {"horizontal" | "vertical"} */
  get orientation(): "horizontal" | "vertical";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
import { BaseElement } from "../lib/base-element.js";
