import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-square",
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
 * Creates the arrow-down-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownSquare(options) {
  return createIcon(definition, options);
}

export default ArrowDownSquare;
