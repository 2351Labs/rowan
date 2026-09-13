import { createIcon } from "../icon.js";

const definition = {
  name: "laptop-minimal",
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
 * Creates the laptop-minimal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LaptopMinimal(options) {
  return createIcon(definition, options);
}

export default LaptopMinimal;
