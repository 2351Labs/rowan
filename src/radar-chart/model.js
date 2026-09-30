import { barValueDomain } from "../chart/model.js";

/**
 * Polar helpers for `rowan-radar-chart`. Functions only — not a public chart
 * base. Angle 0 is the first category at the top; later categories go clockwise.
 */

/**
 * @param {number} index
 * @param {number} count
 */
export function radarAngle(index, count) {
  const n = Math.max(count, 1);
  return -Math.PI / 2 + (2 * Math.PI * index) / n;
}

/**
 * @param {number | null} value
 * @param {{ min: number, max: number }} domain
 * @param {number} maxRadius
 */
export function radarRadius(value, domain, maxRadius) {
  if (value === null || !Number.isFinite(value)) return 0;
  const span = domain.max - domain.min;
  if (span === 0) return 0;
  const t = (value - domain.min) / span;
  return Math.max(0, t) * maxRadius;
}

/**
 * @param {number} index
 * @param {number} count
 * @param {number | null} value
 * @param {{ min: number, max: number }} domain
 * @param {number} cx
 * @param {number} cy
 * @param {number} maxRadius
 */
export function radarPoint(index, count, value, domain, cx, cy, maxRadius) {
  const angle = radarAngle(index, count);
  const r = radarRadius(value, domain, maxRadius);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
    angle,
    r,
  };
}

/**
 * @param {number} index
 * @param {number} count
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function radarRingPoint(index, count, cx, cy, radius) {
  const angle = radarAngle(index, count);
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
    angle,
  };
}

/**
 * @param {number} count
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function radarPolygonPath(count, cx, cy, radius) {
  if (count < 3) return "";
  const parts = [];
  for (let index = 0; index < count; index += 1) {
    const point = radarRingPoint(index, count, cx, cy, radius);
    parts.push(`${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }
  return `${parts.join(" ")} Z`;
}

/**
 * @param {Array<{ index: number, x: number, y: number }>} points
 * @param {number} categoryCount
 */
export function radarLinePath(points, categoryCount) {
  if (!points.length) return "";

  const parts = [];
  let previousIndex = null;
  for (const point of points) {
    const join = previousIndex !== null && point.index === previousIndex + 1;
    parts.push(`${join ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`);
    previousIndex = point.index;
  }

  const complete =
    points.length === categoryCount &&
    categoryCount >= 3 &&
    points.every((point, index) => point.index === index);
  if (complete) parts.push("Z");
  return parts.join(" ");
}

/**
 * Fill only a complete ring. A null axis breaks the fill so the gap is not
 * read as zero.
 * @param {Array<{ index: number, x: number, y: number }>} points
 * @param {number} categoryCount
 */
export function radarAreaPath(points, categoryCount) {
  const complete =
    points.length === categoryCount &&
    categoryCount >= 3 &&
    points.every((point, index) => point.index === index);
  return complete ? radarLinePath(points, categoryCount) : "";
}

/**
 * @param {import("../chart/model.js").RowanNormalizedChartSeries[]} series
 */
export function radarDomain(series) {
  return barValueDomain(series);
}

/**
 * @param {number} angle
 */
export function radarTextAnchor(angle) {
  const cosine = Math.cos(angle);
  if (cosine > 0.35) return "start";
  if (cosine < -0.35) return "end";
  return "middle";
}

/**
 * @param {number} angle
 */
export function radarDominantBaseline(angle) {
  const sine = Math.sin(angle);
  if (sine > 0.35) return "hanging";
  if (sine < -0.35) return "auto";
  return "middle";
}
