import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-right-to-line",
  nodes: [
    [
      "path",
      {
        d: "M17 12H3",
      },
    ],
    [
      "path",
      {
        d: "m11 18 6-6-6-6",
      },
    ],
    [
      "path",
      {
        d: "M21 5v14",
      },
    ],
  ],
};

/**
 * Creates the arrow-right-to-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowRightToLine(options) {
  return createIcon(definition, options);
}

export default ArrowRightToLine;
