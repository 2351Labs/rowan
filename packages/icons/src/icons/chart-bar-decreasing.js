import { createIcon } from "../icon.js";

const definition = {
  name: "chart-bar-decreasing",
  nodes: [
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
    [
      "path",
      {
        d: "M7 11h8",
      },
    ],
    [
      "path",
      {
        d: "M7 16h3",
      },
    ],
    [
      "path",
      {
        d: "M7 6h12",
      },
    ],
  ],
};

/**
 * Creates the chart-bar-decreasing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartBarDecreasing(options) {
  return createIcon(definition, options);
}

export default ChartBarDecreasing;
