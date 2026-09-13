import { createIcon } from "../icon.js";

const definition = {
  name: "tally-3",
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
    [
      "path",
      {
        d: "M14 4v16",
      },
    ],
  ],
};

/**
 * Creates the tally-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tally3(options) {
  return createIcon(definition, options);
}

export default Tally3;
