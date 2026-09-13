import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-right-square",
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
 * Creates the arrow-down-right-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownRightSquare(options) {
  return createIcon(definition, options);
}

export default ArrowDownRightSquare;
