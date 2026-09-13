import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-right-square",
  nodes: [
    [
      "path",
      {
        d: "M15 15V9H9",
      },
    ],
    [
      "path",
      {
        d: "m9 15 6-6",
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
 * Creates the arrow-up-right-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpRightSquare(options) {
  return createIcon(definition, options);
}

export default ArrowUpRightSquare;
