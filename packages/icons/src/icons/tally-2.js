import { createIcon } from "../icon.js";

const definition = {
  name: "tally-2",
  nodes: [
    [
      "path",
      {
        d: "M4 4v16",
      },
    ],
    [
      "path",
      {
        d: "M9 4v16",
      },
    ],
  ],
};

/**
 * Creates the tally-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tally2(options) {
  return createIcon(definition, options);
}

export default Tally2;
