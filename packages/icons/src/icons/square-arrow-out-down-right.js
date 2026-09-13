import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-out-down-right",
  nodes: [
    [
      "path",
      {
        d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",
      },
    ],
    [
      "path",
      {
        d: "m21 21-9-9",
      },
    ],
    [
      "path",
      {
        d: "M21 15v6h-6",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-out-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowOutDownRight(options) {
  return createIcon(definition, options);
}

export default SquareArrowOutDownRight;
