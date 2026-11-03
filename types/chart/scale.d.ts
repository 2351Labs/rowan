/**
 * @param {number} value
 * @param {number} step
 */
export function roundTick(value: number, step: number): number;
/**
 * @param {number[]} values
 * @param {{ tickTarget?: number, padRatio?: number }} [options]
 * @returns {{ min: number, max: number, ticks: number[] }}
 */
export function niceLinearDomain(
  values: number[],
  {
    tickTarget,
    padRatio,
  }?:
    | {
        tickTarget?: number | undefined;
        padRatio?: number | undefined;
      }
    | undefined,
): {
  min: number;
  max: number;
  ticks: number[];
};
/**
 * Grow a nice domain until every data extreme is at least `insetRatio` of the
 * span in from the ends. Bubble radius uses this so a mark is not clipped.
 * @param {{ min: number, max: number, ticks: number[] }} domain
 * @param {number} dataMin
 * @param {number} dataMax
 * @param {number} insetRatio
 */
export function expandDomainForInset(
  domain: {
    min: number;
    max: number;
    ticks: number[];
  },
  dataMin: number,
  dataMax: number,
  insetRatio: number,
): {
  min: number;
  max: number;
  ticks: number[];
};
/**
 * Keep a zero baseline and lift the far end onto a 1-2-5 step past the data,
 * so a bar or line is not flush with the frame.
 * @param {{ min: number, max: number }} domain
 * @param {{ tickTarget?: number }} [options]
 * @returns {{ min: number, max: number, ticks: number[] }}
 */
export function zeroBaselineDomain(
  domain: {
    min: number;
    max: number;
  },
  {
    tickTarget,
  }?:
    | {
        tickTarget?: number | undefined;
      }
    | undefined,
): {
  min: number;
  max: number;
  ticks: number[];
};
/**
 * ViewBox coordinate for a value. `y` puts the domain max at `origin`.
 * @param {number} value
 * @param {{ min: number, max: number }} domain
 * @param {number} origin
 * @param {number} span
 * @param {"x" | "y"} [axis]
 */
export function scaleCoordinate(
  value: number,
  domain: {
    min: number;
    max: number;
  },
  origin: number,
  span: number,
  axis?: "y" | "x" | undefined,
): number;
/**
 * @param {number} coordinate
 * @param {number} viewSpan
 */
export function tickPercent(coordinate: number, viewSpan: number): string;
