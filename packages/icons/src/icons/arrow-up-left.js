import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-left",
  nodes: [
    [
      "path",
      {
        d: "M7 17V7h10",
      },
    ],
    [
      "path",
      {
        d: "M17 17 7 7",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpLeft(options) {
  return createIcon(definition, options);
}

export default ArrowUpLeft;
