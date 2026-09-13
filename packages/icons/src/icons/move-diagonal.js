import { createIcon } from "../icon.js";

const definition = {
  name: "move-diagonal",
  nodes: [
    [
      "path",
      {
        d: "M11 19H5v-6",
      },
    ],
    [
      "path",
      {
        d: "M13 5h6v6",
      },
    ],
    [
      "path",
      {
        d: "M19 5 5 19",
      },
    ],
  ],
};

/**
 * Creates the move-diagonal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveDiagonal(options) {
  return createIcon(definition, options);
}

export default MoveDiagonal;
