import { createIcon } from "../icon.js";

const definition = {
  name: "rotate-ccw-square",
  nodes: [
    [
      "path",
      {
        d: "M20 9V7a2 2 0 0 0-2-2h-6",
      },
    ],
    [
      "path",
      {
        d: "m15 2-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2",
      },
    ],
  ],
};

/**
 * Creates the rotate-ccw-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RotateCcwSquare(options) {
  return createIcon(definition, options);
}

export default RotateCcwSquare;
