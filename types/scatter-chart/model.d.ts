/**
 * Map a size onto the bubble radius range. The ends of the size extent are
 * the min and max radius; a missing size stays a plain scatter mark.
 * @param {number | null} size
 * @param {{ min: number, max: number } | null} sizeDomain
 */
export function scatterRadius(
  size: number | null,
  sizeDomain: {
    min: number;
    max: number;
  } | null,
): number;
/**
 * @param {unknown} value
 */
export function cloneScatterSeriesInput(value: unknown): any[];
/**
 * @param {unknown} value
 */
export function normalizeScatterSeries(value: unknown): {
  id: string;
  label: string;
  color: string;
  points: any;
}[];
export function cloneScatterSeries(value: any): any;
/**
 * @param {RowanScatterChartPoint} point
 * @param {number} index
 * @param {(index: number) => string} [resolveFallbackLabel]
 */
export function resolveScatterPointLabel(
  point: RowanScatterChartPoint,
  index: number,
  resolveFallbackLabel?: ((index: number) => string) | undefined,
): string;
/**
 * @param {Array<{ points: Array<{ x: number | null, y: number | null, size: number | null }> }>} series
 * @param {{ xPadRatio?: number, yPadRatio?: number, xInsetRatio?: number, yInsetRatio?: number }} [options]
 */
export function scatterDomains(
  series: Array<{
    points: Array<{
      x: number | null;
      y: number | null;
      size: number | null;
    }>;
  }>,
  options?:
    | {
        xPadRatio?: number | undefined;
        yPadRatio?: number | undefined;
        xInsetRatio?: number | undefined;
        yInsetRatio?: number | undefined;
      }
    | undefined,
): {
  x: {
    min: number;
    max: number;
    ticks: number[];
  };
  y: {
    min: number;
    max: number;
    ticks: number[];
  };
  size: {
    min: number;
    max: number;
  } | null;
};
/** Smallest bubble in viewBox units. Large enough to stay visible when the plot scales down. */
export const SCATTER_MIN_RADIUS: 12;
/** Largest bubble in viewBox units. */
export const SCATTER_MAX_RADIUS: 36;
/** Radius when a point has no size encoding. */
export const SCATTER_POINT_RADIUS: 16;
/**
 * Normalized scatter point passed to a value formatter.
 */
export type RowanScatterChartPoint = {
  x: number | null;
  y: number | null;
  size: number | null;
  label: string;
};
/**
 * Normalized scatter series passed to a value formatter.
 */
export type RowanScatterChartSeries = {
  id: string;
  label: string;
  color: string;
  points: RowanScatterChartPoint[];
};
export type RowanScatterChartFormatContext = {
  series?: RowanScatterChartSeries | undefined;
  index?: number | undefined;
  label?: string | undefined;
  tick?: boolean | undefined;
};
export type RowanScatterChartValueFormatter = (
  value: number,
  context: RowanScatterChartFormatContext,
) => string;
