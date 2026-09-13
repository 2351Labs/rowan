import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-right-square",
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
 * Creates the arrow-right-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowRightSquare(options) {
  return createIcon(definition, options);
}

export default ArrowRightSquare;
