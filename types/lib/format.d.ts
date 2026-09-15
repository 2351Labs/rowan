/**
 * Formats a finite number using the requested locale.
 * Invalid values, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {NumberFormatConfig} [config]
 * @returns {string}
 */
export function formatNumber(value: number | string, config?: NumberFormatConfig | undefined): string;
/**
 * Formats a finite number as an ISO 4217 currency using the requested locale.
 * Invalid values, currencies, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {CurrencyFormatConfig} config
 * @returns {string}
 */
export function formatCurrency(value: number | string, config: CurrencyFormatConfig): string;
/**
 * Formats a Date, timestamp, or date string using the requested locale and time zone.
 * Invalid values, locales, time zones, or options return `fallback`, which defaults to an empty string.
 * @param {Date | number | string} value
 * @param {DateFormatConfig} [config]
 * @returns {string}
 */
export function formatDate(value: Date | number | string, config?: DateFormatConfig | undefined): string;
/**
 * Formats a signed relative value using the requested locale.
 * Invalid values, units, locales, or options return `fallback`, which defaults to an empty string.
 * @param {number | string} value
 * @param {RelativeTimeFormatConfig} [config]
 * @returns {string}
 */
export function formatRelativeTime(value: number | string, config?: RelativeTimeFormatConfig | undefined): string;
export type RowanLocale = string | readonly string[] | undefined;
export type NumberFormatConfig = {
    locale?: RowanLocale;
    options?: Intl.NumberFormatOptions;
    fallback?: string;
};
export type CurrencyFormatConfig = {
    currency: string;
    locale?: RowanLocale;
    options?: Intl.NumberFormatOptions;
    fallback?: string;
};
export type DateFormatConfig = {
    locale?: RowanLocale;
    timeZone?: string;
    options?: Intl.DateTimeFormatOptions;
    fallback?: string;
};
export type RelativeTimeFormatConfig = {
    locale?: RowanLocale;
    unit?: Intl.RelativeTimeFormatUnit;
    options?: Intl.RelativeTimeFormatOptions;
    fallback?: string;
};
