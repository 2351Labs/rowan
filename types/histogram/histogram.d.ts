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
export function createHistogramData(
  input?:
    | {
        values?: (number | null)[] | undefined;
        bins?: number | number[] | undefined;
        id?: string | undefined;
        label?: string | undefined;
      }
    | undefined,
): {
  labels: string[];
  series: Array<{
    id: string;
    label: string;
    values: number[];
  }>;
};
