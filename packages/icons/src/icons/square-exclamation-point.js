import { createIcon } from "../icon.js";

const definition = {
  name: "square-exclamation-point",
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
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "12",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12.01",
        y1: "16",
        y2: "16",
      },
    ],
  ],
};

/**
 * Creates the square-exclamation-point icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareExclamationPoint(options) {
  return createIcon(definition, options);
}

export default SquareExclamationPoint;
