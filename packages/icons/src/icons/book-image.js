import { createIcon } from "../icon.js";

const definition = {
  name: "book-image",
  nodes: [
    [
      "path",
      {
        d: "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17",
      },
    ],
    [
      "path",
      {
        d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "8",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the book-image icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookImage(options) {
  return createIcon(definition, options);
}

export default BookImage;
