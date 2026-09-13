import { createIcon } from "../icon.js";

const definition = {
  name: "map-pin-check",
  nodes: [
    [
      "path",
      {
        d: "M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728",
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
    [
      "path",
      {
        d: "m16 18 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the map-pin-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MapPinCheck(options) {
  return createIcon(definition, options);
}

export default MapPinCheck;
