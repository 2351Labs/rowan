import { createIcon } from "../icon.js";

const definition = {
  name: "book-user",
  nodes: [
    [
      "path",
      {
        d: "M15 13a3 3 0 1 0-6 0",
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
        cx: "12",
        cy: "8",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the book-user icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BookUser(options) {
  return createIcon(definition, options);
}

export default BookUser;
