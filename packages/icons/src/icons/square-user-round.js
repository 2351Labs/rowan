import { createIcon } from "../icon.js";

const definition = {
  name: "square-user-round",
  nodes: [
    [
      "path",
      {
        d: "M18 21a6 6 0 0 0-12 0",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "11",
        r: "4",
      },
    ],
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
 * Creates the square-user-round icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareUserRound(options) {
  return createIcon(definition, options);
}

export default SquareUserRound;
