import { createIcon } from "../icon.js";

const definition = {
  name: "square-arrow-up",
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
        d: "m16 12-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M12 16V8",
      },
    ],
  ],
};

/**
 * Creates the square-arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareArrowUp(options) {
  return createIcon(definition, options);
}

export default SquareArrowUp;
