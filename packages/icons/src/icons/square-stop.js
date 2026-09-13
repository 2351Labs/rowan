import { createIcon } from "../icon.js";

const definition = {
  name: "square-stop",
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
      "rect",
      {
        x: "9",
        y: "9",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the square-stop icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareStop(options) {
  return createIcon(definition, options);
}

export default SquareStop;
