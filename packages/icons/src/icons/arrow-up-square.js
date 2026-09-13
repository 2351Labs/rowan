import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-square",
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
 * Creates the arrow-up-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpSquare(options) {
  return createIcon(definition, options);
}

export default ArrowUpSquare;
