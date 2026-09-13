import { createIcon } from "../icon.js";

const definition = {
  name: "square-power",
  nodes: [
    [
      "path",
      {
        d: "M12 7v4",
      },
    ],
    [
      "path",
      {
        d: "M7.998 9.003a5 5 0 1 0 8-.005",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the square-power icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquarePower(options) {
  return createIcon(definition, options);
}

export default SquarePower;
