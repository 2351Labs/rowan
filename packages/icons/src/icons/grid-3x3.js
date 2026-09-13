import { createIcon } from "../icon.js";

const definition = {
  name: "grid-3x3",
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
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M3 15h18",
      },
    ],
    [
      "path",
      {
        d: "M9 3v18",
      },
    ],
    [
      "path",
      {
        d: "M15 3v18",
      },
    ],
  ],
};

/**
 * Creates the grid-3x3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grid3x3(options) {
  return createIcon(definition, options);
}

export default Grid3x3;
