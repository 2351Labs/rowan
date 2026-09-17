/**
 * English constraint strings used by Rowan form controls.
 * Applications own locale policy: replace keys or install a resolver
 * before mounting controls. `setCustomValidity` still wins per control.
 * @type {Readonly<Record<string, string>>}
 */
export const ROWAN_VALIDITY_MESSAGES = Object.freeze({
  valueMissing: "Please fill out this field.",
  "valueMissing.option": "Please select an option.",
  "valueMissing.options": "Please select at least one option.",
  "valueMissing.file": "Please select a file.",
  "valueMissing.date": "Please select a date.",
  "valueMissing.dateRange": "Please select a start and end date.",
  "valueMissing.time": "Please select a time.",
  "valueMissing.number": "Please enter a number.",
  "valueMissing.checkbox": "Please check this box.",
  "valueMissing.switch": "Please enable this switch.",
  "valueMissing.color": "Please choose a color.",
  "valueMissing.mode": "Please choose a mode.",
  "valueMissing.rating": "Please choose a rating.",
  "valueMissing.content": "Please enter content.",
  invalid: "Please enter a valid value.",
  "badInput.date": "Enter a valid date.",
  "badInput.time": "Enter a valid time.",
  "badInput.number": "Enter a valid number.",
  "rangeUnderflow.date": "Date is before minimum.",
  "rangeUnderflow.dateStart": "Start date is before minimum.",
  "rangeUnderflow.dateEnd": "End date is before minimum.",
  "rangeUnderflow.time": "Time is before minimum.",
  "rangeUnderflow.number": "Value is below minimum.",
  "rangeOverflow.date": "Date is after maximum.",
  "rangeOverflow.dateStart": "Start date is after maximum.",
  "rangeOverflow.dateEnd": "End date is after maximum.",
  "rangeOverflow.time": "Time is after maximum.",
  "rangeOverflow.number": "Value is above maximum.",
  "stepMismatch.time": "Time does not align to step.",
  "stepMismatch.number": "Value does not align to step.",
  "range.dateOrder": "End date must be on or after start date.",
});

/** @type {Record<string, string>} */
let messageOverrides = {};

/**
 * @type {null | ((key: string, fallback: string) => unknown)}
 */
let messageResolver = null;

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) return value;
  }

  return "";
}

/**
 * Replace application overrides. Omitted keys keep the English default.
 * @param {Record<string, string> | null | undefined} messages
 */
export function setValidityMessages(messages) {
  messageOverrides = {};
  if (!messages || typeof messages !== "object") return;

  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "string") messageOverrides[key] = value;
  }
}

/**
 * Install a function that maps a message key to a localized string.
 * Return a non-empty string to use it; any other value falls through.
 * @param {null | undefined | ((key: string, fallback: string) => unknown)} resolver
 */
export function setValidityMessageResolver(resolver) {
  messageResolver = typeof resolver === "function" ? resolver : null;
}

export function resetValidityMessages() {
  messageOverrides = {};
  messageResolver = null;
}

/**
 * @param {string} key
 */
export function validityMessage(key) {
  const fallback = ROWAN_VALIDITY_MESSAGES[key] ?? "";
  const resolved = messageResolver ? messageResolver(key, fallback) : undefined;
  return firstNonEmpty(resolved, messageOverrides[key], fallback);
}
