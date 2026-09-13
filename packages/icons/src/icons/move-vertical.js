import { createIcon } from "../icon.js";

const definition = {
  name: "move-vertical",
  nodes: [
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
    [
      "path",
      {
        d: "m8 18 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "m8 6 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the move-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveVertical(options) {
  return createIcon(definition, options);
}

export default MoveVertical;
