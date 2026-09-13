import { expect } from "@esm-bundle/chai";

import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from "./format.js";

describe("locale formatting", () => {
  it("formats numbers and currencies with explicit locales and options", () => {
    const numberOptions = { maximumFractionDigits: 1 };
    const currencyOptions = { currencyDisplay: "code" };

    expect(formatNumber("1234.56", { locale: "de-DE", options: numberOptions })).to.equal(
      new Intl.NumberFormat("de-DE", numberOptions).format(1234.56),
    );
    expect(
      formatCurrency(1234.56, { currency: "usd", locale: "en-US", options: currencyOptions }),
    ).to.equal(
      new Intl.NumberFormat("en-US", {
        ...currencyOptions,
        currency: "USD",
        style: "currency",
      }).format(1234.56),
    );
    expect(numberOptions).to.deep.equal({ maximumFractionDigits: 1 });
    expect(currencyOptions).to.deep.equal({ currencyDisplay: "code" });
  });

  it("formats dates using the supplied locale and time zone", () => {
    const value = "2026-01-01T00:30:00.000Z";
    const config = { locale: "en-US", timeZone: "America/Los_Angeles" };

    expect(formatDate(value, config)).to.equal(
      new Intl.DateTimeFormat(config.locale, {
        dateStyle: "medium",
        timeZone: config.timeZone,
      }).format(new Date(value)),
    );
  });

  it("formats signed relative values with locale-aware defaults", () => {
    const config = { locale: "en-US", unit: "day", options: { numeric: "auto" } };

    expect(formatRelativeTime(-1, config)).to.equal(
      new Intl.RelativeTimeFormat(config.locale, config.options).format(-1, "day"),
    );
  });

  it("uses the caller fallback for invalid values and unsupported formatting inputs", () => {
    const fallback = "Unavailable";

    expect(formatNumber("not-a-number", { fallback })).to.equal(fallback);
    expect(formatNumber(5, { locale: "zz-ZZ", fallback })).to.equal(fallback);
    expect(formatCurrency(5, { currency: "not-a-currency", fallback })).to.equal(fallback);
    expect(formatCurrency(5, { currency: "USD", options: "invalid", fallback })).to.equal(fallback);
    expect(formatDate("not-a-date", { fallback })).to.equal(fallback);
    expect(formatDate("2026-01-01", { timeZone: "Mars/Olympus_Mons", fallback })).to.equal(
      fallback,
    );
    expect(formatRelativeTime(1, { unit: "fortnight", fallback })).to.equal(fallback);
  });
});
