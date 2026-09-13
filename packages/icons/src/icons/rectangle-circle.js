import { createIcon } from "../icon.js";

const definition = {
  name: "rectangle-circle",
  nodes: [
    [
      "path",
      {
        d: "M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
      },
    ],
    [
      "circle",
      {
        cx: "14",
        cy: "12",
        r: "8",
      },
    ],
  ],
};

/**
 * Creates the rectangle-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RectangleCircle(options) {
  return createIcon(definition, options);
}

export default RectangleCircle;
