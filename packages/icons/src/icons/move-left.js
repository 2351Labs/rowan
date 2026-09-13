import { createIcon } from "../icon.js";

const definition = {
  name: "move-left",
  nodes: [
    [
      "path",
      {
        d: "M6 8L2 12L6 16",
      },
    ],
    [
      "path",
      {
        d: "M2 12H22",
      },
    ],
  ],
};

/**
 * Creates the move-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveLeft(options) {
  return createIcon(definition, options);
}

export default MoveLeft;
