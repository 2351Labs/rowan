import { finiteOrNull } from "../chart/model.js";

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function numericValues(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const numeric = finiteOrNull(item);
    return numeric === null ? [] : [numeric];
  });
}

function formatEdge(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

/**
 * Bin numeric samples for `rowan-bar-chart`. Nulls are omitted. The app
 * assigns the result to `labels` / `series`; the host does not bin.
 *
 * @param {{
 *   values?: Array<number | null>,
 *   bins?: number | number[],
 *   id?: string,
 *   label?: string,
 * }} [input]
 * @returns {{ labels: string[], series: Array<{ id: string, label: string, values: number[] }> }}
 */
export function createHistogramData(input = {}) {
  const values = numericValues(input.values);
  const id = String(input.id ?? "count").trim() || "count";
  const label = String(input.label ?? "Count").trim() || "Count";
  const empty = { labels: [], series: [{ id, label, values: [] }] };

  let edges = [];
  if (Array.isArray(input.bins)) {
    edges = input.bins.map(finiteOrNull).filter(isFiniteNumber);
    edges.sort((left, right) => left - right);
  } else {
    const count = Math.max(1, Math.floor(finiteOrNull(input.bins) || 5));
    if (!values.length) return empty;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    edges = Array.from({ length: count + 1 }, (_value, index) => min + (span * index) / count);
  }

  if (edges.length < 2) return empty;

  const binCount = edges.length - 1;
  const counts = Array.from({ length: binCount }, () => 0);
  for (const value of values) {
    let bin = -1;
    for (let index = 0; index < binCount; index += 1) {
      const start = edges[index];
      const end = edges[index + 1];
      const last = index === binCount - 1;
      if (value >= start && (value < end || (last && value <= end))) {
        bin = index;
        break;
      }
    }
    if (bin >= 0) counts[bin] += 1;
  }

  return {
    labels: counts.map(
      (_count, index) => `${formatEdge(edges[index])}–${formatEdge(edges[index + 1])}`,
    ),
    series: [{ id, label, values: counts }],
  };
}
