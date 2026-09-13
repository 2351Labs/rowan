import { createIcon } from "../icon.js";

const definition = {
  name: "bookmark-x",
  nodes: [
    [
      "path",
      {
        d: "m14.5 7.5-5 5",
      },
    ],
    [
      "path",
      {
        d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      },
    ],
    [
      "path",
      {
        d: "m9.5 7.5 5 5",
      },
    ],
  ],
};

/**
 * Creates the bookmark-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookmarkX(options) {
  return createIcon(definition, options);
}

export default BookmarkX;
