import { finiteOrNull } from "../chart/model.js";

const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;
const GENERATED_POINT_LABEL = Symbol("rowan.waterfall-generated-point-label");

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeColor(value) {
  const color = normalizeText(value);
  return HEX_COLOR_PATTERN.test(color) || TOKEN_COLOR_PATTERN.test(color) ? color : "";
}

function fallbackPointLabel(index, resolveFallback) {
  if (typeof resolveFallback === "function") {
    const resolved = normalizeText(resolveFallback(index));
    if (resolved) return resolved;
  }

  return `Point ${index + 1}`;
}

/**
 * @param {unknown} value
 */
export function cloneWaterfallSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) =>
            isObject(point) ? { label: point.label, value: point.value, type: point.type } : point,
          )
        : series.values,
    };
  });
}

/**
 * First series only. Point `type: "total"` is preserved; other points are deltas.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeWaterfallSeries(value, labels = []) {
  const source = Array.isArray(value) ? value.find((item) => isObject(item)) : null;
  if (!source) return [];

  const id = normalizeText(source.id) || "waterfall";
  const inputValues = Array.isArray(source.values) ? source.values : [];
  return [
    {
      id,
      label: normalizeText(source.label) || id,
      color: normalizeColor(source.color),
      values: inputValues.map((point, index) => {
        const item = isObject(point) ? point : { value: point };
        const authoredLabel = normalizeText(item.label);
        const configuredLabel = normalizeText(labels[index]);
        const normalized = {
          value: finiteOrNull(item.value),
          label: authoredLabel || configuredLabel || fallbackPointLabel(index),
          type: item.type === "total" ? "total" : "delta",
        };
        if (!authoredLabel && !configuredLabel) {
          Object.defineProperty(normalized, GENERATED_POINT_LABEL, { value: true });
        }
        return normalized;
      }),
    },
  ];
}

export function cloneWaterfallSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) => ({ ...point })),
  }));
}

/**
 * @param {{ values?: Array<{ label?: string }> } | undefined} series
 * @param {string[]} labels
 * @param {(index: number) => string} [resolveFallbackLabel]
 * @returns {string[]}
 */
export function resolveWaterfallLabels(series, labels, resolveFallbackLabel) {
  const values = series?.values ?? [];
  const length = Math.max(values.length, labels.length);

  return Array.from({ length }, (_value, index) => {
    const configured = normalizeText(labels[index]);
    if (configured) return configured;

    const point = values[index];
    if (point?.[GENERATED_POINT_LABEL]) {
      return fallbackPointLabel(index, resolveFallbackLabel);
    }

    return point?.label || fallbackPointLabel(index, resolveFallbackLabel);
  });
}

/**
 * Waterfall does not invent totals. `type: "total"` is an absolute bar from
 * zero; other finite values are signed deltas from the running total. Null
 * is no-data.
 * @param {{ values: Array<{ value: number | null, label: string, type: "delta" | "total" }> } | undefined} series
 * @param {string[]} labels
 */
export function waterfallEntries(series, labels) {
  const values = series?.values ?? [];
  let running = 0;
  const length = Math.max(values.length, labels.length);
  const entries = [];

  for (let index = 0; index < length; index += 1) {
    const point = values[index];
    const type = point?.type === "total" ? "total" : "delta";
    const value = point?.value ?? null;
    const label = labels[index] || point?.label || `Point ${index + 1}`;
    if (value === null) {
      entries.push({
        index,
        label,
        value: null,
        type,
        from: running,
        to: running,
      });
      continue;
    }
    if (type === "total") {
      entries.push({ index, label, value, type, from: 0, to: value });
      running = value;
      continue;
    }
    entries.push({
      index,
      label,
      value,
      type,
      from: running,
      to: running + value,
    });
    running += value;
  }

  return entries;
}

export function waterfallDomain(entries) {
  const numbers = entries.flatMap((entry) =>
    entry.value === null ? [] : [entry.from, entry.to, 0],
  );
  if (!numbers.length) return { min: 0, max: 1 };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}
