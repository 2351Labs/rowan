import { createIcon } from "../icon.js";

const definition = {
  name: "move-up-left",
  nodes: [
    [
      "path",
      {
        d: "M5 11V5H11",
      },
    ],
    [
      "path",
      {
        d: "M5 5L19 19",
      },
    ],
  ],
};

/**
 * Creates the move-up-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveUpLeft(options) {
  return createIcon(definition, options);
}

export default MoveUpLeft;
