import { createIcon } from "../icon.js";

const definition = {
  name: "laptop-2",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "12",
        x: "3",
        y: "4",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "line",
      {
        x1: "2",
        x2: "22",
        y1: "20",
        y2: "20",
      },
    ],
  ],
};

/**
 * Creates the laptop-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Laptop2(options) {
  return createIcon(definition, options);
}

export default Laptop2;
