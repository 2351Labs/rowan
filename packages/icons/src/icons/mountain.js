import { createIcon } from "../icon.js";

const definition = {
  name: "mountain",
  nodes: [
    [
      "path",
      {
        d: "m8 3 4 8 5-5 5 15H2L8 3z",
      },
    ],
  ],
};

/**
 * Creates the mountain icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Mountain(options) {
  return createIcon(definition, options);
}

export default Mountain;
