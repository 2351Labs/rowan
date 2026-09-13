import { createIcon } from "../icon.js";

const definition = {
  name: "map-pin-plus",
  nodes: [
    [
      "path",
      {
        d: "M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738",
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
        d: "M16 18h6",
      },
    ],
    [
      "path",
      {
        d: "M19 15v6",
      },
    ],
  ],
};

/**
 * Creates the map-pin-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MapPinPlus(options) {
  return createIcon(definition, options);
}

export default MapPinPlus;
