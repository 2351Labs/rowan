import { createIcon } from "../icon.js";

const definition = {
  name: "iteration-cw",
  nodes: [
    [
      "path",
      {
        d: "M4 10a8 8 0 1 1 8 8H4",
      },
    ],
    [
      "path",
      {
        d: "m8 22-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the iteration-cw icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function IterationCw(options) {
  return createIcon(definition, options);
}

export default IterationCw;
