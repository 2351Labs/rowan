/**
 * Reports whether an element can receive focus from the user.
 * Capability based, so Rowan controls are detected through `delegatesFocus`
 * instead of a hard-coded tag list.
 *
 * @param {unknown} element
 * @returns {boolean}
 */
export function isFocusable(element: unknown): boolean;
/**
 * Collects focusable elements in tab order, following slots and open shadow roots.
 *
 * @param {Element | ShadowRoot} root
 * @param {{ includeSlotted?: boolean }} [options] Set `includeSlotted: false` when slotted
 *   children are navigated with arrow keys rather than Tab, as in a listbox.
 * @returns {HTMLElement[]}
 */
export function collectFocusableElements(root: Element | ShadowRoot, options?: {
    includeSlotted?: boolean | undefined;
} | undefined): HTMLElement[];
