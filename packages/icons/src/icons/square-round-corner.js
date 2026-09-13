import { createIcon } from "../icon.js";

const definition = {
  name: "square-round-corner",
  nodes: [
    [
      "path",
      {
        d: "M21 11a8 8 0 0 0-8-8",
      },
    ],
    [
      "path",
      {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      },
    ],
  ],
};

/**
 * Creates the square-round-corner icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareRoundCorner(options) {
  return createIcon(definition, options);
}

export default SquareRoundCorner;
