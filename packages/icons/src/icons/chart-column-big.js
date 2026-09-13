import { createIcon } from "../icon.js";

const definition = {
  name: "chart-column-big",
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
        x: "15",
        y: "5",
        width: "4",
        height: "12",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "8",
        width: "4",
        height: "9",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the chart-column-big icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartColumnBig(options) {
  return createIcon(definition, options);
}

export default ChartColumnBig;
