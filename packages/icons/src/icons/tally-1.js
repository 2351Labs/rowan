import { createIcon } from "../icon.js";

const definition = {
  name: "tally-1",
  nodes: [
    [
      "path",
      {
        d: "M4 4v16",
      },
    ],
  ],
};

/**
 * Creates the tally-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tally1(options) {
  return createIcon(definition, options);
}

export default Tally1;
