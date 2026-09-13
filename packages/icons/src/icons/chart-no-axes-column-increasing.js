import { createIcon } from "../icon.js";

const definition = {
  name: "chart-no-axes-column-increasing",
  nodes: [
    [
      "path",
      {
        d: "M5 21v-6",
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
        d: "M19 21V3",
      },
    ],
  ],
};

/**
 * Creates the chart-no-axes-column-increasing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartNoAxesColumnIncreasing(options) {
  return createIcon(definition, options);
}

export default ChartNoAxesColumnIncreasing;
