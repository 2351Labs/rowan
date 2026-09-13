import { createIcon } from "../icon.js";

const definition = {
  name: "square-pause",
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
      "line",
      {
        x1: "10",
        x2: "10",
        y1: "15",
        y2: "9",
      },
    ],
    [
      "line",
      {
        x1: "14",
        x2: "14",
        y1: "15",
        y2: "9",
      },
    ],
  ],
};

/**
 * Creates the square-pause icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquarePause(options) {
  return createIcon(definition, options);
}

export default SquarePause;
