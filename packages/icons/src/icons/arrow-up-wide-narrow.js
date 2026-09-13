import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-wide-narrow",
  nodes: [
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
    [
      "path",
      {
        d: "M11 12h10",
      },
    ],
    [
      "path",
      {
        d: "M11 16h7",
      },
    ],
    [
      "path",
      {
        d: "M11 20h4",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-wide-narrow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpWideNarrow(options) {
  return createIcon(definition, options);
}

export default ArrowUpWideNarrow;
