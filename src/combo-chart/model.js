import {
  barValueDomain,
  cloneChartSeriesInput,
  normalizeChartLabels,
  normalizeChartSeries,
} from "../chart/model.js";

const GEOMETRIES = new Set(["bar", "line"]);
const AXES = new Set(["primary", "secondary"]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeEnum(value, allowed, fallback) {
  const text = String(value ?? "").trim();
  return allowed.has(text) ? text : fallback;
}

/**
 * @param {unknown} value
 */
export function cloneComboSeriesInput(value) {
  if (!Array.isArray(value)) return [];

  return value.map((series) => {
    const cloned = cloneChartSeriesInput([series])[0];
    if (!isObject(series) || !isObject(cloned)) return cloned;
    return {
      ...cloned,
      geometry: series.geometry,
      axis: series.axis,
    };
  });
}

/**
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeComboSeries(value, labels = []) {
  const source = Array.isArray(value) ? value : [];
  const normalized = normalizeChartSeries(source, labels);

  return normalized.map((series, index) => {
    const input = isObject(source[index]) ? source[index] : {};
    return {
      ...series,
      geometry: normalizeEnum(input.geometry, GEOMETRIES, "bar"),
      axis: normalizeEnum(input.axis, AXES, "primary"),
    };
  });
}

/**
 * @param {Array<{ axis?: string, values: Array<{ value: number | null }> }>} series
 * @param {"primary" | "secondary"} axis
 */
export function comboAxisDomain(series, axis) {
  const items = series.filter((item) => item.axis === axis);
  if (items.length === 0) return { min: 0, max: 1 };

  if (axis === "secondary") {
    const domain = barValueDomain(items);
    if (domain.min >= 0 && domain.max <= 100) return { min: 0, max: 100 };
    return domain;
  }

  return barValueDomain(items);
}

export { normalizeChartLabels };
