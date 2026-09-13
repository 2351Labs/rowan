import { createIcon } from "../icon.js";

const definition = {
  name: "map-pin-check-inside",
  nodes: [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      },
    ],
    [
      "path",
      {
        d: "m9 10 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the map-pin-check-inside icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MapPinCheckInside(options) {
  return createIcon(definition, options);
}

export default MapPinCheckInside;
