import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left-square",
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
        d: "m12 8-4 4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M16 12H8",
      },
    ],
  ],
};

/**
 * Creates the arrow-left-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeftSquare(options) {
  return createIcon(definition, options);
}

export default ArrowLeftSquare;
