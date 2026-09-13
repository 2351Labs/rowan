import { createIcon } from "../icon.js";

const definition = {
  name: "chart-no-axes-column-decreasing",
  nodes: [
    [
      "path",
      {
        d: "M5 21V3",
      },
    ],
    [
      "path",
      {
        d: "M12 21V9",
      },
    ],
    [
      "path",
      {
        d: "M19 21v-6",
      },
    ],
  ],
};

/**
 * Creates the chart-no-axes-column-decreasing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartNoAxesColumnDecreasing(options) {
  return createIcon(definition, options);
}

export default ChartNoAxesColumnDecreasing;
