import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-right",
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
        d: "m12 16 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M8 12h8",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowRight(options) {
  return createIcon(definition, options);
}

export default CircleArrowRight;
