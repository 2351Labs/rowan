/**
 * @typedef {object} RowanCommandPaletteMessages
 * @property {string} [close]
 * @property {string} [emptyLabel]
 * @property {string} [label]
 * @property {string} [placeholder]
 */
/**
 * Keyboard-first command surface for filtering and activating command items.
 * @tag rowan-command-palette
 * @attr {boolean} open
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} empty-label
 * @attr {string} hotkey
 * @attr {string} query
 * @attr {string} locale
 * @property {RowanCommandPaletteMessages} messages - Property-only built-in message overrides.
 * @slot - rowan-command-item nodes
 * @slot empty
 * @csspart overlay
 * @csspart panel
 * @csspart input
 * @csspart list
 * @csspart empty
 * @csspart close
 * @cssprop --rowan-command-palette-bg
 * @cssprop --rowan-command-palette-width
 * @event rowan-command - Fired when a user activates a command
 * @event rowan-close - Fired when a user dismisses the palette
 */
export class RowanCommandPalette extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set open(value: boolean);
  get open(): boolean;
  set label(value: string);
  get label(): string;
  set placeholder(value: string);
  get placeholder(): string;
  set emptyLabel(value: string);
  get emptyLabel(): string;
  set hotkey(value: string);
  get hotkey(): string;
  set query(value: string);
  get query(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanCommandPaletteMessages | null | undefined} value */
  set messages(value: RowanCommandPaletteMessages | null | undefined);
  /** @returns {RowanCommandPaletteMessages} */
  get messages(): RowanCommandPaletteMessages;
  show(): void;
  hide(): void;
  toggle(): void;
  focusSearch(): void;
  #private;
}
export type RowanCommandPaletteMessages = {
  close?: string | undefined;
  emptyLabel?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
