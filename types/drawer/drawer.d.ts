/** @typedef {{ close?: string, closeLabel?: string, title?: string }} RowanDrawerMessages */
/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @property {RowanDrawerMessages} messages - Property-only built-in message overrides.
 * @slot - Drawer content
 * @slot title
 * @csspart overlay
 * @csspart panel
 * @csspart title
 * @csspart close
 * @event rowan-change - Fired when the user closes the drawer
 */
export class RowanDrawer extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set open(value: boolean);
  get open(): boolean;
  /** @param {"start" | "end"} value */
  set side(value: "start" | "end");
  /** @returns {"start" | "end"} */
  get side(): "start" | "end";
  /** @param {RowanDrawerMessages | null | undefined} value */
  set messages(value: RowanDrawerMessages | null | undefined);
  /** @returns {RowanDrawerMessages} */
  get messages(): RowanDrawerMessages;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanDrawerMessages = {
  close?: string;
  closeLabel?: string;
  title?: string;
};
import { BaseElement } from "../lib/base-element.js";
