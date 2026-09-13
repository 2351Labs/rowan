import { createIcon } from "../icon.js";

const definition = {
  name: "square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Square(options) {
  return createIcon(definition, options);
}

export default Square;
