import { createIcon } from "../icon.js";

const definition = {
  name: "square-chevron-up",
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
        d: "m8 14 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the square-chevron-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareChevronUp(options) {
  return createIcon(definition, options);
}

export default SquareChevronUp;
