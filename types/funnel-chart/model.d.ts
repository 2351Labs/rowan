/**
 * Funnel stages skip null and negatives. Finite 0 is a stage. The host does
 * not auto-sort.
 * @param {import("../chart/model.js").RowanNormalizedChartSeries | undefined} series
 */
export function funnelStages(
  series: import("../chart/model.js").RowanNormalizedChartSeries | undefined,
): {
  index: number;
  label: string;
  value: number | null;
  included: boolean;
}[];
/**
 * @param {ReturnType<typeof funnelStages>} stages
 * @param {"funnel" | "cone" | "pyramid"} variant
 * @param {{ left: number, top: number, width: number, height: number }} plot
 */
export function funnelTrapezoids(
  stages: ReturnType<typeof funnelStages>,
  variant: "funnel" | "cone" | "pyramid",
  plot: {
    left: number;
    top: number;
    width: number;
    height: number;
  },
): {
  order: number;
  y: number;
  height: number;
  topX: number;
  topWidth: number;
  bottomX: number;
  bottomWidth: number;
  index: number;
  label: string;
  value: number | null;
  included: boolean;
}[];
export function funnelPath(shape: any): string;
