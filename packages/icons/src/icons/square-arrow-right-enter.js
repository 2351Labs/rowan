import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-right-enter",
  nodes: [
    [
      "path",
      {
        d: "m10 16 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M3 12h11",
      },
    ],
    [
      "path",
      {
        d: "M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-right-enter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowRightEnter(options) {
  return createIcon(definition, options);
}

export default SquareArrowRightEnter;
