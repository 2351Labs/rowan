import { createIcon } from "../icon.js";

const definition = {
  name: "tally-5",
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
    [
      "path",
      {
        d: "M19 4v16",
      },
    ],
    [
      "path",
      {
        d: "M22 6 2 18",
      },
    ],
  ],
};

/**
 * Creates the tally-5 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tally5(options) {
  return createIcon(definition, options);
}

export default Tally5;
