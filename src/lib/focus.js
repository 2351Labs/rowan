const NATIVE_FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "audio[controls]",
  "button",
  "details > summary",
  "iframe",
  "input",
  "select",
  "textarea",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
].join(",");

/**
 * Reports whether an element can receive focus from the user.
 * Capability based, so Rowan controls are detected through `delegatesFocus`
 * instead of a hard-coded tag list.
 *
 * @param {unknown} element
 * @returns {boolean}
 */
export function isFocusable(element) {
  if (!(element instanceof HTMLElement)) return false;
  if (element.hasAttribute("disabled")) return false;
  if (element.getAttribute("aria-disabled") === "true") return false;
  if (element.hidden) return false;
  if (typeof element.closest === "function" && element.closest("[inert]")) return false;

  const tabIndexAttribute = element.getAttribute("tabindex");
  if (tabIndexAttribute !== null) {
    return Number.parseInt(tabIndexAttribute, 10) >= 0;
  }

  if (element.shadowRoot?.delegatesFocus) return true;

  return element.matches(NATIVE_FOCUSABLE_SELECTOR);
}

/**
 * Collects focusable elements in tab order, following slots and open shadow roots.
 *
 * @param {Element | ShadowRoot} root
 * @param {{ includeSlotted?: boolean }} [options] Set `includeSlotted: false` when slotted
 *   children are navigated with arrow keys rather than Tab, as in a listbox.
 * @returns {HTMLElement[]}
 */
export function collectFocusableElements(root, options = {}) {
  const includeSlotted = options.includeSlotted !== false;
  const focusable = [];
  const seen = new Set();

  const consider = (element) => {
    if (!(element instanceof HTMLElement) || seen.has(element)) return;
    seen.add(element);

    if (isFocusable(element)) {
      focusable.push(element);
      // A focus-delegating host owns the focus order of its own shadow tree.
      if (element.shadowRoot?.delegatesFocus) return;
    }

    descend(element);
  };

  const descend = (node) => {
    if (!node) return;

    for (const child of node.children) {
      if (child instanceof HTMLSlotElement) {
        if (includeSlotted) {
          child.assignedElements({ flatten: true }).forEach(consider);
        }
        continue;
      }

      consider(child);
    }

    if (node instanceof HTMLElement && node.shadowRoot && !node.shadowRoot.delegatesFocus) {
      descend(node.shadowRoot);
    }
  };

  descend(root);
  return focusable;
}
