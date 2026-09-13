import { createIcon } from "../icon.js";

const definition = {
  name: "iteration-ccw",
  nodes: [
    [
      "path",
      {
        d: "m16 14 4 4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M20 10a8 8 0 1 0-8 8h8",
      },
    ],
  ],
};

/**
 * Creates the iteration-ccw icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function IterationCcw(options) {
  return createIcon(definition, options);
}

export default IterationCcw;
