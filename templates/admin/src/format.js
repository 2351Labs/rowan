import { formatCurrency, formatDate, formatNumber } from "@rowan-ui/core/format";

const LOCALE = "en-US";

export function money(value) {
  return formatCurrency(value, {
    locale: LOCALE,
    currency: "USD",
    fallback: "—",
  });
}

export function compactMoney(value) {
  return formatCurrency(value, {
    locale: LOCALE,
    currency: "USD",
    fallback: "—",
    options: { notation: "compact", maximumFractionDigits: 1 },
  });
}

export function chartMoney(value, context) {
  return context?.tick ? compactMoney(value) : money(value);
}

export function shortDate(value) {
  return formatDate(value, {
    locale: LOCALE,
    fallback: "—",
    options: { month: "short", day: "numeric", year: "numeric" },
  });
}

export function monthDay(value) {
  return formatDate(value, {
    locale: LOCALE,
    fallback: "—",
    options: { month: "short", day: "numeric" },
  });
}

export function integer(value) {
  return formatNumber(value, {
    locale: LOCALE,
    fallback: "—",
    options: { maximumFractionDigits: 0 },
  });
}

export function percent(value) {
  return formatNumber(value, {
    locale: LOCALE,
    fallback: "—",
    options: { style: "percent", maximumFractionDigits: 0 },
  });
}

export function signedPercentPoints(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0;
  if (previous === 0) return current === 0 ? 0 : current > 0 ? 100 : -100;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
