/**
 * Returns the source-order offset that follows the physical direction of a horizontal arrow key.
 * @param {Element} element
 * @param {string} key
 * @returns {-1 | 0 | 1}
 */
export function horizontalArrowKeyOffset(element, key) {
  let offset = 0;
  if (key === "ArrowRight") offset = 1;
  if (key === "ArrowLeft") offset = -1;
  if (offset === 0) return 0;

  return getComputedStyle(element).direction === "rtl" ? -offset : offset;
}
