/**
 * Replace application overrides. Omitted keys keep the English default.
 * @param {Record<string, string> | null | undefined} messages
 */
export function setValidityMessages(messages: Record<string, string> | null | undefined): void;
/**
 * Install a function that maps a message key to a localized string.
 * Return a non-empty string to use it; any other value falls through.
 * @param {null | undefined | ((key: string, fallback: string) => unknown)} resolver
 */
export function setValidityMessageResolver(resolver: null | undefined | ((key: string, fallback: string) => unknown)): void;
export function resetValidityMessages(): void;
/**
 * @param {string} key
 */
export function validityMessage(key: string): string;
/**
 * English constraint strings used by Rowan form controls.
 * Applications own locale policy: replace keys or install a resolver
 * before mounting controls. `setCustomValidity` still wins per control.
 * @type {Readonly<Record<string, string>>}
 */
export const ROWAN_VALIDITY_MESSAGES: Readonly<Record<string, string>>;
