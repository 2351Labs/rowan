import { createIcon } from "../icon.js";

const definition = {
  name: "move-horizontal",
  nodes: [
    [
      "path",
      {
        d: "m18 8 4 4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20",
      },
    ],
    [
      "path",
      {
        d: "m6 8-4 4 4 4",
      },
    ],
  ],
};

/**
 * Creates the move-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveHorizontal(options) {
  return createIcon(definition, options);
}

export default MoveHorizontal;
