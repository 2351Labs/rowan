export function readFormValues(form) {
  const values = {};

  for (const control of form.querySelectorAll("[name]")) {
    if (!(control instanceof HTMLElement) || !control.name) continue;
    if (control.localName === "rowan-radio" && control.closest("rowan-radio-group")) continue;

    if (control.localName === "rowan-checkbox" || control.localName === "rowan-switch") {
      values[control.name] = control.checked;
      continue;
    }

    if ("value" in control) values[control.name] = control.value;
  }

  return values;
}

function fieldLabel(control) {
  const wrapper = control.closest("rowan-form-field");
  return wrapper?.label || control.getAttribute("label") || control.name || "Field";
}

function decorate(form, errors) {
  const byId = new Map(errors.map((error) => [error.fieldId, error]));

  for (const wrapper of form.querySelectorAll("rowan-form-field")) {
    const control = wrapper.querySelector("[id]");
    const error = control ? byId.get(control.id) : null;
    wrapper.invalid = Boolean(error);
    wrapper.error = error?.message || "";
  }
}

function clearDecorations(form) {
  for (const wrapper of form.querySelectorAll("rowan-form-field")) {
    wrapper.invalid = false;
    wrapper.error = "";
  }
}

/**
 * Wire a light-DOM form of Rowan controls to a validation summary.
 * Native `invalid` does not bubble; the listener uses capture and does not
 * call `checkValidity` again, which would re-enter the event.
 */
export function bindForm(form, { summary, validate, onValid } = {}) {
  let batch = [];
  let scheduled = false;

  const submitter = form.querySelector('rowan-button[type="submit"]');
  submitter?.addEventListener("rowan-click", () => {
    batch = [];
    clearDecorations(form);
    if (summary) summary.errors = [];
  });

  form.addEventListener(
    "invalid",
    (event) => {
      event.preventDefault();
      const control = event.target;
      if (!(control instanceof HTMLElement)) return;
      batch.push(control);
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        const controls = batch;
        batch = [];
        const errors = controls.map((control) => ({
          fieldId: control.id || control.name,
          label: fieldLabel(control),
          message: control.validationMessage || `${fieldLabel(control)} is invalid`,
        }));
        if (summary) summary.errors = errors;
        decorate(form, errors);
      });
    },
    true,
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const extra = validate?.() || [];
    if (extra.length) {
      if (summary) summary.errors = extra;
      decorate(form, extra);
      return;
    }

    clearDecorations(form);
    if (summary) summary.errors = [];
    onValid?.(readFormValues(form));
  });
}
