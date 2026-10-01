/**
 * @typedef {object} RowanAvatarMessages
 * @property {string} [avatar]
 */
/**
 * Circular user avatar with image fallback.
 * @tag rowan-avatar
 * @attr {string} name
 * @attr {string} src
 * @attr {string} alt
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} locale
 * @property {RowanAvatarMessages} messages - Property-only built-in message overrides.
 * @csspart avatar
 * @csspart image
 * @csspart initials
 */
export class RowanAvatar extends BaseElement {
  set name(value: string);
  get name(): string;
  set src(value: string);
  get src(): string;
  set alt(value: string);
  get alt(): string;
  /** @param {"sm" | "md" | "lg"} value */
  set size(value: "sm" | "md" | "lg");
  /** @returns {"sm" | "md" | "lg"} */
  get size(): "sm" | "md" | "lg";
  set locale(value: string);
  get locale(): string;
  /** @param {RowanAvatarMessages | null | undefined} value */
  set messages(value: RowanAvatarMessages | null | undefined);
  /** @returns {RowanAvatarMessages} */
  get messages(): RowanAvatarMessages;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanAvatarMessages = {
  avatar?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
