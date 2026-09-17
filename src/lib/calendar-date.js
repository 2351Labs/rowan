const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad(number) {
  return String(number).padStart(2, "0");
}

export function isCalendarDateInput(value) {
  return typeof value === "string" && CALENDAR_DATE.test(value.trim());
}

export function normalizeCalendarDate(value) {
  const match = CALENDAR_DATE.exec(String(value ?? "").trim());
  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return "";
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}

export function parseCalendarDate(value) {
  const normalized = normalizeCalendarDate(value);
  if (!normalized) return null;

  const [year, month, day] = normalized.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
