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

/**
 * @param {unknown} value
 */
export function cloneScatterSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      points: Array.isArray(series.points)
        ? series.points.map((point) =>
            isObject(point)
              ? { x: point.x, y: point.y, size: point.size, label: point.label }
              : point,
          )
        : series.points,
    };
  });
}

/**
 * @param {unknown} value
 */
export function normalizeScatterSeries(value) {
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

    const points = Array.isArray(item.points) ? item.points : [];
    return [
      {
        id,
        label: normalizeText(item.label) || id,
        color: normalizeColor(item.color),
        points: points.map((point, pointIndex) => {
          const sourcePoint = isObject(point) ? point : {};
          return {
            x: finiteOrNull(sourcePoint.x),
            y: finiteOrNull(sourcePoint.y),
            size: finiteOrNull(sourcePoint.size),
            label: normalizeText(sourcePoint.label) || `Point ${pointIndex + 1}`,
          };
        }),
      },
    ];
  });
}

export function cloneScatterSeries(value) {
  return value.map((series) => ({
    ...series,
    points: series.points.map((point) => ({ ...point })),
  }));
}

export function scatterDomains(series) {
  const xs = [];
  const ys = [];
  const sizes = [];
  for (const item of series) {
    for (const point of item.points) {
      if (point.x === null || point.y === null) continue;
      xs.push(point.x);
      ys.push(point.y);
      if (point.size !== null) sizes.push(point.size);
    }
  }
  return {
    x: padDomain(xs),
    y: padDomain(ys),
    size: sizes.length ? padDomain(sizes) : null,
  };
}
