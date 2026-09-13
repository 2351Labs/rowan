import { createIcon } from "../icon.js";

const definition = {
  name: "circle-chevron-left",
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
        d: "m14 16-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the circle-chevron-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleChevronLeft(options) {
  return createIcon(definition, options);
}

export default CircleChevronLeft;
