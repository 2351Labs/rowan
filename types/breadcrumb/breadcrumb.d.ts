/** @typedef {{ navigationLabel?: string }} RowanBreadcrumbMessages */
/**
 * Breadcrumb navigation wrapper.
 * @tag rowan-breadcrumb
 * @property {RowanBreadcrumbMessages} messages - Property-only built-in message overrides.
 * @slot - Breadcrumb items
 * @csspart nav
 */
export class RowanBreadcrumb extends BaseElement {
  /** @param {RowanBreadcrumbMessages | null | undefined} value */
  set messages(value: RowanBreadcrumbMessages | null | undefined);
  /** @returns {RowanBreadcrumbMessages} */
  get messages(): RowanBreadcrumbMessages;
  #private;
}
export type RowanBreadcrumbMessages = {
  navigationLabel?: string;
};
import { BaseElement } from "../lib/base-element.js";
