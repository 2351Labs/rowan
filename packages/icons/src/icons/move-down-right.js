import { createIcon } from "../icon.js";

const definition = {
  name: "move-down-right",
  nodes: [
    [
      "path",
      {
        d: "M19 13V19H13",
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
 * Creates the move-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveDownRight(options) {
  return createIcon(definition, options);
}

export default MoveDownRight;
