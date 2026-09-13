import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-left",
  nodes: [
    [
      "path",
      {
        d: "M17 7 7 17",
      },
    ],
    [
      "path",
      {
        d: "M17 17H7V7",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownLeft(options) {
  return createIcon(definition, options);
}

export default ArrowDownLeft;
