import { createIcon } from "../icon.js";

const definition = {
  name: "bar-chart-2",
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
 * Creates the bar-chart-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BarChart2(options) {
  return createIcon(definition, options);
}

export default BarChart2;
