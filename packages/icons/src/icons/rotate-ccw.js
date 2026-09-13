import { createIcon } from "../icon.js";

const definition = {
  name: "rotate-ccw",
  nodes: [
    [
      "path",
      {
        d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
  ],
};

/**
 * Creates the rotate-ccw icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RotateCcw(options) {
  return createIcon(definition, options);
}

export default RotateCcw;
