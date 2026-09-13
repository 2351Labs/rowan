import { createIcon } from "../icon.js";

const definition = {
  name: "rainbow",
  nodes: [
    [
      "path",
      {
        d: "M22 17a10 10 0 0 0-20 0",
      },
    ],
    [
      "path",
      {
        d: "M6 17a6 6 0 0 1 12 0",
      },
    ],
    [
      "path",
      {
        d: "M10 17a2 2 0 0 1 4 0",
      },
    ],
  ],
};

/**
 * Creates the rainbow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rainbow(options) {
  return createIcon(definition, options);
}

export default Rainbow;
