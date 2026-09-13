import { createIcon } from "../icon.js";

const definition = {
  name: "square-square",
  nodes: [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "8",
        y: "8",
        width: "8",
        height: "8",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the square-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareSquare(options) {
  return createIcon(definition, options);
}

export default SquareSquare;
