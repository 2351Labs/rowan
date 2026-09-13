import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-left-square",
  nodes: [
    [
      "path",
      {
        d: "M15 15 9 9",
      },
    ],
    [
      "path",
      {
        d: "M9 15V9h6",
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
 * Creates the arrow-up-left-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpLeftSquare(options) {
  return createIcon(definition, options);
}

export default ArrowUpLeftSquare;
