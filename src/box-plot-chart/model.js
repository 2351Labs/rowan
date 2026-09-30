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

function padDomain(values) {
  if (!values.length) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min !== max) return { min, max };
  const padding = Math.max(1, Math.abs(min) * 0.1);
  return { min: min - padding, max: max + padding };
}

function normalizeOutliers(value) {
  if (!Array.isArray(value)) return [];
  return value.map(finiteOrNull).filter((item) => item !== null);
}

/**
 * @param {unknown} value
 */
export function cloneBoxPlotSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) =>
            isObject(point)
              ? {
                  min: point.min,
                  q1: point.q1,
                  median: point.median,
                  q3: point.q3,
                  max: point.max,
                  outliers: Array.isArray(point.outliers) ? [...point.outliers] : point.outliers,
                  label: point.label,
                }
              : point,
          )
        : series.values,
    };
  });
}

/**
 * Five-number summaries are authored. The host does not compute quartiles.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeBoxPlotSeries(value, labels = []) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.flatMap((item, seriesIndex) => {
    if (!isObject(item)) return [];
    const baseId = normalizeText(item.id) || `series-${seriesIndex + 1}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    ids.add(id);
    const inputValues = Array.isArray(item.values) ? item.values : [];
    return [
      {
        id,
        label: normalizeText(item.label) || id,
        color: normalizeColor(item.color),
        values: inputValues.map((point, index) => {
          const itemPoint = isObject(point) ? point : {};
          return {
            min: finiteOrNull(itemPoint.min),
            q1: finiteOrNull(itemPoint.q1),
            median: finiteOrNull(itemPoint.median),
            q3: finiteOrNull(itemPoint.q3),
            max: finiteOrNull(itemPoint.max),
            outliers: normalizeOutliers(itemPoint.outliers),
            label: normalizeText(itemPoint.label) || labels[index] || `Point ${index + 1}`,
          };
        }),
      },
    ];
  });
}

export function cloneBoxPlotSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) => ({
      ...point,
      outliers: [...point.outliers],
    })),
  }));
}

export function boxPlotIncluded(point) {
  return [point.min, point.q1, point.median, point.q3, point.max].every((value) => value !== null);
}

export function boxPlotDomain(series) {
  const numbers = [];
  for (const item of series) {
    for (const point of item.values) {
      if (!boxPlotIncluded(point)) continue;
      numbers.push(point.min, point.q1, point.median, point.q3, point.max, ...point.outliers);
    }
  }
  return padDomain(numbers);
}
