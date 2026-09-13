import { createIcon } from "../icon.js";

const definition = {
  name: "circle-off",
  nodes: [
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M8.35 2.69A10 10 0 0 1 21.3 15.65",
      },
    ],
    [
      "path",
      {
        d: "M19.08 19.08A10 10 0 1 1 4.92 4.92",
      },
    ],
  ],
};

/**
 * Creates the circle-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleOff(options) {
  return createIcon(definition, options);
}

export default CircleOff;
