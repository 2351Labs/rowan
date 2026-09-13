import { createIcon } from "../icon.js";

const definition = {
  name: "book-heart",
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
        d: "M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
      },
    ],
  ],
};

/**
 * Creates the book-heart icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookHeart(options) {
  return createIcon(definition, options);
}

export default BookHeart;
