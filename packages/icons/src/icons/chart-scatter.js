import { createIcon } from "../icon.js";

const definition = {
  name: "chart-scatter",
  nodes: [
    [
      "circle",
      {
        cx: "7.5",
        cy: "7.5",
        r: ".5",
        fill: "currentColor",
      },
    ],
    [
      "circle",
      {
        cx: "18.5",
        cy: "5.5",
        r: ".5",
        fill: "currentColor",
      },
    ],
    [
      "circle",
      {
        cx: "11.5",
        cy: "11.5",
        r: ".5",
        fill: "currentColor",
      },
    ],
    [
      "circle",
      {
        cx: "7.5",
        cy: "16.5",
        r: ".5",
        fill: "currentColor",
      },
    ],
    [
      "circle",
      {
        cx: "17.5",
        cy: "14.5",
        r: ".5",
        fill: "currentColor",
      },
    ],
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
  ],
};

/**
 * Creates the chart-scatter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartScatter(options) {
  return createIcon(definition, options);
}

export default ChartScatter;
