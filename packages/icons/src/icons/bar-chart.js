import { createIcon } from "../icon.js";

const definition = {
  name: "bar-chart",
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
 * Creates the bar-chart icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BarChart(options) {
  return createIcon(definition, options);
}

export default BarChart;
