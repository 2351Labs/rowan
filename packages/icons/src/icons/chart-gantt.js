import { createIcon } from "../icon.js";

const definition = {
  name: "chart-gantt",
  nodes: [
    [
      "path",
      {
        d: "M10 6h8",
      },
    ],
    [
      "path",
      {
        d: "M12 16h6",
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
        d: "M8 11h7",
      },
    ],
  ],
};

/**
 * Creates the chart-gantt icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartGantt(options) {
  return createIcon(definition, options);
}

export default ChartGantt;
