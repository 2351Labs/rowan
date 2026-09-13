import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-right",
  nodes: [
    [
      "path",
      {
        d: "M7 7h10v10",
      },
    ],
    [
      "path",
      {
        d: "M7 17 17 7",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpRight(options) {
  return createIcon(definition, options);
}

export default ArrowUpRight;
