import { createIcon } from "../icon.js";

const definition = {
  name: "divide",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "6",
        r: "1",
      },
    ],
    [
      "line",
      {
        x1: "5",
        x2: "19",
        y1: "12",
        y2: "12",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "18",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the divide icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Divide(options) {
  return createIcon(definition, options);
}

export default Divide;
