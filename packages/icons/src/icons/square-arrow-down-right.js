import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-down-right",
  nodes: [
    [
      "path",
      {
        d: "M15 15 9 9",
      },
    ],
    [
      "path",
      {
        d: "M9 15h6V9",
      },
    ],
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
  ],
};

/**
 * Creates the square-arrow-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowDownRight(options) {
  return createIcon(definition, options);
}

export default SquareArrowDownRight;
