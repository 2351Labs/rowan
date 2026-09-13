const RELATIVE_TIME_UNITS = new Set([
  "year",
  "quarter",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
]);

/**
 * @typedef {string | readonly string[] | undefined} RowanLocale
 */

/**
 * @typedef {{
 *   locale?: RowanLocale,
 *   options?: Intl.NumberFormatOptions,
 *   fallback?: string,
 * }} NumberFormatConfig
 */

/**
 * @typedef {{
 *   currency: string,
 *   locale?: RowanLocale,
 *   options?: Intl.NumberFormatOptions,
 *   fallback?: string,
 * }} CurrencyFormatConfig
 */

/**
 * @typedef {{
 *   locale?: RowanLocale,
 *   timeZone?: string,
 *   options?: Intl.DateTimeFormatOptions,
 *   fallback?: string,
 * }} DateFormatConfig
 */

/**
 * @typedef {{
 *   locale?: RowanLocale,
 *   unit?: Intl.RelativeTimeFormatUnit,
 *   options?: Intl.RelativeTimeFormatOptions,
 *   fallback?: string,
 * }} RelativeTimeFormatConfig
 */

function readConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) return {};
  return config;
}

function readFallback(config) {
  return typeof config.fallback === "string" ? config.fallback : "";
}

function readFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function readDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  if (typeof value !== "number" && (typeof value !== "string" || value.trim() === "")) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readLocales(locale, Formatter) {
  if (locale == null || locale === "") return undefined;

  const requested = Array.isArray(locale) ? locale : [locale];
  if (
    !Formatter ||
    requested.length === 0 ||
    requested.some((candidate) => typeof candidate !== "string" || candidate.trim() === "")
  ) {
    return null;
  }

  const normalized = requested.map((candidate) => candidate.trim());

  try {
    return Formatter.supportedLocalesOf(normalized).length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

function copyOptions(options, defaults = {}) {
  if (options == null) return { ...defaults };
  if (typeof options !== "object" || Array.isArray(options)) return null;
  return { ...options };
}

function createFormatter(Formatter, locale, options) {
  const locales = readLocales(locale, Formatter);
  if (locales === null || !options) return null;

  try {
    return new Formatter(locales, options);
  } catch {
    return null;
  }
}

/**
 * Formats a finite number using the requested locale.
 * Invalid values, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {NumberFormatConfig} [config]
 * @returns {string}
 */
export function formatNumber(value, config = {}) {
  const normalizedConfig = readConfig(config);
  const fallback = readFallback(normalizedConfig);
  const numeric = readFiniteNumber(value);
  if (numeric === null) return fallback;

  const formatter = createFormatter(
    Intl.NumberFormat,
    normalizedConfig.locale,
    copyOptions(normalizedConfig.options),
  );
  return formatter ? formatter.format(numeric) : fallback;
}

/**
 * Formats a finite number as an ISO 4217 currency using the requested locale.
 * Invalid values, currencies, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {CurrencyFormatConfig} config
 * @returns {string}
 */
export function formatCurrency(value, config) {
  const normalizedConfig = readConfig(config);
  const fallback = readFallback(normalizedConfig);
  const numeric = readFiniteNumber(value);
  const currency =
    typeof normalizedConfig.currency === "string"
      ? normalizedConfig.currency.trim().toUpperCase()
      : "";

  if (numeric === null || !/^[A-Z]{3}$/.test(currency)) return fallback;

  const options = copyOptions(normalizedConfig.options);
  if (!options) return fallback;

  const formatter = createFormatter(Intl.NumberFormat, normalizedConfig.locale, {
    ...options,
    currency,
    style: "currency",
  });
  return formatter ? formatter.format(numeric) : fallback;
}

/**
 * Formats a Date, timestamp, or date string using the requested locale and time zone.
 * Invalid values, locales, time zones, or options return `fallback`, which defaults to an empty string.
 * @param {Date | number | string} value
 * @param {DateFormatConfig} [config]
 * @returns {string}
 */
export function formatDate(value, config = {}) {
  const normalizedConfig = readConfig(config);
  const fallback = readFallback(normalizedConfig);
  const date = readDate(value);
  if (!date) return fallback;

  const options = copyOptions(normalizedConfig.options, { dateStyle: "medium" });
  if (options && normalizedConfig.timeZone !== undefined) {
    options.timeZone = normalizedConfig.timeZone;
  }

  const formatter = createFormatter(Intl.DateTimeFormat, normalizedConfig.locale, options);
  return formatter ? formatter.format(date) : fallback;
}

/**
 * Formats a signed relative value using the requested locale.
 * Invalid values, units, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {RelativeTimeFormatConfig} [config]
 * @returns {string}
 */
export function formatRelativeTime(value, config = {}) {
  const normalizedConfig = readConfig(config);
  const fallback = readFallback(normalizedConfig);
  const numeric = readFiniteNumber(value);
  const unit = normalizedConfig.unit ?? "second";
  if (numeric === null || !RELATIVE_TIME_UNITS.has(unit)) return fallback;

  const formatter = createFormatter(
    Intl.RelativeTimeFormat,
    normalizedConfig.locale,
    copyOptions(normalizedConfig.options, { numeric: "auto" }),
  );
  return formatter ? formatter.format(numeric, unit) : fallback;
}
