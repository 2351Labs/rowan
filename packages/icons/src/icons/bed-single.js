import { createIcon } from "../icon.js";

const definition = {
  name: "bed-single",
  nodes: [
    [
      "path",
      {
        d: "M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8",
      },
    ],
    [
      "path",
      {
        d: "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4",
      },
    ],
    [
      "path",
      {
        d: "M3 18h18",
      },
    ],
  ],
};

/**
 * Creates the bed-single icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BedSingle(options) {
  return createIcon(definition, options);
}

export default BedSingle;
