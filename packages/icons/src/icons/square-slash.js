import { createIcon } from "../icon.js";

const definition = {
  name: "square-slash",
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
      "line",
      {
        x1: "9",
        x2: "15",
        y1: "15",
        y2: "9",
      },
    ],
  ],
};

/**
 * Creates the square-slash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareSlash(options) {
  return createIcon(definition, options);
}

export default SquareSlash;
