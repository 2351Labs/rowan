import { createIcon } from "../icon.js";

const definition = {
  name: "map-pin",
  nodes: [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "10",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the map-pin icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MapPin(options) {
  return createIcon(definition, options);
}

export default MapPin;
