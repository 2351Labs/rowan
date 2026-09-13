import { createIcon } from "../icon.js";

const definition = {
  name: "square-chevron-right",
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
        d: "m10 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the square-chevron-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareChevronRight(options) {
  return createIcon(definition, options);
}

export default SquareChevronRight;
