import { createIcon } from "../icon.js";

const definition = {
  name: "move-up-right",
  nodes: [
    [
      "path",
      {
        d: "M13 5H19V11",
      },
    ],
    [
      "path",
      {
        d: "M19 5L5 19",
      },
    ],
  ],
};

/**
 * Creates the move-up-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveUpRight(options) {
  return createIcon(definition, options);
}

export default MoveUpRight;
