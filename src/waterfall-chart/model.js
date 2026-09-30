const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function finiteOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeColor(value) {
  const color = normalizeText(value);
  return HEX_COLOR_PATTERN.test(color) || TOKEN_COLOR_PATTERN.test(color) ? color : "";
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
        return {
          value: finiteOrNull(item.value),
          label: normalizeText(item.label) || labels[index] || `Point ${index + 1}`,
          type: item.type === "total" ? "total" : "delta",
        };
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
