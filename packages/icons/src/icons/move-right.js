import { createIcon } from "../icon.js";

const definition = {
  name: "move-right",
  nodes: [
    [
      "path",
      {
        d: "M18 8L22 12L18 16",
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
 * Creates the move-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveRight(options) {
  return createIcon(definition, options);
}

export default MoveRight;
