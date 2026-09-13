import { createIcon } from "../icon.js";

const definition = {
  name: "move-up",
  nodes: [
    [
      "path",
      {
        d: "M8 6L12 2L16 6",
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
 * Creates the move-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoveUp(options) {
  return createIcon(definition, options);
}

export default MoveUp;
