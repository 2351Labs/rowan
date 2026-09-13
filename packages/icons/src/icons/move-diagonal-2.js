import { createIcon } from "../icon.js";

const definition = {
  name: "move-diagonal-2",
  nodes: [
    [
      "path",
      {
        d: "M19 13v6h-6",
      },
    ],
    [
      "path",
      {
        d: "M5 11V5h6",
      },
    ],
    [
      "path",
      {
        d: "m5 5 14 14",
      },
    ],
  ],
};

/**
 * Creates the move-diagonal-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveDiagonal2(options) {
  return createIcon(definition, options);
}

export default MoveDiagonal2;
