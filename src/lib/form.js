function associatedForm(element) {
  const formId = element.getAttribute("form")?.trim();
  if (formId) {
    const form = element.ownerDocument?.getElementById(formId);
    return form instanceof HTMLFormElement ? form : null;
  }

  return element.closest("form");
}

export function triggerAssociatedFormAction(element, type) {
  const form = associatedForm(element);
  if (!form) return;

  if (type === "submit") {
    HTMLFormElement.prototype.requestSubmit.call(form);
  } else if (type === "reset") {
    HTMLFormElement.prototype.reset.call(form);
  }
}
