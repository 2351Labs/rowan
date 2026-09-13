import { createIcon } from "../icon.js";

const definition = {
  name: "circle-small",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the circle-small icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleSmall(options) {
  return createIcon(definition, options);
}

export default CircleSmall;
