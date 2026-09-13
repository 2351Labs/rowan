import { createIcon } from "../icon.js";

const definition = {
  name: "square-chevron-down",
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
        d: "m16 10-4 4-4-4",
      },
    ],
  ],
};

/**
 * Creates the square-chevron-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareChevronDown(options) {
  return createIcon(definition, options);
}

export default SquareChevronDown;
