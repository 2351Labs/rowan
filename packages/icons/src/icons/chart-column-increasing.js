import { createIcon } from "../icon.js";

const definition = {
  name: "chart-column-increasing",
  nodes: [
    [
      "path",
      {
        d: "M13 17V9",
      },
    ],
    [
      "path",
      {
        d: "M18 17V5",
      },
    ],
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
    [
      "path",
      {
        d: "M8 17v-3",
      },
    ],
  ],
};

/**
 * Creates the chart-column-increasing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartColumnIncreasing(options) {
  return createIcon(definition, options);
}

export default ChartColumnIncreasing;
