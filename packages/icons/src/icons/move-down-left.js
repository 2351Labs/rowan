import { createIcon } from "../icon.js";

const definition = {
  name: "move-down-left",
  nodes: [
    [
      "path",
      {
        d: "M11 19H5V13",
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
 * Creates the move-down-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveDownLeft(options) {
  return createIcon(definition, options);
}

export default MoveDownLeft;
