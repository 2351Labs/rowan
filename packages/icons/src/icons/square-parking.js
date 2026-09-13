import { createIcon } from "../icon.js";

const definition = {
  name: "square-parking",
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
        d: "M9 17V7h4a3 3 0 0 1 0 6H9",
      },
    ],
  ],
};

/**
 * Creates the square-parking icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareParking(options) {
  return createIcon(definition, options);
}

export default SquareParking;
