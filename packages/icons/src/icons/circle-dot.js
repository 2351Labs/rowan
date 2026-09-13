import { createIcon } from "../icon.js";

const definition = {
  name: "circle-dot",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the circle-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleDot(options) {
  return createIcon(definition, options);
}

export default CircleDot;
