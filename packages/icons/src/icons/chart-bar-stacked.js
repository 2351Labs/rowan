import { createIcon } from "../icon.js";

const definition = {
  name: "chart-bar-stacked",
  nodes: [
    [
      "path",
      {
        d: "M11 13v4",
      },
    ],
    [
      "path",
      {
        d: "M15 5v4",
      },
    ],
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "13",
        width: "9",
        height: "4",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "5",
        width: "12",
        height: "4",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the chart-bar-stacked icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartBarStacked(options) {
  return createIcon(definition, options);
}

export default ChartBarStacked;
