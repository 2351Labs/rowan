import { createIcon } from "../icon.js";

const definition = {
  name: "circle-parking-off",
  nodes: [
    [
      "path",
      {
        d: "M12.656 7H13a3 3 0 0 1 2.984 3.307",
      },
    ],
    [
      "path",
      {
        d: "M13 13H9",
      },
    ],
    [
      "path",
      {
        d: "M19.071 19.071A1 1 0 0 1 4.93 4.93",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M8.357 2.687a10 10 0 0 1 12.956 12.956",
      },
    ],
    [
      "path",
      {
        d: "M9 17V9",
      },
    ],
  ],
};

/**
 * Creates the circle-parking-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleParkingOff(options) {
  return createIcon(definition, options);
}

export default CircleParkingOff;
