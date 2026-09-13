import { createIcon } from "../icon.js";

const definition = {
  name: "slash-square",
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
        x1: "9",
        x2: "15",
        y1: "15",
        y2: "9",
      },
    ],
  ],
};

/**
 * Creates the slash-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SlashSquare(options) {
  return createIcon(definition, options);
}

export default SlashSquare;
