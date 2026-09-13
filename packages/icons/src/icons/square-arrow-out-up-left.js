import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-out-up-left",
  nodes: [
    [
      "path",
      {
        d: "M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6",
      },
    ],
    [
      "path",
      {
        d: "m3 3 9 9",
      },
    ],
    [
      "path",
      {
        d: "M3 9V3h6",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-out-up-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowOutUpLeft(options) {
  return createIcon(definition, options);
}

export default SquareArrowOutUpLeft;
