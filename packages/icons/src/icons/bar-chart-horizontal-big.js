import { createIcon } from "../icon.js";

const definition = {
  name: "bar-chart-horizontal-big",
  nodes: [
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
 * Creates the bar-chart-horizontal-big icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BarChartHorizontalBig(options) {
  return createIcon(definition, options);
}

export default BarChartHorizontalBig;
