import { createIcon } from "../icon.js";

const definition = {
  name: "bold",
  nodes: [
    [
      "path",
      {
        d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
      },
    ],
  ],
};

/**
 * Creates the bold icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bold(options) {
  return createIcon(definition, options);
}

export default Bold;
