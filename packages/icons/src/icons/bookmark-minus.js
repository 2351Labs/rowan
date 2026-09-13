import { createIcon } from "../icon.js";

const definition = {
  name: "bookmark-minus",
  nodes: [
    [
      "path",
      {
        d: "M15 10H9",
      },
    ],
    [
      "path",
      {
        d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      },
    ],
  ],
};

/**
 * Creates the bookmark-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookmarkMinus(options) {
  return createIcon(definition, options);
}

export default BookmarkMinus;
