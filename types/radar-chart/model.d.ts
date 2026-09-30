/**
 * Polar helpers for `rowan-radar-chart`. Functions only — not a public chart
 * base. Angle 0 is the first category at the top; later categories go clockwise.
 */
/**
 * @param {number} index
 * @param {number} count
 */
export function radarAngle(index: number, count: number): number;
/**
 * @param {number | null} value
 * @param {{ min: number, max: number }} domain
 * @param {number} maxRadius
 */
export function radarRadius(value: number | null, domain: {
    min: number;
    max: number;
}, maxRadius: number): number;
/**
 * @param {number} index
 * @param {number} count
 * @param {number | null} value
 * @param {{ min: number, max: number }} domain
 * @param {number} cx
 * @param {number} cy
 * @param {number} maxRadius
 */
export function radarPoint(index: number, count: number, value: number | null, domain: {
    min: number;
    max: number;
}, cx: number, cy: number, maxRadius: number): {
    x: number;
    y: number;
    angle: number;
    r: number;
};
/**
 * @param {number} index
 * @param {number} count
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function radarRingPoint(index: number, count: number, cx: number, cy: number, radius: number): {
    x: number;
    y: number;
    angle: number;
};
/**
 * @param {number} count
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function radarPolygonPath(count: number, cx: number, cy: number, radius: number): string;
/**
 * @param {Array<{ index: number, x: number, y: number }>} points
 * @param {number} categoryCount
 */
export function radarLinePath(points: Array<{
    index: number;
    x: number;
    y: number;
}>, categoryCount: number): string;
/**
 * Fill only a complete ring. A null axis breaks the fill so the gap is not
 * read as zero.
 * @param {Array<{ index: number, x: number, y: number }>} points
 * @param {number} categoryCount
 */
export function radarAreaPath(points: Array<{
    index: number;
    x: number;
    y: number;
}>, categoryCount: number): string;
/**
 * @param {import("../chart/model.js").RowanNormalizedChartSeries[]} series
 */
export function radarDomain(series: import("../chart/model.js").RowanNormalizedChartSeries[]): {
    min: number;
    max: number;
};
/**
 * @param {number} angle
 */
export function radarTextAnchor(angle: number): "middle" | "start" | "end";
/**
 * @param {number} angle
 */
export function radarDominantBaseline(angle: number): "middle" | "auto" | "hanging";
