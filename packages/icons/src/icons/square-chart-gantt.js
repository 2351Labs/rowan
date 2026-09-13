import { createIcon } from "../icon.js";

const definition = {
  name: "square-chart-gantt",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M9 8h7",
      },
    ],
    [
      "path",
      {
        d: "M8 12h6",
      },
    ],
    [
      "path",
      {
        d: "M11 16h5",
      },
    ],
  ],
};

/**
 * Creates the square-chart-gantt icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareChartGantt(options) {
  return createIcon(definition, options);
}

export default SquareChartGantt;
