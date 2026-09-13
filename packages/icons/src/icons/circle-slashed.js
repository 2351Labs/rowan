import { createIcon } from "../icon.js";

const definition = {
  name: "circle-slashed",
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
        d: "M22 2 2 22",
      },
    ],
  ],
};

/**
 * Creates the circle-slashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleSlashed(options) {
  return createIcon(definition, options);
}

export default CircleSlashed;
