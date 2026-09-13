import { createIcon } from "../icon.js";

const definition = {
  name: "arrows-up-from-line",
  nodes: [
    [
      "path",
      {
        d: "m4 6 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M7 17V3",
      },
    ],
    [
      "path",
      {
        d: "m14 6 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M17 17V3",
      },
    ],
    [
      "path",
      {
        d: "M4 21h16",
      },
    ],
  ],
};

/**
 * Creates the arrows-up-from-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowsUpFromLine(options) {
  return createIcon(definition, options);
}

export default ArrowsUpFromLine;
