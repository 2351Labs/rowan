import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-right",
  nodes: [
    [
      "path",
      {
        d: "M5 12h14",
      },
    ],
    [
      "path",
      {
        d: "m12 5 7 7-7 7",
      },
    ],
  ],
};

/**
 * Creates the arrow-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowRight(options) {
  return createIcon(definition, options);
}

export default ArrowRight;
