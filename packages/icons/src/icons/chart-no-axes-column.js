import { createIcon } from "../icon.js";

const definition = {
  name: "chart-no-axes-column",
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
        d: "M12 21V3",
      },
    ],
    [
      "path",
      {
        d: "M19 21V9",
      },
    ],
  ],
};

/**
 * Creates the chart-no-axes-column icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartNoAxesColumn(options) {
  return createIcon(definition, options);
}

export default ChartNoAxesColumn;
