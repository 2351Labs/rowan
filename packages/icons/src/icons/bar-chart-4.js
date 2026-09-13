import { createIcon } from "../icon.js";

const definition = {
  name: "bar-chart-4",
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
 * Creates the bar-chart-4 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BarChart4(options) {
  return createIcon(definition, options);
}

export default BarChart4;
