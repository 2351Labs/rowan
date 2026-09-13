import { createIcon } from "../icon.js";

const definition = {
  name: "minus-square",
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
        d: "M8 12h8",
      },
    ],
  ],
};

/**
 * Creates the minus-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MinusSquare(options) {
  return createIcon(definition, options);
}

export default MinusSquare;
