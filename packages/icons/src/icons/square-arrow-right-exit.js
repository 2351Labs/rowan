import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-right-exit",
  nodes: [
    [
      "path",
      {
        d: "M10 12h11",
      },
    ],
    [
      "path",
      {
        d: "m17 16 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M21 6.344V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.344",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-right-exit icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowRightExit(options) {
  return createIcon(definition, options);
}

export default SquareArrowRightExit;
