import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-right",
  nodes: [
    [
      "path",
      {
        d: "m7 7 10 10",
      },
    ],
    [
      "path",
      {
        d: "M17 7v10H7",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownRight(options) {
  return createIcon(definition, options);
}

export default ArrowDownRight;
