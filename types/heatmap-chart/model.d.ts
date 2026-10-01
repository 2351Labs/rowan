/**
 * @param {{
 *   rows?: unknown,
 *   columns?: unknown,
 *   values?: unknown,
 *   points?: unknown,
 * }} [input]
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
): any;
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
export function cloneHeatmapValues(values: any): any;
export function cloneHeatmapInput(value?: {}): {
  rows: any[];
  columns: any[];
  values: any;
  points: any;
};
export function cloneHeatmap(value: any): {
  rows: any[];
  columns: any[];
  values: any;
};
