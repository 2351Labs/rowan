/**
 * @param {{
 *   rows?: unknown,
 *   columns?: unknown,
 *   values?: unknown,
 *   points?: unknown,
 * }} [input]
 * @returns {RowanHeatmap}
 */
export function normalizeHeatmap(
  input?:
    | {
        rows?: unknown;
        columns?: unknown;
        values?: unknown;
        points?: unknown;
      }
    | undefined,
): RowanHeatmap;
/**
 * @param {{ rows: string[], columns: string[] }} value
 * @param {(index: number) => string} [resolveRowFallback]
 * @param {(index: number) => string} [resolveColumnFallback]
 */
export function resolveHeatmapLabels(
  value: {
    rows: string[];
    columns: string[];
  },
  resolveRowFallback?: ((index: number) => string) | undefined,
  resolveColumnFallback?: ((index: number) => string) | undefined,
): {
  rows: string[];
  columns: string[];
};
export function heatmapValueDomain(values: any): {
  min: number;
  max: number;
};
/**
 * @param {Array<Array<number | null>>} values
 * @returns {Array<Array<number | null>>}
 */
export function cloneHeatmapValues(
  values: Array<Array<number | null>>,
): Array<Array<number | null>>;
export function cloneHeatmapInput(value?: {}): {
  rows: any[];
  columns: any[];
  values: (number | null)[][];
  points: any;
};
/**
 * @param {RowanHeatmap} value
 * @returns {RowanHeatmap}
 */
export function cloneHeatmap(value: RowanHeatmap): RowanHeatmap;
export type RowanHeatmap = {
  rows: string[];
  columns: string[];
  values: Array<Array<number | null>>;
};
