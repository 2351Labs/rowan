import { createIcon } from "../icon.js";

const definition = {
  name: "circle-equal",
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
        d: "M7 10h10",
      },
    ],
    [
      "path",
      {
        d: "M7 14h10",
      },
    ],
  ],
};

/**
 * Creates the circle-equal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleEqual(options) {
  return createIcon(definition, options);
}

export default CircleEqual;
