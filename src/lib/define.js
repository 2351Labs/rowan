export function define(tag, Class) {
  if (!customElements.get(tag)) customElements.define(tag, Class);
}
