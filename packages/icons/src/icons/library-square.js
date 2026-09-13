import { createIcon } from "../icon.js";

const definition = {
  name: "library-square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 7v10",
      },
    ],
    [
      "path",
      {
        d: "M11 7v10",
      },
    ],
    [
      "path",
      {
        d: "m15 7 2 10",
      },
    ],
  ],
};

/**
 * Creates the library-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LibrarySquare(options) {
  return createIcon(definition, options);
}

export default LibrarySquare;
