import { createIcon } from "../icon.js";

const definition = {
  name: "move-down",
  nodes: [
    [
      "path",
      {
        d: "M8 18L12 22L16 18",
      },
    ],
    [
      "path",
      {
        d: "M12 2V22",
      },
    ],
  ],
};

/**
 * Creates the move-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveDown(options) {
  return createIcon(definition, options);
}

export default MoveDown;
