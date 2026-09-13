import { createIcon } from "../icon.js";

const definition = {
  name: "square-chevron-left",
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
        d: "m14 16-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the square-chevron-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareChevronLeft(options) {
  return createIcon(definition, options);
}

export default SquareChevronLeft;
