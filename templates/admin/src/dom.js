export function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = String(value);
    else if (key === "text") node.textContent = String(value);
    else if (key === "slot") node.slot = String(value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }

  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return node;
}

export function icon(name, slot = "") {
  const node = h("rowan-icon", { name, size: "1.125rem" });
  if (slot) node.slot = slot;
  return node;
}

export function button(label, attrs = {}, ...children) {
  return h("rowan-button", attrs, ...children, label);
}

export function field(label, control, extra = {}) {
  const wrapper = h("rowan-form-field", {
    label,
    hint: extra.hint || null,
    required: extra.required || null,
    span: extra.span || null,
  });
  wrapper.append(control);
  return wrapper;
}
