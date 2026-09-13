import { createIcon } from "../icon.js";

const definition = {
  name: "square-x",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "m15 9-6 6",
      },
    ],
    [
      "path",
      {
        d: "m9 9 6 6",
      },
    ],
  ],
};

/**
 * Creates the square-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareX(options) {
  return createIcon(definition, options);
}

export default SquareX;
