import { createIcon } from "../icon.js";

const definition = {
  name: "diamond",
  nodes: [
    [
      "path",
      {
        d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
      },
    ],
  ],
};

/**
 * Creates the diamond icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Diamond(options) {
  return createIcon(definition, options);
}

export default Diamond;
