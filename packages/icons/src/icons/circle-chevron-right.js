import { createIcon } from "../icon.js";

const definition = {
  name: "circle-chevron-right",
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
        d: "m10 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the circle-chevron-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleChevronRight(options) {
  return createIcon(definition, options);
}

export default CircleChevronRight;
