import { createIcon } from "../icon.js";

const definition = {
  name: "parking-circle",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
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
 * Creates the parking-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ParkingCircle(options) {
  return createIcon(definition, options);
}

export default ParkingCircle;
