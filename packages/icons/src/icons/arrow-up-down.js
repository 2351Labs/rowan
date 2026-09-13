import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-down",
  nodes: [
    [
      "path",
      {
        d: "m21 16-4 4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M17 20V4",
      },
    ],
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpDown(options) {
  return createIcon(definition, options);
}

export default ArrowUpDown;
