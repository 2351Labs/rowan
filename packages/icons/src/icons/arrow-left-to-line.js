import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left-to-line",
  nodes: [
    [
      "path",
      {
        d: "M3 19V5",
      },
    ],
    [
      "path",
      {
        d: "m13 6-6 6 6 6",
      },
    ],
    [
      "path",
      {
        d: "M7 12h14",
      },
    ],
  ],
};

/**
 * Creates the arrow-left-to-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeftToLine(options) {
  return createIcon(definition, options);
}

export default ArrowLeftToLine;
