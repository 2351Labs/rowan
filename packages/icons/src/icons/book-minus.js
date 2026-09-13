import { createIcon } from "../icon.js";

const definition = {
  name: "book-minus",
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
        d: "M9 10h6",
      },
    ],
  ],
};

/**
 * Creates the book-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookMinus(options) {
  return createIcon(definition, options);
}

export default BookMinus;
