import { createIcon } from "../icon.js";

const definition = {
  name: "square-check",
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
        d: "m16 9-5.5 5.5L8 12",
      },
    ],
  ],
};

/**
 * Creates the square-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareCheck(options) {
  return createIcon(definition, options);
}

export default SquareCheck;
