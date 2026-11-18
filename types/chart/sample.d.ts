/**
 * Indexes whose y is the min or max of a bucket. Endpoints stay.
 * @param {Array<Array<number | null>>} columns
 * @param {number} start
 * @param {number} end
 * @param {number} cap
 */
export function bucketIndexes(
  columns: Array<Array<number | null>>,
  start: number,
  end: number,
  cap: number,
): number[];
/**
 * Replace the stride with min/max buckets. `paint` redraws when the caller is
 * not already inside render.
 * @param {HTMLElement} host
 * @param {string} key
 * @param {boolean} [paint]
 */
export function zoomWindow(host: HTMLElement, view: any, origin: any): void;
export function refine(host: any, token: any, paint?: boolean): void;
