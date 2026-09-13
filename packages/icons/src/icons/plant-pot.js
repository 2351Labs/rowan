import { createIcon } from "../icon.js";

const definition = {
  name: "plant-pot",
  nodes: [
    [
      "path",
      {
        d: "M14 8.536V6a4 4 0 014-4h1.5a.5.5 0 01.5.5V4a4 4 0 01-4 4 4 4 0 00-4 4 5 5 0 01-8-4 5 5 0 018 4c0 2 1 3 1 5",
      },
    ],
    [
      "path",
      {
        d: "m18 17-1.085 3.58A2 2 0 0115 22H9.002a2 2 0 01-1.913-1.418L6 17",
      },
    ],
    [
      "path",
      {
        d: "M5 17h14",
      },
    ],
  ],
};

/**
 * Creates the plant-pot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlantPot(options) {
  return createIcon(definition, options);
}

export default PlantPot;
