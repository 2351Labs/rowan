import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-down-left",
  nodes: [
    [
      "path",
      {
        d: "M15 15H9l6-6",
      },
    ],
    [
      "path",
      {
        d: "M9 15V9",
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
 * Creates the square-arrow-down-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowDownLeft(options) {
  return createIcon(definition, options);
}

export default SquareArrowDownLeft;
