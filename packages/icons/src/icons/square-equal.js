import { createIcon } from "../icon.js";

const definition = {
  name: "square-equal",
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
 * Creates the square-equal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareEqual(options) {
  return createIcon(definition, options);
}

export default SquareEqual;
