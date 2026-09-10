export function emit(element, type, detail = {}, options = {}) {
  return element.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
      ...options,
    }),
  );
}
