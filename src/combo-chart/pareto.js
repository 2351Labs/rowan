function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Sort categories descending and build bar + cumulative-% series for
 * `rowan-combo-chart`. Nulls are omitted. The app assigns the result to
 * `labels` / `series`; the host does not auto-sort.
 *
 * @param {{
 *   values?: Array<number | null>,
 *   labels?: string[],
 *   bar?: { id?: string, label?: string },
 *   line?: { id?: string, label?: string },
 * }} [input]
 * @returns {{ labels: string[], series: object[] }}
 */
export function createParetoData(input = {}) {
  const values = Array.isArray(input.values) ? input.values : [];
  const labels = Array.isArray(input.labels) ? input.labels : [];
  const pairs = values
    .map((value, index) => ({
      label: String(labels[index] ?? `Category ${index + 1}`).trim() || `Category ${index + 1}`,
      value: value == null ? null : Number(value),
    }))
    .filter((item) => isFiniteNumber(item.value) && item.value >= 0)
    .sort((left, right) => right.value - left.value);

  const total = pairs.reduce((sum, item) => sum + item.value, 0) || 1;
  let running = 0;
  const cumulative = pairs.map((item) => {
    running += item.value;
    return (running / total) * 100;
  });

  return {
    labels: pairs.map((item) => item.label),
    series: [
      {
        id: String(input.bar?.id ?? "count").trim() || "count",
        label: String(input.bar?.label ?? "Count").trim() || "Count",
        geometry: "bar",
        axis: "primary",
        values: pairs.map((item) => item.value),
      },
      {
        id: String(input.line?.id ?? "cumulative").trim() || "cumulative",
        label: String(input.line?.label ?? "Cumulative %").trim() || "Cumulative %",
        geometry: "line",
        axis: "secondary",
        values: cumulative,
      },
    ],
  };
}
