import { createIcon } from "../icon.js";

const definition = {
  name: "repeat-1",
  nodes: [
    [
      "path",
      {
        d: "m17 2 4 4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M3 11v-1a4 4 0 0 1 4-4h14",
      },
    ],
    [
      "path",
      {
        d: "m7 22-4-4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M21 13v1a4 4 0 0 1-4 4H3",
      },
    ],
    [
      "path",
      {
        d: "M11 10h1v4",
      },
    ],
  ],
};

/**
 * Creates the repeat-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Repeat1(options) {
  return createIcon(definition, options);
}

export default Repeat1;
