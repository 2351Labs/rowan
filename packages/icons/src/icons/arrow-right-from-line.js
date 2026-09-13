import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-right-from-line",
  nodes: [
    [
      "path",
      {
        d: "M3 5v14",
      },
    ],
    [
      "path",
      {
        d: "M21 12H7",
      },
    ],
    [
      "path",
      {
        d: "m15 18 6-6-6-6",
      },
    ],
  ],
};

/**
 * Creates the arrow-right-from-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowRightFromLine(options) {
  return createIcon(definition, options);
}

export default ArrowRightFromLine;
