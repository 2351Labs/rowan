import { createIcon } from "../icon.js";

const definition = {
  name: "command",
  nodes: [
    [
      "path",
      {
        d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
      },
    ],
  ],
};

/**
 * Creates the command icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Command(options) {
  return createIcon(definition, options);
}

export default Command;
