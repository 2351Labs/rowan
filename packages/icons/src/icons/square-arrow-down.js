import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-down",
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
        d: "M12 8v8",
      },
    ],
    [
      "path",
      {
        d: "m8 12 4 4 4-4",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowDown(options) {
  return createIcon(definition, options);
}

export default SquareArrowDown;
