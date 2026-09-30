import { donutSlices } from "../chart/model.js";

/**
 * Funnel stages skip null and negatives, like donut slices. The host does
 * not auto-sort.
 * @param {import("../chart/model.js").RowanNormalizedChartSeries | undefined} series
 */
export function funnelStages(series) {
  return donutSlices(series);
}

/**
 * @param {ReturnType<typeof funnelStages>} stages
 * @param {"funnel" | "cone" | "pyramid"} variant
 * @param {{ left: number, top: number, width: number, height: number }} plot
 */
export function funnelTrapezoids(stages, variant, plot) {
  const included = stages.filter((stage) => stage.included);
  if (!included.length) return [];

  const max = Math.max(...included.map((stage) => stage.value));
  const count = included.length;
  const band = plot.height / count;
  const center = plot.left + plot.width / 2;

  return included.map((stage, order) => {
    const next = included[order + 1];
    const currentWidth = (stage.value / max) * plot.width;
    let nextWidth = next ? (next.value / max) * plot.width : currentWidth;
    if (variant === "cone" && !next) nextWidth = 0;
    const pyramid = variant === "pyramid";
    const topWidth = pyramid ? nextWidth : currentWidth;
    const bottomWidth = pyramid ? currentWidth : nextWidth;
    const stackIndex = pyramid ? count - 1 - order : order;
    const y = plot.top + stackIndex * band;
    return {
      ...stage,
      order,
      y,
      height: band,
      topX: center - topWidth / 2,
      topWidth,
      bottomX: center - bottomWidth / 2,
      bottomWidth,
    };
  });
}

export function funnelPath(shape) {
  const y2 = shape.y + shape.height;
  return `M${shape.topX.toFixed(2)},${shape.y.toFixed(2)} L${(shape.topX + shape.topWidth).toFixed(2)},${shape.y.toFixed(2)} L${(shape.bottomX + shape.bottomWidth).toFixed(2)},${y2.toFixed(2)} L${shape.bottomX.toFixed(2)},${y2.toFixed(2)} Z`;
}
