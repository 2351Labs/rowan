import { createIcon } from "../icon.js";

const definition = {
  name: "square-radical",
  nodes: [
    [
      "path",
      {
        d: "M7 12h2l2 5 2-10h4",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the square-radical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareRadical(options) {
  return createIcon(definition, options);
}

export default SquareRadical;
