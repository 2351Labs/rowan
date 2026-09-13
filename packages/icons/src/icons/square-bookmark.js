import { createIcon } from "../icon.js";

const definition = {
  name: "square-bookmark",
  nodes: [
    [
      "path",
      {
        d: "M11 3v7.751a.25.25 0 00.407.195l2.28-1.834a.5.5 0 01.627 0l2.28 1.834a.25.25 0 00.406-.195V3",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the square-bookmark icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareBookmark(options) {
  return createIcon(definition, options);
}

export default SquareBookmark;
