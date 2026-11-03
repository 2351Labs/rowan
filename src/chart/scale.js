/**
 * Continuous axis scale. Expands the data extent so marks sit inside the plot,
 * then snaps the ends onto a 1-2-5 tick step.
 */

/**
 * @param {number} value
 * @param {boolean} round
 */
function niceNum(value, round) {
  if (!(value > 0) || !Number.isFinite(value)) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const fraction = value / magnitude;
  let nice = 10;
  if (round) {
    if (fraction < 1.5) nice = 1;
    else if (fraction < 3) nice = 2;
    else if (fraction < 7) nice = 5;
  } else if (fraction <= 1) nice = 1;
  else if (fraction <= 2) nice = 2;
  else if (fraction <= 5) nice = 5;
  return nice * magnitude;
}

/**
 * Decimal places needed to print `step` without binary noise.
 * @param {number} step
 */
function stepDecimals(step) {
  if (!(step > 0) || !Number.isFinite(step)) return 0;
  const [mantissa, exponentText] = step.toExponential().split("e");
  const fraction = mantissa.split(".")[1] ?? "";
  const digits = fraction.replace(/0+$/, "").length;
  return Math.max(0, Math.min(8, digits - Number(exponentText)));
}

/**
 * @param {number} value
 * @param {number} step
 */
export function roundTick(value, step) {
  const factor = 10 ** stepDecimals(step);
  return Math.round(value * factor) / factor;
}

/**
 * @param {number} value
 * @param {number} step
 * @param {"floor" | "ceil"} mode
 */
function snap(value, step, mode) {
  const quotient = value / step;
  const nudged = mode === "floor" ? Math.floor(quotient + 1e-8) : Math.ceil(quotient - 1e-8);
  return roundTick(nudged * step, step);
}

/**
 * @param {number} min
 * @param {number} max
 * @param {number} step
 */
function ticksBetween(min, max, step) {
  const count = Math.max(0, Math.round((max - min) / step));
  const ticks = [];
  for (let index = 0; index <= count; index += 1) {
    ticks.push(roundTick(min + index * step, step));
  }
  return ticks;
}

/**
 * @param {number[]} values
 * @param {{ tickTarget?: number, padRatio?: number }} [options]
 * @returns {{ min: number, max: number, ticks: number[] }}
 */
export function niceLinearDomain(values, { tickTarget = 4, padRatio = 0.08 } = {}) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length === 0) return { min: 0, max: 1, ticks: [0, 0.5, 1] };

  let dataMin = Math.min(...finite);
  let dataMax = Math.max(...finite);
  if (dataMin === dataMax) {
    const padding = Math.max(1, Math.abs(dataMin) * 0.1);
    dataMin -= padding;
    dataMax += padding;
  } else {
    const padding = (dataMax - dataMin) * Math.max(0, padRatio);
    dataMin -= padding;
    dataMax += padding;
  }

  const span = dataMax - dataMin || 1;
  const step = niceNum(niceNum(span, false) / Math.max(1, tickTarget - 1), true);
  let min = snap(dataMin, step, "floor");
  let max = snap(dataMax, step, "ceil");
  if (!(max > min)) {
    min = roundTick(min - step, step);
    max = roundTick(max + step, step);
  }

  return { min, max, ticks: ticksBetween(min, max, step) };
}

/**
 * Grow a nice domain until every data extreme is at least `insetRatio` of the
 * span in from the ends. Bubble radius uses this so a mark is not clipped.
 * @param {{ min: number, max: number, ticks: number[] }} domain
 * @param {number} dataMin
 * @param {number} dataMax
 * @param {number} insetRatio
 */
export function expandDomainForInset(domain, dataMin, dataMax, insetRatio) {
  if (!(insetRatio > 0) || !domain.ticks.length) return domain;
  const step =
    domain.ticks.length > 1 ? domain.ticks[1] - domain.ticks[0] : domain.max - domain.min || 1;
  let min = domain.min;
  let max = domain.max;
  for (let guard = 0; guard < 8; guard += 1) {
    const span = max - min || 1;
    const low = (dataMin - min) / span;
    const high = (max - dataMax) / span;
    if (low >= insetRatio - 1e-6 && high >= insetRatio - 1e-6) break;
    min = roundTick(min - step, step);
    max = roundTick(max + step, step);
  }
  if (min === domain.min && max === domain.max) return domain;
  return { min, max, ticks: ticksBetween(min, max, step) };
}

/**
 * Keep a zero baseline and lift the far end onto a 1-2-5 step past the data,
 * so a bar or line is not flush with the frame.
 * @param {{ min: number, max: number }} domain
 * @param {{ tickTarget?: number }} [options]
 * @returns {{ min: number, max: number, ticks: number[] }}
 */
export function zeroBaselineDomain(domain, { tickTarget = 4 } = {}) {
  const min = Number.isFinite(domain?.min) ? domain.min : 0;
  const max = Number.isFinite(domain?.max) ? domain.max : 1;
  if (min === max) return niceLinearDomain([min]);

  const low = Math.min(min, 0);
  const high = Math.max(max, 0);
  const extent = Math.max(high - low, 1);
  const step = niceNum(extent / Math.max(1, tickTarget - 1), true);
  let bottom = low < 0 ? snap(low, step, "floor") : 0;
  let top = high > 0 ? snap(high, step, "ceil") : 0;
  if (high > 0 && top <= high + step * 1e-6) top = roundTick(top + step, step);
  if (low < 0 && bottom >= low - step * 1e-6) bottom = roundTick(bottom - step, step);
  if (!(top > bottom)) top = roundTick(bottom + step, step);
  return { min: bottom, max: top, ticks: ticksBetween(bottom, top, step) };
}

/**
 * ViewBox coordinate for a value. `y` puts the domain max at `origin`.
 * @param {number} value
 * @param {{ min: number, max: number }} domain
 * @param {number} origin
 * @param {number} span
 * @param {"x" | "y"} [axis]
 */
export function scaleCoordinate(value, domain, origin, span, axis = "x") {
  const range = domain.max - domain.min || 1;
  if (axis === "y") return origin + ((domain.max - value) / range) * span;
  return origin + ((value - domain.min) / range) * span;
}

/**
 * @param {number} coordinate
 * @param {number} viewSpan
 */
export function tickPercent(coordinate, viewSpan) {
  return `${(coordinate / viewSpan) * 100}%`;
}
