import { createIcon } from "../icon.js";

const definition = {
  name: "book-check",
  nodes: [
    [
      "path",
      {
        d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      },
    ],
    [
      "path",
      {
        d: "m9 9.5 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the book-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookCheck(options) {
  return createIcon(definition, options);
}

export default BookCheck;
