/** @typedef {{ navigationToggle?: string }} RowanAppLayoutMessages */
/**
 * Responsive application shell for header, navigation, and main content.
 * @tag rowan-app-layout
 * @attr {boolean} navigation-open
 * @attr {string} navigation-label
 * @property {RowanAppLayoutMessages} messages - Property-only built-in message overrides.
 * @slot header - Application header content.
 * @slot navigation - Primary application navigation.
 * @slot - Main application content.
 * @csspart layout
 * @csspart header
 * @csspart navigation-toggle
 * @csspart navigation
 * @csspart backdrop
 * @csspart content
 * @cssprop --rowan-app-layout-navigation-width
 * @cssprop --rowan-app-layout-content-padding
 * @cssprop --rowan-app-layout-header-bg
 * @event rowan-change - Fired when a user opens or closes compact navigation.
 */
export class RowanAppLayout extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set navigationOpen(value: boolean);
  get navigationOpen(): boolean;
  set navigationLabel(value: string);
  get navigationLabel(): string;
  /** @param {RowanAppLayoutMessages | null | undefined} value */
  set messages(value: RowanAppLayoutMessages | null | undefined);
  /** @returns {RowanAppLayoutMessages} */
  get messages(): RowanAppLayoutMessages;
  #private;
}
export type RowanAppLayoutMessages = {
  navigationToggle?: string;
};
import { BaseElement } from "../lib/base-element.js";
