import { createIcon } from "../icon.js";

const definition = {
  name: "circle-parking",
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
 * Creates the circle-parking icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleParking(options) {
  return createIcon(definition, options);
}

export default CircleParking;
