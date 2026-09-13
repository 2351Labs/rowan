import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-right",
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
        d: "M8 12h8",
      },
    ],
    [
      "path",
      {
        d: "m12 16 4-4-4-4",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowRight(options) {
  return createIcon(definition, options);
}

export default SquareArrowRight;
