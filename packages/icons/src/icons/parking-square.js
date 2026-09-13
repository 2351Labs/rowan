import { createIcon } from "../icon.js";

const definition = {
  name: "parking-square",
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
 * Creates the parking-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ParkingSquare(options) {
  return createIcon(definition, options);
}

export default ParkingSquare;
