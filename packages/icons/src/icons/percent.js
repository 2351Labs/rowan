import { createIcon } from "../icon.js";

const definition = {
  name: "percent",
  nodes: [
    [
      "line",
      {
        x1: "19",
        x2: "5",
        y1: "5",
        y2: "19",
      },
    ],
    [
      "circle",
      {
        cx: "6.5",
        cy: "6.5",
        r: "2.5",
      },
    ],
    [
      "circle",
      {
        cx: "17.5",
        cy: "17.5",
        r: "2.5",
      },
    ],
  ],
};

/**
 * Creates the percent icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Percent(options) {
  return createIcon(definition, options);
}

export default Percent;
