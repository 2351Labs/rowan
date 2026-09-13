import { createIcon } from "../icon.js";

const definition = {
  name: "square-percent",
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
        d: "m15 9-6 6",
      },
    ],
    [
      "path",
      {
        d: "M9 9h.01",
      },
    ],
    [
      "path",
      {
        d: "M15 15h.01",
      },
    ],
  ],
};

/**
 * Creates the square-percent icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquarePercent(options) {
  return createIcon(definition, options);
}

export default SquarePercent;
