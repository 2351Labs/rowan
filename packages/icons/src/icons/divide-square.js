import { createIcon } from "../icon.js";

const definition = {
  name: "divide-square",
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
      "line",
      {
        x1: "8",
        x2: "16",
        y1: "12",
        y2: "12",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "16",
        y2: "16",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "8",
      },
    ],
  ],
};

/**
 * Creates the divide-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DivideSquare(options) {
  return createIcon(definition, options);
}

export default DivideSquare;
