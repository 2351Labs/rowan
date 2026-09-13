import { createIcon } from "../icon.js";

const definition = {
  name: "circle-check-big",
  nodes: [
    [
      "path",
      {
        d: "M21.801 10A10 10 0 1 1 17 3.335",
      },
    ],
    [
      "path",
      {
        d: "m9 11 3 3L22 4",
      },
    ],
  ],
};

/**
 * Creates the circle-check-big icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleCheckBig(options) {
  return createIcon(definition, options);
}

export default CircleCheckBig;
