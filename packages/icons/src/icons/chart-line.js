import { createIcon } from "../icon.js";

const definition = {
  name: "chart-line",
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
        d: "m19 9-5 5-4-4-3 3",
      },
    ],
  ],
};

/**
 * Creates the chart-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartLine(options) {
  return createIcon(definition, options);
}

export default ChartLine;
