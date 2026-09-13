import { createIcon } from "../icon.js";

const definition = {
  name: "circle-chevron-down",
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
        d: "m16 10-4 4-4-4",
      },
    ],
  ],
};

/**
 * Creates the circle-chevron-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleChevronDown(options) {
  return createIcon(definition, options);
}

export default CircleChevronDown;
