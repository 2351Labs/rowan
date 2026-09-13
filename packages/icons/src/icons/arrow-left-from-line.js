import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left-from-line",
  nodes: [
    [
      "path",
      {
        d: "m9 6-6 6 6 6",
      },
    ],
    [
      "path",
      {
        d: "M3 12h14",
      },
    ],
    [
      "path",
      {
        d: "M21 19V5",
      },
    ],
  ],
};

/**
 * Creates the arrow-left-from-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeftFromLine(options) {
  return createIcon(definition, options);
}

export default ArrowLeftFromLine;
