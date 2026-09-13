import { createIcon } from "../icon.js";

const definition = {
  name: "book-search",
  nodes: [
    [
      "path",
      {
        d: "M11 22H5.5a1 1 0 0 1 0-5h4.501",
      },
    ],
    [
      "path",
      {
        d: "m21 22-1.879-1.878",
      },
    ],
    [
      "path",
      {
        d: "M3 19.5v-15A2.5 2.5 0 0 1 5.5 2H18a1 1 0 0 1 1 1v8",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "18",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the book-search icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookSearch(options) {
  return createIcon(definition, options);
}

export default BookSearch;
