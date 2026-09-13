import { createIcon } from "../icon.js";

const definition = {
  name: "sigma-square",
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
        d: "M16 8.9V7H8l4 5-4 5h8v-1.9",
      },
    ],
  ],
};

/**
 * Creates the sigma-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SigmaSquare(options) {
  return createIcon(definition, options);
}

export default SigmaSquare;
